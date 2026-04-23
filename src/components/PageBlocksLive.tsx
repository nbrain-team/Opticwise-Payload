"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import { BlockRenderer } from "./BlockRenderer";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

/**
 * Wraps the block layout for a Page document with Payload's
 * `useLivePreview` hook. Outside the admin Live Preview iframe this
 * is a no-op — `data` stays equal to `initialData`. Inside the
 * iframe, every keystroke in the editor triggers a re-render here.
 */
export function PageBlocksLive({
  initialData,
}: {
  initialData: any;
}) {
  const { data } = useLivePreview<any>({
    initialData,
    serverURL: SERVER_URL,
    depth: 2,
  });

  const layout = data?.layout || initialData?.layout || [];
  return <BlockRenderer blocks={layout} />;
}
