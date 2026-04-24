"use client";

import { ScheduleReviewButton } from "../ScheduleReviewPopup";

export default function CallToActionBlock({
  eyebrow,
  heading,
  subheading,
  bulletPoints,
  buttonLabel = "Schedule Your Review",
  style = "blue",
}: any) {
  return (
    <section className={`cta cta--${style}`} id="cta">
      <div className="container">
        <div className="cta__inner">
          {eyebrow && <span className="eyebrow cta__eyebrow">{eyebrow}</span>}
          <h2 className="h2 cta__heading">{heading}</h2>
          {subheading && <p className="cta__sub">{subheading}</p>}
          {bulletPoints && bulletPoints.length > 0 && (
            <ul className="cta__bullets">
              {bulletPoints.map((b: any, i: number) => (
                <li key={i} className="cta__bullet">
                  {b.text}
                </li>
              ))}
            </ul>
          )}
          <ScheduleReviewButton
            className={
              style === "light"
                ? "btn btn-primary btn-arrow"
                : "btn btn-light btn-arrow"
            }
            label={buttonLabel}
          />
        </div>
      </div>
    </section>
  );
}
