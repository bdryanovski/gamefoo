// docs/astro.config.mjs
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  integrations: [
    starlight({
      title: "My Library",
      sidebar: [
        {
          label: "📖 Guides",
          autogenerate: { directory: "guides" }, // ← reads docs/src/content/docs/guides/
          collapsed: false,
        },
        {
          label: "⚙️ API Reference",
          collapsed: false,
          items: [
            {
              label: "Classes",
              autogenerate: { directory: "api/classes" },
              collapsed: false,
            },
            {
              label: "Interfaces",
              autogenerate: { directory: "api/interfaces" },
              collapsed: true,
            },
            {
              label: "Type Aliases",
              autogenerate: { directory: "api/type-aliases" },
              collapsed: true,
            },
            {
              label: "Functions",
              autogenerate: { directory: "api/functions" },
              collapsed: true,
            },
            {
              label: "Enumerations",
              autogenerate: { directory: "api/enumerations" },
              collapsed: true,
            },
          ],
        },
      ],
      pagefind: true,
      lastUpdated: true,
      customCss: ["./src/styles/custom.css"],
    }),
  ],
});
