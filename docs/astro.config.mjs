// docs/astro.config.mjs
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  integrations: [
    starlight({
      title: "Gamefoo",
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
              collapsed: false,
            },
            {
              label: "Type Aliases",
              autogenerate: { directory: "api/type-aliases" },
              collapsed: false,
            },
            {
              label: "Functions",
              autogenerate: { directory: "api/functions" },
              collapsed: false,
            },
            {
              label: "Enumerations",
              autogenerate: { directory: "api/enumerations" },
              collapsed: false,
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
