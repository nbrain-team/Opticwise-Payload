import React from "react";
import { getPayload } from "payload";
import config from "@payload-config";

function fmtDate(d?: string | Date | null) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export const BeforeDashboard = async () => {
  let pagesTotal = 0;
  let pagesDraft = 0;
  let postsTotal = 0;
  let postsDraft = 0;
  let mediaTotal = 0;
  let scheduled: Array<{
    id: string | number;
    title: string;
    publishAt: string;
    type: "page" | "post";
  }> = [];
  let recentPages: Array<{
    id: string | number;
    title: string;
    updatedAt: string;
    status: string;
  }> = [];
  let recentPosts: Array<{
    id: string | number;
    title: string;
    updatedAt: string;
    status: string;
  }> = [];

  try {
    const payload = await getPayload({ config });

    const [pages, pagesD, posts, postsD, media, recentPagesQ, recentPostsQ] =
      await Promise.all([
        payload.count({ collection: "pages" }),
        payload.count({
          collection: "pages",
          where: { _status: { equals: "draft" } },
        }),
        payload.count({ collection: "posts" }),
        payload.count({
          collection: "posts",
          where: { _status: { equals: "draft" } },
        }),
        payload.count({ collection: "media" }),
        payload.find({
          collection: "pages",
          limit: 5,
          sort: "-updatedAt",
          depth: 0,
        }),
        payload.find({
          collection: "posts",
          limit: 5,
          sort: "-updatedAt",
          depth: 0,
        }),
      ]);

    pagesTotal = pages.totalDocs;
    pagesDraft = pagesD.totalDocs;
    postsTotal = posts.totalDocs;
    postsDraft = postsD.totalDocs;
    mediaTotal = media.totalDocs;
    recentPages = recentPagesQ.docs.map((d: any) => ({
      id: d.id,
      title: d.title,
      updatedAt: d.updatedAt,
      status: d._status,
    }));
    recentPosts = recentPostsQ.docs.map((d: any) => ({
      id: d.id,
      title: d.title,
      updatedAt: d.updatedAt,
      status: d._status,
    }));

    // Find scheduled publishes via payload-jobs queue (best-effort)
    try {
      const jobs = await payload.find({
        collection: "payload-jobs" as any,
        limit: 10,
        depth: 0,
        sort: "waitUntil",
        where: {
          and: [{ completedAt: { exists: false } }, { hasError: { not_equals: true } }],
        } as any,
      });
      scheduled = jobs.docs
        .map((j: any) => {
          const t = j?.input?.type as "page" | "post" | undefined;
          const id = j?.input?.id;
          const title = j?.input?.title || `Document ${id}`;
          const publishAt = j?.waitUntil;
          if (!t || !id || !publishAt) return null;
          return { id, title, publishAt, type: t };
        })
        .filter(Boolean) as typeof scheduled;
    } catch {
      scheduled = [];
    }
  } catch (err) {
    return (
      <div className="opticwise-dashboard__hero">
        <h2>OpticWise Content Studio</h2>
        <p>Dashboard data unavailable right now.</p>
      </div>
    );
  }

  return (
    <>
      <div className="opticwise-dashboard__hero">
        <h2>OpticWise Content Studio</h2>
        <p>
          {pagesTotal} pages · {postsTotal} posts · {mediaTotal} media items.{" "}
          Live preview, drafts, and scheduled publish are enabled.
        </p>
      </div>

      <div className="opticwise-dashboard">
        <div className="opticwise-dashboard__card">
          <h3>Pages</h3>
          <div className="stat">{pagesTotal}</div>
          <div className="sub">
            {pagesDraft} draft{pagesDraft === 1 ? "" : "s"} pending
          </div>
        </div>
        <div className="opticwise-dashboard__card opticwise-dashboard__card--blue">
          <h3>Posts</h3>
          <div className="stat">{postsTotal}</div>
          <div className="sub">
            {postsDraft} draft{postsDraft === 1 ? "" : "s"} pending
          </div>
        </div>
        <div className="opticwise-dashboard__card opticwise-dashboard__card--accent">
          <h3>Scheduled to Publish</h3>
          <div className="stat">{scheduled.length}</div>
          <div className="sub">
            {scheduled.length === 0
              ? "Nothing in the publish queue"
              : "Items waiting on schedule"}
          </div>
          {scheduled.length > 0 && (
            <ul>
              {scheduled.slice(0, 4).map((s) => (
                <li key={`${s.type}-${s.id}`}>
                  <a
                    href={`/admin/collections/${s.type === "post" ? "posts" : "pages"}/${s.id}`}
                  >
                    {s.title}
                  </a>
                  <time>{fmtDate(s.publishAt)}</time>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="opticwise-dashboard">
        <div className="opticwise-dashboard__card">
          <h3>Recently Edited Pages</h3>
          <ul>
            {recentPages.map((d) => (
              <li key={d.id}>
                <a href={`/admin/collections/pages/${d.id}`}>
                  {d.title}
                  {d.status === "draft" ? " (draft)" : ""}
                </a>
                <time>{fmtDate(d.updatedAt)}</time>
              </li>
            ))}
            {recentPages.length === 0 && (
              <li>
                <span>No pages yet.</span>
              </li>
            )}
          </ul>
        </div>
        <div className="opticwise-dashboard__card opticwise-dashboard__card--blue">
          <h3>Recently Edited Posts</h3>
          <ul>
            {recentPosts.map((d) => (
              <li key={d.id}>
                <a href={`/admin/collections/posts/${d.id}`}>
                  {d.title}
                  {d.status === "draft" ? " (draft)" : ""}
                </a>
                <time>{fmtDate(d.updatedAt)}</time>
              </li>
            ))}
            {recentPosts.length === 0 && (
              <li>
                <span>No posts yet.</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default BeforeDashboard;
