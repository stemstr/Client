import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
  useRef,
  RefObject,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { NDKEvent, NDKUser, mergeEvent } from "@nostr-dev-kit/ndk";
import { noop } from "utils/common";
import {
  CompositeDecorator,
  ContentBlock,
  ContentState,
  EditorState,
  Modifier,
} from "draft-js";
import { Box } from "@mantine/core";
import { useUsers } from "ndk/hooks/useUsers";
import { profileEventsCache } from "ndk/inMemoryCacheAdapter";
import { useNDK } from "ndk/NDKProvider";
import { nip19 } from "nostr-tools";

export enum DraftEntityType {
  Mention = "MENTION",
}

type MentionEntityData = {
  mention: NDKUser;
};

interface DraftEditorContextProps {
  editorState: EditorState;
  setEditorState: Dispatch<SetStateAction<EditorState>>;
  replyingTo?: NDKEvent;
}

type HandleMentionFunc = (user?: NDKUser) => void;

type DraftEditorContextType = DraftEditorContextProps & {
  contentBodyRef?: RefObject<HTMLDivElement>;
  mentionQuery?: string;
  setMentionQuery: Dispatch<SetStateAction<string | undefined>>;
  handleMention: HandleMentionFunc;
  editorState: EditorState;
  handleEditorChange: (newEditorState: EditorState) => void;
  selectCurrentMentionOption: () => void;
  navigateMentionList: (step: number) => void;
  mentionOptions: NDKUser[];
  focusedOptionIndex: number;
  canPost: boolean;
  rawNoteContent: string;
};

const DraftEditorContext = createContext<DraftEditorContextType>({
  handleMention: noop,
  setMentionQuery: noop,
  handleEditorChange: noop,
  editorState: EditorState.createEmpty(),
  setEditorState: noop,
  selectCurrentMentionOption: noop,
  navigateMentionList: noop,
  mentionOptions: [],
  focusedOptionIndex: 0,
  canPost: false,
  rawNoteContent: "",
});

export const DraftEditorProvider = ({
  editorState,
  setEditorState,
  replyingTo,
  children,
}: PropsWithChildren<DraftEditorContextProps>) => {
  const { ndk } = useNDK();
  const [mentionQuery, setMentionQuery] = useState<string>();
  const contentBodyRef = useRef<HTMLDivElement>(null);
  const rawNoteContent = useMemo(() => {
    let content = convertToRawNoteContent(editorState);
    return content;
  }, [editorState]);
  const canPost = Boolean(rawNoteContent.length);

  const handleEditorChange = useCallback(
    (newEditorState: EditorState) => {
      const contentState = newEditorState.getCurrentContent();

      // Get the current selection
      const selection = newEditorState.getSelection();

      // Get the current block
      const currentBlock = contentState.getBlockForKey(
        selection.getAnchorKey()
      );

      // Get the selection's anchor offset
      const anchorOffset = selection.getAnchorOffset();

      // Get the current block's text
      const text = currentBlock.getText().slice(0, anchorOffset);

      // Check if the cursor is within a mention entity
      let isCursorWithinMentionEntity = false;
      currentBlock.findEntityRanges(
        (character) => {
          const entityKey = character.getEntity();
          return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() ===
              DraftEntityType.Mention
          );
        },
        (start, end) => {
          if (anchorOffset >= start && anchorOffset <= end) {
            isCursorWithinMentionEntity = true;
          }
        }
      );

      const trigger = /(^|\s)\@[\w]*$/; // Check if the last word starts with "@" (mention trigger)

      if (trigger.test(text) && !isCursorWithinMentionEntity) {
        const query = text.match(/\@([\w]*)$/)![1]; // Extract the mention query
        setMentionQuery(query);
      } else {
        setMentionQuery(undefined);
      }

      setEditorState(newEditorState);
    },
    [setMentionQuery]
  );

  const handleMention = (mention?: NDKUser) => {
    if (!mention || !editorState) return;

    const mentionText = `@${mention.profile?.name}`;

    const contentState = editorState.getCurrentContent();

    // Get the current selection
    const selection = editorState.getSelection();

    // Get the current block's text
    const blockText = contentState
      .getBlockForKey(selection.getAnchorKey())
      .getText();

    // Find the start position of the currently typed mention
    const mentionStart = blockText.lastIndexOf(
      "@",
      selection.getAnchorOffset() - 1
    );

    // Calculate the end position of the currently typed mention
    const mentionEnd = mentionStart + mentionText.length;

    //   Create a new content state with the selected mention as an entity
    const entityData: MentionEntityData = { mention: mention };
    const contentStateWithEntity = contentState.createEntity(
      DraftEntityType.Mention,
      "IMMUTABLE",
      entityData
    );

    // Get the entity key for the mention
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    // Create a new content state with the mention entity
    const contentWithMention = Modifier.replaceText(
      contentStateWithEntity,
      selection.merge({
        anchorOffset: mentionStart,
        focusOffset:
          mentionStart + blockText.slice(mentionStart).search(/\s|$/),
      }),
      mentionText,
      undefined,
      entityKey
    );

    // Insert a space character after the "MENTION" entity
    const contentWithSpace = Modifier.insertText(
      contentWithMention,
      selection.merge({
        anchorOffset: mentionEnd,
        focusOffset: mentionEnd,
      }),
      " "
    );

    // Create a new editor state with the updated content state
    const newEditorState = EditorState.push(
      editorState,
      contentWithSpace,
      "insert-characters"
    );

    // Move the cursor to the end of the mention
    const updatedSelection = selection.merge({
      anchorOffset: mentionEnd + 1, // +1 to account for space
      focusOffset: mentionEnd + 1,
    });

    const finalEditorState = EditorState.forceSelection(
      newEditorState,
      updatedSelection
    );

    handleEditorChange(finalEditorState);
  };

  const [focusedOptionIndex, setFocusedOptionIndex] = useState(0);
  const mentionOptionPubkeys = useMemo<string[]>(() => {
    const users: NDKUser[] = [];
    const normalizedQuery = mentionQuery?.toLowerCase() ?? "";
    if (!normalizedQuery) return [];
    for (const key in profileEventsCache) {
      if (profileEventsCache.hasOwnProperty(key)) {
        const ndkEvent = new NDKEvent(ndk, profileEventsCache[key]);
        const ndkUser = ndkEvent.author;
        ndkUser.profile = mergeEvent(ndkEvent, {});
        if (
          ndkUser.profile?.name?.toLowerCase().includes(normalizedQuery) ||
          ndkUser.profile?.displayName?.toLowerCase().includes(normalizedQuery)
        )
          users.push(ndkUser);
      }
    }
    // sort by displayName starts with query
    users.sort((a, b) => {
      return (
        Number(b.profile?.displayName?.startsWith(normalizedQuery)) -
        Number(a.profile?.displayName?.startsWith(normalizedQuery))
      );
    });
    // sort by name starts with query
    users.sort((a, b) => {
      return (
        Number(b.profile?.name?.startsWith(normalizedQuery)) -
        Number(a.profile?.name?.startsWith(normalizedQuery))
      );
    });
    return users.map((user) => user.hexpubkey());
  }, [mentionQuery]);
  const mentionOptions = useUsers(mentionOptionPubkeys);
  const selectCurrentMentionOption = useCallback(() => {
    handleMention(mentionOptions[focusedOptionIndex]);
  }, [mentionOptions]);
  const navigateMentionList = useCallback(
    (step: number) => {
      if (mentionOptions.length > 0) {
        let newIndex =
          (focusedOptionIndex + step + mentionOptions.length) %
          mentionOptions.length;
        setFocusedOptionIndex(newIndex);
      }
    },
    [focusedOptionIndex, mentionOptions.length, setFocusedOptionIndex]
  );

  useEffect(() => {
    setFocusedOptionIndex(0);
  }, [mentionQuery]);

  return (
    <DraftEditorContext.Provider
      value={{
        editorState,
        setEditorState,
        replyingTo,
        contentBodyRef,
        mentionQuery,
        setMentionQuery,
        handleMention,
        handleEditorChange,
        selectCurrentMentionOption,
        navigateMentionList,
        mentionOptions,
        focusedOptionIndex,
        canPost,
        rawNoteContent,
      }}
    >
      {children}
    </DraftEditorContext.Provider>
  );
};

