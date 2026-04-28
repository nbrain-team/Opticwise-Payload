"use client";

import { RemoteFormRenderer } from "../forms/RemoteFormRenderer";

/**
 * FormEmbedBlock — frontend renderer for the `formEmbed` Payload block.
 *
 * Editors set `formSlug` on the block (default "schedule-review") and
 * optionally `eyebrow`, `heading`, `description`, and `style`. The form
 * itself is rendered by RemoteFormRenderer, which fetches the field schema
 * from the OpticWise CRM at request time so the CRM stays the source of truth.
 */
export default function FormEmbedBlock({
  formSlug,
  eyebrow,
  heading,
  description,
  style = "light",
}: {
  formSlug?: string;
  eyebrow?: string;
  heading?: string;
  description?: string;
  style?: "light" | "dark" | "plain";
}) {
  const slug = (formSlug || "schedule-review").trim();

  const sectionBg =
    style === "dark"
      ? "bg-ow-navy text-white"
      : style === "plain"
        ? "bg-transparent"
        : "bg-gray-50";

  const cardClass =
    style === "plain"
      ? ""
      : "rounded-2xl bg-white p-6 shadow-sm md:p-8";

  return (
    <section className={`${sectionBg} py-16 md:py-20`}>
      <div className="ow-container">
        <div className="mx-auto max-w-2xl">
          {(eyebrow || heading || description) && (
            <div className="mb-6 text-center">
              {eyebrow && (
                <p
                  className={`mb-2 text-xs font-bold uppercase tracking-widest ${
                    style === "dark" ? "text-blue-200" : "text-ow-blue"
                  }`}
                >
                  {eyebrow}
                </p>
              )}
              {heading && (
                <h2
                  className={`text-2xl font-extrabold leading-tight md:text-3xl ${
                    style === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {heading}
                </h2>
              )}
              {description && (
                <p
                  className={`mt-3 text-base leading-relaxed ${
                    style === "dark" ? "text-white/80" : "text-gray-600"
                  }`}
                >
                  {description}
                </p>
              )}
            </div>
          )}

          <div className={cardClass}>
            <RemoteFormRenderer formSlug={slug} />
          </div>
        </div>
      </div>
    </section>
  );
}
