import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";
import { revalidatePath, revalidateTag } from "next/cache";

const homeAndIndex = (kind: "page" | "post") => {
  revalidatePath("/", "page");
  if (kind === "post") revalidatePath("/insights", "page");
  revalidateTag(`${kind}s-list`);
};

export const revalidatePage: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  if (doc?._status === "published" && doc?.slug) {
    const path = `/${doc.slug}`;
    payload.logger.info(`Revalidating page: ${path}`);
    revalidatePath(path, "page");
    homeAndIndex("page");
  }

  if (
    previousDoc?._status === "published" &&
    previousDoc?.slug &&
    previousDoc.slug !== doc?.slug
  ) {
    const oldPath = `/${previousDoc.slug}`;
    payload.logger.info(`Revalidating old page path: ${oldPath}`);
    revalidatePath(oldPath, "page");
  }

  return doc;
};

export const revalidatePageDelete: CollectionAfterDeleteHook = ({
  doc,
  req: { payload },
}) => {
  if (doc?.slug) {
    const path = `/${doc.slug}`;
    payload.logger.info(`Revalidating page after delete: ${path}`);
    revalidatePath(path, "page");
    homeAndIndex("page");
  }
  return doc;
};

export const revalidatePost: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  if (doc?._status === "published" && doc?.slug) {
    const path = `/insights/${doc.slug}`;
    payload.logger.info(`Revalidating post: ${path}`);
    revalidatePath(path, "page");
    homeAndIndex("post");
  }

  if (
    previousDoc?._status === "published" &&
    previousDoc?.slug &&
    previousDoc.slug !== doc?.slug
  ) {
    const oldPath = `/insights/${previousDoc.slug}`;
    payload.logger.info(`Revalidating old post path: ${oldPath}`);
    revalidatePath(oldPath, "page");
  }

  return doc;
};

export const revalidatePostDelete: CollectionAfterDeleteHook = ({
  doc,
  req: { payload },
}) => {
  if (doc?.slug) {
    const path = `/insights/${doc.slug}`;
    payload.logger.info(`Revalidating post after delete: ${path}`);
    revalidatePath(path, "page");
    homeAndIndex("post");
  }
  return doc;
};
