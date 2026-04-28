import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    // JWT-only auth: avoids "session invalid" failures when server-side
    // session rows and the signed sid in the token fall out of sync (e.g.
    // after DB stress or Neon restarts). Admin access is unchanged.
    useSessions: false,
  },
  admin: {
    useAsTitle: "email",
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
    {
      name: "role",
      type: "select",
      defaultValue: "editor",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
    },
  ],
};
