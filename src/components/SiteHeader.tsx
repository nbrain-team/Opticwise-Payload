import { getNavigation } from "@/lib/payload-helpers";
import { SITE } from "@/lib/site";
import { SiteHeaderView, type NavItemView } from "./SiteHeaderView";

export async function SiteHeader() {
  let items: NavItemView[] | null = null;
  try {
    const nav = await getNavigation();
    const raw = (nav as any)?.items;
    if (Array.isArray(raw) && raw.length > 0) {
      items = raw.map((i: any) => ({
        label: i.label,
        href: i.href || undefined,
        style: i.style || "link",
        children: Array.isArray(i.children)
          ? i.children
              .filter((c: any) => c?.label && c?.href)
              .map((c: any) => ({ label: c.label, href: c.href }))
          : [],
      }));
    }
  } catch {
    items = null;
  }

  if (!items) {
    items = SITE.nav.map((i) => ({ label: i.label, href: i.href, style: "link" }));
  }

  return <SiteHeaderView items={items} />;
}
