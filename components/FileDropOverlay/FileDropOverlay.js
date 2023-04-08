import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { openSheet, closeSheet } from "../../store/Sheets";

const FileDropOverlay = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const disallowedRoutes = ["/settings"];
  const shouldRenderOverlay = !disallowedRoutes.includes(router.pathname);
  const sheetKey = "postSheet";

  useEffect(() => {
    if (!shouldRenderOverlay) return;

    const onDragOver = (e) => {
      e.preventDefault();
      const items = e.dataTransfer.items;
      if (items.length > 0 && items[0].type.startsWith("audio/")) {
        dispatch(openSheet(sheetKey));
      }
    };

    const onDrop = (e) => {
      e.preventDefault();
    };

    document.body.addEventListener("dragover", onDragOver);
    document.body.addEventListener("drop", onDrop);
    document.body.addEventListener("dragleave", onDragLeave);

    return () => {
      document.body.removeEventListener("dragover", onDragOver);
      document.body.removeEventListener("drop", onDrop);
      document.body.removeEventListener("dragleave", onDragLeave);
    };
  }, [dispatch, shouldRenderOverlay]);

  return null;
};

export default FileDropOverlay;
