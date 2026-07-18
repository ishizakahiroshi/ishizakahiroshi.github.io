#!/usr/bin/env node
// sitemap.xml / robots.txt を articles/**/index.html の一覧から静的生成する。
// 実行: node scripts/gen-sitemap.mjs
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const BASE = "https://ishizakahiroshi.com";

function listArticleDirs() {
  const yearsDir = join(ROOT, "articles");
  const urls = [];
  for (const year of readdirSync(yearsDir)) {
    const yearPath = join(yearsDir, year);
    if (!statSync(yearPath).isDirectory()) continue;
    for (const slug of readdirSync(yearPath)) {
      const slugPath = join(yearPath, slug);
      if (!statSync(slugPath).isDirectory()) continue;
      urls.push(`${BASE}/articles/${year}/${slug}/`);
    }
  }
  return urls.sort();
}

const urls = [`${BASE}/`, `${BASE}/works.html`, ...listArticleDirs()];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${BASE}/sitemap.xml
`;

writeFileSync(join(ROOT, "sitemap.xml"), sitemap);
writeFileSync(join(ROOT, "robots.txt"), robots);

console.log(`sitemap.xml: ${urls.length} urls`);
