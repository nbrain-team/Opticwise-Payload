"use client";

import { useState } from "react";
import { useLivePreview } from "@payloadcms/live-preview-react";
import { RichContent } from "./RichContent";

/**
 * Wraps a Post body with Payload's `useLivePreview` hook so the
 * insights/[slug] route updates on every keystroke when viewed
 * inside the admin Live Preview iframe.
 *
 * `serverURL` is derived from `window.location.origin` via a lazy
 * initializer so the very first client render already has the
 * correct value (the hook's `ready` message is only sent once, so it
 * must be sent with the right serverURL the first time).
 */
export function PostBodyLive({ initialData }: { initialData: any }) {
  const [serverURL] = useState<string>(() =>
    typeof window !== "undefined" ? window.location.origin : ""
  );

  const { data } = useLivePreview<any>({
    initialData,
    serverURL,
    depth: 2,
  });

  const html = data?.htmlContent ?? initialData?.htmlContent;
  return <RichContent html={html} />;
}
