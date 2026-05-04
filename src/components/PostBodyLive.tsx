"use client";

import { useState } from "react";
import { useLivePreview } from "@payloadcms/live-preview-react";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import { RichContent } from "./RichContent";

/**
 * Wraps a Post body with Payload's `useLivePreview` hook so the
 * insights/[slug] route updates on every keystroke when viewed
 * inside the admin Live Preview iframe.
 *
 * Content source precedence:
 *   1. `content` — Payload rich text (Lexical). Preferred path for all
 *      new posts authored in the admin.
 *   2. `htmlContent` — legacy HTML fallback. Used for posts imported
 *      from the prior Ghost/Strikingly install, and any post where the
 *      rich editor is intentionally empty.
 *
 * This matches the intent documented on the Posts collection
 * (`htmlContent.admin.description`). We convert Lexical -> HTML on the
 * client using Payload's official sync converter so everything
 * (headings, lists, links, inline uploads, etc.) renders correctly.
 */

function hasMeaningfulHtml(html: string): boolean {
  if (!html) return false;
  return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, "").trim().length > 0;
}

function lexicalToHtmlSafe(content: unknown): string {
  if (!content || typeof content !== "object") return "";
  const root = (content as { root?: unknown }).root;
  if (!root || typeof root !== "object") return "";
  try {
    return convertLexicalToHTML({
      data: content as any,
      disableContainer: true,
    });
  } catch {
    return "";
  }
}

export function PostBodyLive({ initialData }: { initialData: any }) {
  const [serverURL] = useState<string>(() =>
    typeof window !== "undefined" ? window.location.origin : ""
  );

  const { data } = useLivePreview<any>({
    initialData,
    serverURL,
    depth: 2,
  });

  const lexical = data?.content ?? initialData?.content;
  const lexicalHtml = lexicalToHtmlSafe(lexical);
  const html = hasMeaningfulHtml(lexicalHtml)
    ? lexicalHtml
    : (data?.htmlContent ?? initialData?.htmlContent ?? "");

  return <RichContent html={html} />;
}
