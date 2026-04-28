"use client";

/**
 * RemoteFormRenderer
 *
 * Schema-driven form renderer for forms hosted by the OpticWise CRM
 * (ownet.opticwise.com). On mount it fetches the form schema from
 *   GET  ${API}/api/public/forms/${slug}
 * Renders fields described by the schema, then on submit POSTs to
 *   POST ${API}/api/public/forms/${slug}/submit
 *
 * Used by:
 *   - ScheduleReviewPopup (in a modal)
 *   - FormEmbedBlock (inline on a page)
 *
 * The CRM owns the field definitions, validation rules, success message,
 * and honeypot field name — this component just plays back what the API
 * tells it. Adding a new form on the CRM side means setting `formSlug`
 * here and nothing else changes.
 */

import { useEffect, useMemo, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_OW_API_URL || "https://ownet.opticwise.com";

type FieldType =
  | "text"
  | "email"
  | "tel"
  | "url"
  | "number"
  | "textarea"
  | "select"
  | "checkbox";

interface FormFieldOption {
  label: string;
  value: string;
}

interface FormFieldSchema {
  id: string;
  label: string;
  fieldKey: string;
  fieldType: FieldType;
  required: boolean;
  placeholder?: string | null;
  helpText?: string | null;
  options?: FormFieldOption[] | null;
}

interface FormSchema {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  submitButtonLabel?: string | null;
  successMessage?: string | null;
  honeypotFieldName?: string | null;
  fields: FormFieldSchema[];
}

type Values = Record<string, string | boolean>;

export interface RemoteFormRendererProps {
  formSlug: string;
  /**
   * If true, the renderer styles itself for placement inside a card/popup
   * with a white background. If false (default), it renders for placement
   * on a page section that may have its own background.
   */
  compact?: boolean;
  /**
   * Override the API success message with custom UI. The default message
   * comes from the form schema's `successMessage`.
   */
  onSubmitSuccess?: (submissionId: string) => void;
  /**
   * Optional CSS class to apply to the submit button so it matches the
   * surrounding context (e.g. `btn btn-primary`). Falls back to a sensible default.
   */
  submitClassName?: string;
}

export function RemoteFormRenderer({
  formSlug,
  compact = false,
  onSubmitSuccess,
  submitClassName,
}: RemoteFormRendererProps) {
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [loadError, setLoadError] = useState<string>("");
  const [values, setValues] = useState<Values>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [success, setSuccess] = useState<{ id: string; message: string } | null>(
    null,
  );

  // Fetch the schema once on mount (per slug)
  useEffect(() => {
    let aborted = false;
    setSchema(null);
    setLoadError("");
    setSuccess(null);
    setValues({});

    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/public/forms/${formSlug}`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          throw new Error(`Form schema request returned ${res.status}`);
        }
        const data = await res.json();
        const form: FormSchema | undefined = data?.form;
        if (!form || !Array.isArray(form.fields)) {
          throw new Error("Form schema response is malformed");
        }
        if (aborted) return;
        setSchema(form);

        // Initialize default values: empty strings for inputs, false for checkboxes,
        // plus an empty string for the honeypot if the schema specifies one.
        const initial: Values = {};
        for (const f of form.fields) {
          initial[f.fieldKey] = f.fieldType === "checkbox" ? false : "";
        }
        if (form.honeypotFieldName) initial[form.honeypotFieldName] = "";
        setValues(initial);
      } catch (err) {
        if (aborted) return;
        // Keep the message generic — most users don't care about the cause.
        setLoadError(
          "We couldn't load this form right now. Please refresh the page or try again in a moment.",
        );
        // eslint-disable-next-line no-console
        console.error("[RemoteFormRenderer] load failed:", err);
      }
    })();

    return () => {
      aborted = true;
    };
  }, [formSlug]);

  const setField = (key: string, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const submitLabel = useMemo(() => {
    if (submitting) return "Submitting…";
    return schema?.submitButtonLabel?.trim() || "Submit";
  }, [schema, submitting]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!schema) return;
    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await fetch(
        `${API_URL}/api/public/forms/${schema.slug}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok || body?.ok === false) {
        const msg =
          body?.message ||
          body?.error ||
          "Something went wrong submitting the form. Please try again.";
        throw new Error(msg);
      }
      const message =
        schema.successMessage?.trim() ||
        body?.message ||
        "Thanks — we'll be in touch shortly.";
      const id: string = body?.submissionId || "";
      setSuccess({ id, message });
      onSubmitSuccess?.(id);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong submitting the form. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ---- render states ------------------------------------------------------

  if (loadError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {loadError}
      </div>
    );
  }

  if (!schema) {
    return (
      <div className="space-y-3" aria-busy="true">
        <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200/70" />
        <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200/70" />
        <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200/70" />
      </div>
    );
  }

  if (success) {
    return (
      <div className={`text-center ${compact ? "px-2 py-6" : "px-2 py-10"}`}>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-7 w-7 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="mb-1 text-lg font-bold text-gray-900">Thank you</h3>
        <p className="text-gray-600">{success.message}</p>
      </div>
    );
  }

  const honeypotName = schema.honeypotFieldName;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      {schema.fields.map((field) => (
        <FieldRow
          key={field.id}
          field={field}
          value={values[field.fieldKey]}
          onChange={(v) => setField(field.fieldKey, v)}
        />
      ))}

      {honeypotName ? (
        // Bot honeypot — invisible to humans, must stay empty
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-10000px",
            top: "auto",
            width: 1,
            height: 1,
            overflow: "hidden",
          }}
        >
          <label htmlFor={`hp-${honeypotName}`}>Leave this field empty</label>
          <input
            id={`hp-${honeypotName}`}
            name={honeypotName}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={String(values[honeypotName] ?? "")}
            onChange={(e) => setField(honeypotName, e.target.value)}
          />
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className={
          submitClassName ||
          "w-full rounded-lg bg-ow-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        }
      >
        {submitLabel}
      </button>
    </form>
  );
}

// ---- field row ----------------------------------------------------------

function FieldRow({
  field,
  value,
  onChange,
}: {
  field: FormFieldSchema;
  value: string | boolean | undefined;
  onChange: (v: string | boolean) => void;
}) {
  const id = `ff-${field.fieldKey}`;
  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-ow-blue";

  if (field.fieldType === "checkbox") {
    return (
      <div className="flex items-start gap-2">
        <input
          id={id}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          required={field.required}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-ow-blue focus:ring-ow-blue"
        />
        <label htmlFor={id} className="text-sm text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500"> *</span>}
        </label>
      </div>
    );
  }

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>

      {field.fieldType === "textarea" ? (
        <textarea
          id={id}
          name={field.fieldKey}
          required={field.required}
          placeholder={field.placeholder || undefined}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className={`${inputClass} resize-none`}
        />
      ) : field.fieldType === "select" ? (
        <select
          id={id}
          name={field.fieldKey}
          required={field.required}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        >
          <option value="">Select…</option>
          {(field.options || []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={field.fieldKey}
          type={
            field.fieldType === "email"
              ? "email"
              : field.fieldType === "tel"
                ? "tel"
                : field.fieldType === "url"
                  ? "url"
                  : field.fieldType === "number"
                    ? "number"
                    : "text"
          }
          required={field.required}
          placeholder={field.placeholder || undefined}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
          autoComplete={
            field.fieldType === "email"
              ? "email"
              : field.fieldKey === "first_name"
                ? "given-name"
                : field.fieldKey === "last_name"
                  ? "family-name"
                  : field.fieldKey === "company"
                    ? "organization"
                    : field.fieldKey === "phone"
                      ? "tel"
                      : "off"
          }
        />
      )}

      {field.helpText && (
        <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
      )}
    </div>
  );
}
