import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/site";
import { getFooter } from "@/lib/payload-helpers";

type FooterLink = { label?: string | null; href?: string | null };
type FooterColumn = { heading?: string | null; links?: FooterLink[] | null };

export async function SiteFooter() {
  const footer = (await getFooter()) as { columns?: FooterColumn[] | null } | null;
  const columns: FooterColumn[] = Array.isArray(footer?.columns) ? footer!.columns! : [];

  return (
    <footer className="bg-ow-navy text-white/60">
      <div className="ow-container py-16">
        <div
          className={`grid grid-cols-1 gap-10 pb-12 border-b border-white/10 ${
            columns.length === 4
              ? "md:grid-cols-5"
              : columns.length === 3
                ? "md:grid-cols-4"
                : columns.length === 2
                  ? "md:grid-cols-3"
                  : columns.length === 1
                    ? "md:grid-cols-2"
                    : "md:grid-cols-1"
          }`}
        >
          <div>
            <Image
              src="/images/ow_logo.png"
              alt="OpticWise"
              width={120}
              height={32}
              className="h-8 w-auto mb-4"
            />
            <p className="text-sm text-white/50 leading-relaxed">
              Owner-controlled data &amp; digital infrastructure for commercial real estate.
            </p>
          </div>

          {columns.map((col, i) => (
            <div key={`${col?.heading || "col"}-${i}`}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/35 mb-4">
                {(col?.heading || "").trim()}
              </h4>
              <ul className="space-y-2.5">
                {(col?.links || []).map((link, j) => {
                  const href = (link?.href || "").trim();
                  const label = (link?.label || "").trim();
                  if (!href || !label) return null;
                  return (
                    <li key={`${href}-${j}`}>
                      <Link
                        href={href}
                        className="text-sm hover:text-white transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} OpticWise. All rights reserved.
          </p>
          <p className="text-xs text-white/25 max-w-sm text-center md:text-right">
            {SITE.closingLine}
          </p>
        </div>
      </div>
    </footer>
  );
}
