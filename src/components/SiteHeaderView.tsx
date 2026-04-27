"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ScheduleReviewButton } from "./ScheduleReviewPopup";

export interface NavItemView {
  label: string;
  href?: string;
  style?: "link" | "button" | "dropdown";
  children?: { label: string; href: string }[];
}

interface SiteHeaderViewProps {
  items: NavItemView[];
}

export function SiteHeaderView({ items }: SiteHeaderViewProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkColor = scrolled
    ? "text-gray-600 hover:text-ow-blue"
    : "text-white/85 hover:text-white";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/97 backdrop-blur-xl shadow-sm py-2.5" : "py-4"
      }`}
    >
      <div className="ow-container flex items-center justify-between">
        <Link href="/">
          <Image
            src="/images/ow_logo.png"
            alt="OpticWise"
            width={150}
            height={36}
            className="h-9 w-auto"
            priority
          />
        </Link>

        <ul className="hidden lg:flex items-center gap-8">
          {items.map((item, idx) => {
            if (item.style === "dropdown") {
              const children = item.children || [];
              return (
                <li
                  key={`${item.label}-${idx}`}
                  className="nav__dropdown"
                  tabIndex={0}
                >
                  <span
                    className={`nav__dropdown-trigger text-sm font-medium ${
                      scrolled ? "!text-gray-600" : "!text-white/85"
                    }`}
                  >
                    {item.label}
                  </span>
                  <div className="nav__dropdown-menu">
                    {children.map((c) => (
                      <Link key={c.href} href={c.href} className="nav__link">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </li>
              );
            }
            if (item.style === "button" && item.href) {
              return (
                <li key={`${item.label}-${idx}`}>
                  <Link href={item.href} className="btn btn-nav">
                    {item.label}
                  </Link>
                </li>
              );
            }
            return (
              <li key={`${item.label}-${idx}`}>
                <Link
                  href={item.href || "#"}
                  className={`text-sm font-medium transition-colors ${linkColor}`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <span className="hidden lg:inline-flex">
          <ScheduleReviewButton className="btn btn-nav" label="Schedule Review" />
        </span>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2"
          aria-label="Menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`block w-5 h-0.5 rounded ${scrolled ? "bg-gray-800" : "bg-white"} ${
                i < 2 ? "mb-1.5" : ""
              }`}
            />
          ))}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 mobile-menu-enter">
          <div className="ow-container py-4 flex flex-col gap-1">
            {items.flatMap((item, idx) => {
              if (item.style === "dropdown") {
                return (item.children || []).map((c) => (
                  <Link
                    key={`${idx}-${c.href}`}
                    href={c.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-gray-600 hover:text-ow-blue py-2.5 border-b border-gray-100"
                  >
                    {c.label}
                  </Link>
                ));
              }
              return [
                <Link
                  key={`${idx}-${item.label}`}
                  href={item.href || "#"}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-gray-600 hover:text-ow-blue py-2.5 border-b border-gray-100"
                >
                  {item.label}
                </Link>,
              ];
            })}
            <ScheduleReviewButton
              className="btn btn-primary text-center mt-3 text-sm py-3"
              label="Schedule Review"
            />
          </div>
        </div>
      )}
    </nav>
  );
}
