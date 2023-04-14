import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { openSheet, closeSheet } from "../../store/Sheets";
import { selectAuthState } from "../../store/Auth";
import { acceptedMimeTypes } from "../../utils/media";

const FileDropOverlay = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector(selectAuthState);
  const disallowedRoutes = ["/settings"];
  const shouldRenderOverlay = !disallowedRoutes.includes(router.pathname);
  const sheetKey = "postSheet";

  useEffect(() => {
    if (!shouldRenderOverlay) return;

    const onDragOver = (e) => {
      e.preventDefault();
      const items = e.dataTransfer.items;
      if (items.length > 0 && acceptedMimeTypes.includes(items[0].type)) {
        if (authState?.user?.pk) {
          dispatch(openSheet(sheetKey));
        } else {
          router.push("/login");
        }
      }
    };

    const onDrop = (e) => {
      e.preventDefault();
    };

    document.body.addEventListener("dragover", onDragOver);
    document.body.addEventListener("drop", onDrop);

    return () => {
      document.body.removeEventListener("dragover", onDragOver);
      document.body.removeEventListener("drop", onDrop);
    };
  }, [dispatch, shouldRenderOverlay, authState?.user?.pk]);

  return null;
};

export default FileDropOverlay;