type RawDraftEntity = {
  type: string;
  mutability: "IMMUTABLE" | "MUTABLE" | "SEGMENTED";
  data: Record<string, any>;
};

type BlockPart = {
  start: number;
  end: number;
  text?: string;
  entity?: RawDraftEntity;
};

function convertToRawNoteContent(editorState: EditorState): string {
  let content = "";
  const contentState = editorState.getCurrentContent();
  const contentBlocks = contentState.getBlocksAsArray();
  for (let [index, contentBlock] of contentBlocks.entries()) {
    const currentBlockParts: BlockPart[] = [];
    const text = contentBlock.getText();
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        return entityKey !== null;
      },
      (start, end) => {
        if (!currentBlockParts.length) {
          currentBlockParts.push({
            start: 0,
            end: start,
            text: text.substring(0, start),
          });
        } else {
          const textStart = currentBlockParts[currentBlockParts.length - 1].end;
          const textEnd = start;
          currentBlockParts.push({
            start: textStart,
            end: textEnd,
            text: text.substring(textStart, textEnd),
          });
        }
        const entityKey = contentBlock.getEntityAt(start);
        const entity = contentState.getEntity(entityKey);
        currentBlockParts.push({
          start,
          end,
          entity: {
            type: entity.getType(),
            mutability: entity.getMutability(),
            data: entity.getData(),
          },
        });
      }
    );
    const textStart = currentBlockParts.length
      ? currentBlockParts[currentBlockParts.length - 1].end
      : 0;
    currentBlockParts.push({
      start: textStart,
      end: text.length,
      text: text.substring(textStart),
    });

    if (index > 0) {
      content += "\n";
    }
    currentBlockParts.forEach((blockPart) => {
      if (blockPart.text) {
        content += blockPart.text;
      } else if (blockPart.entity) {
        content += entityToText(blockPart.entity);
      }
    });
  }

  return content;
}

function entityToText(entity: RawDraftEntity): string {
  let text = "";

  switch (entity.type) {
    case DraftEntityType.Mention:
      let data = entity.data as MentionEntityData;
      const npubEncoded = nip19.npubEncode(data.mention.hexpubkey());
      text = `nostr:${npubEncoded}`;
      break;
  }

  return text;
}

function mentionStrategy(
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void
) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      ContentState.createFromText("").getEntity(entityKey).getType() ===
        DraftEntityType.Mention
    );
  }, callback);
}

function MentionSpan(props: PropsWithChildren) {
  return (
    <Box component="span" c="purple.5">
      {props.children}
    </Box>
  );
}

export const draftEditorDecorator = new CompositeDecorator([
  {
    strategy: mentionStrategy,
    component: MentionSpan,
  },
]);

export const useDraftEditor = () => {
  const context = useContext(DraftEditorContext);
  if (context === undefined) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};
