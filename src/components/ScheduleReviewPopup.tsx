"use client";

/**
 * Schedule Review popup.
 *
 * Renders a button which, when clicked, opens a modal containing the
 * `schedule-review` form fetched live from the OpticWise CRM via
 * RemoteFormRenderer. The CRM is the source of truth for form fields,
 * validation, success message, and submission.
 *
 * Used by:
 *   - SiteHeaderView: nav button-style items wired to the popup (e.g.
 *     href="/ppp-audit/" or "#form/schedule-review")
 *   - CTASection / CallToActionBlock: in-page CTAs
 *   - Anywhere else a "Schedule Your Review" CTA needs to live
 */

import { useEffect, useState } from "react";
import { RemoteFormRenderer } from "./forms/RemoteFormRenderer";

const FORM_SLUG = "schedule-review";

export function ScheduleReviewButton({
  className = "btn btn-white btn-lg",
  label = "Schedule Your Review",
}: {
  className?: string;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        {label}
      </button>
      {isOpen && <ScheduleReviewModal onClose={() => setIsOpen(false)} />}
    </>
  );
}

function ScheduleReviewModal({ onClose }: { onClose: () => void }) {
  // Lock body scroll while open & close on Escape key
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-review-title"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between rounded-t-2xl border-b border-gray-200 bg-white px-6 py-4">
          <div>
            <h2
              id="schedule-review-title"
              className="text-xl font-bold text-gray-900"
            >
              Schedule Your Review
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Complimentary CRE Data &amp; Digital Review Session
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <RemoteFormRenderer
            formSlug={FORM_SLUG}
            compact
            submitClassName="w-full rounded-lg bg-ow-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
}
