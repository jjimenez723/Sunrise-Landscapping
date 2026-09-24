import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { robotsTxt, sitemapXml } from "../src/data/seo.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = new URL("../dist/", import.meta.url);
const server = await createServer({
  root,
  mode: "production",
  appType: "custom",
  server: { middlewareMode: true, hmr: false, watch: null },
});

try {
  const { render } = await server.ssrLoadModule("/src/entry-server.jsx");
  const template = await readFile(new URL("index.html", output), "utf8");
  const placeholder = '<div id="root"></div>';
  if (!template.includes(placeholder)) {
    throw new Error("Prerender failed: the HTML template has no empty root element.");
  }
  const markup = render();
  if (!markup.includes('<main id="main">')) {
    throw new Error("Prerender failed: the page has no main content.");
  }
  await writeFile(
    new URL("index.html", output),
    template.replace(placeholder, () => `<div id="root">${markup}</div>`),
  );
  await writeFile(new URL("robots.txt", output), robotsTxt);
  await writeFile(new URL("sitemap.xml", output), sitemapXml);
  console.log("Prerendered the homepage and generated robots.txt and sitemap.xml.");
} finally {
  await server.close();
}
