"use client";

import Link from "next/link";
import { ScheduleReviewButton } from "../ScheduleReviewPopup";

export default function HeroBlock({
  eyebrow,
  heading,
  lede,
  reframeLine,
  audienceLine,
  primaryCtaLabel = "Schedule Your Review",
  secondaryCtaLabel,
  secondaryCtaHref,
  style = "dark",
}: any) {
  return (
    <section className={`hero hero--${style}`}>
      <div className="hero__bg" aria-hidden="true" />
      <div className="container">
        <div className="hero__content">
          {eyebrow && <span className="eyebrow hero__eyebrow">{eyebrow}</span>}
          <h1 className="h-display hero__heading">{heading}</h1>
          {lede && <p className="lede hero__lede">{lede}</p>}
          {reframeLine && <p className="hero__reframe">{reframeLine}</p>}
          {audienceLine && <p className="hero__audience">{audienceLine}</p>}
          <div className="hero__cta">
            <ScheduleReviewButton
              className="btn btn-primary btn-arrow"
              label={primaryCtaLabel}
            />
            {secondaryCtaLabel && secondaryCtaHref && (
              <Link href={secondaryCtaHref} className="btn btn-secondary">
                {secondaryCtaLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
