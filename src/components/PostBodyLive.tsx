"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import { RichContent } from "./RichContent";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

/**
 * Wraps a Post body with Payload's `useLivePreview` hook so the
 * insights/[slug] route updates on every keystroke when viewed
 * inside the admin Live Preview iframe. Outside the iframe this
 * is a no-op pass-through that just renders the server-supplied data.
 */
export function PostBodyLive({ initialData }: { initialData: any }) {
  const { data } = useLivePreview<any>({
    initialData,
    serverURL: SERVER_URL,
    depth: 2,
  });

  const html = data?.htmlContent ?? initialData?.htmlContent;
  return <RichContent html={html} />;
}
