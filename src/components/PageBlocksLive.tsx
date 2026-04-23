"use client";

import { useState } from "react";
import { useLivePreview } from "@payloadcms/live-preview-react";
import { BlockRenderer } from "./BlockRenderer";

/**
 * Wraps a Page document with Payload's `useLivePreview` hook.
 *
 * `serverURL` is derived from `window.location.origin` via a lazy
 * initializer so it is correct on the very first client render. The
 * live-preview hook does a strict `event.origin === serverURL` check,
 * and admin + frontend share the same Vercel deployment, so this
 * always matches without depending on a build-time env var.
 *
 * Outside the admin Live Preview iframe this is a no-op pass-through.
 */
export function PageBlocksLive({ initialData }: { initialData: any }) {
  const [serverURL] = useState<string>(() =>
    typeof window !== "undefined" ? window.location.origin : ""
  );

  const { data } = useLivePreview<any>({
    initialData,
    serverURL,
    depth: 2,
  });

  const layout = data?.layout || initialData?.layout || [];
  return <BlockRenderer blocks={layout} />;
}
