import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const output = new URL("../dist/", import.meta.url);
const html = await readFile(new URL("index.html", output), "utf8");
const body = html.split("<body>")[1];
const schema = JSON.parse(
  html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1],
);
const graph = schema["@graph"];
const escapeHtml = (text) => text
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#x27;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

test("the built response contains business content without executing JavaScript", () => {
  assert.equal((body.match(/<h1>/g) || []).length, 1);
  for (const id of ["main", "services", "portfolio", "areas", "contact", "faq"]) {
    assert.ok(body.includes(`id="${id}"`), `Missing prerendered ${id}`);
  }
  const business = graph.find((node) => node["@type"] === "HomeAndConstructionBusiness");
  assert.ok(body.includes(business.name));
  assert.ok(body.includes(`href="tel:${business.telephone}"`));
  assert.ok(body.includes(business.address.streetAddress));
  assert.equal(graph.filter((node) => node["@type"] === "Service").length, 6);
  for (const service of graph.filter((node) => node["@type"] === "Service")) {
    assert.ok(body.includes(`id="${new URL(service.url).hash.slice(1)}"`));
    assert.ok(body.includes(escapeHtml(service.name)));
  }
});

test("each structured FAQ answer is also in the rendered page", () => {
  const faq = graph.find((node) => node["@type"] === "FAQPage");
  assert.ok(faq.mainEntity.length > 0);
  for (const question of faq.mainEntity) {
    const id = new URL(question["@id"]).hash.slice(1);
    const details = body.match(new RegExp(`<details[^>]*id="${id}"[^>]*>([\\s\\S]*?)<\\/details>`));
    assert.ok(details, `Missing visible FAQ: ${question.name}`);
    assert.ok(details[1].includes(escapeHtml(question.name)));
    assert.ok(details[1].includes(escapeHtml(question.acceptedAnswer.text)));
  }
});

test("metadata and crawl discovery use the same production canonical", async () => {
  assert.equal((html.match(/<title>/g) || []).length, 1);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)[1];
  assert.equal(new URL(canonical).protocol, "https:");
  assert.ok(html.includes(`property="og:url" content="${canonical}"`));
  assert.ok(!html.includes("noindex"));
  const robots = await readFile(new URL("robots.txt", output), "utf8");
  assert.match(robots, /User-agent: OAI-SearchBot\s+Allow: \//);
  assert.ok(robots.includes(`Sitemap: ${canonical}sitemap.xml`));
  const sitemap = await readFile(new URL("sitemap.xml", output), "utf8");
  assert.ok(sitemap.includes(`<loc>${canonical}</loc>`));
  assert.equal((sitemap.match(/<loc>/g) || []).length, 1);
});

test("referenced local resources exist in the deployable output", async () => {
  const paths = new Set(Array.from(
    html.matchAll(/(?:src|href)="(\/(?:assets|images|fonts)\/[^"?#]+)"/g),
    (match) => match[1],
  ));
  const shareImage = html.match(/property="og:image" content="([^"]+)"/)[1];
  paths.add(new URL(shareImage).pathname);
  for (const path of paths) await access(new URL(path.slice(1), output));
  assert.ok(paths.size > 5);
});
