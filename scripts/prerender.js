import { readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');
const site = 'https://altaiyeb.info';

const data = JSON.parse(
  await readFile(path.join(root, 'src/Data.json'), 'utf8')
);

const { render } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
);

const appHtml = render();
let html = await readFile(path.join(dist, 'index.html'), 'utf8');

if (!html.includes('<!--app-html-->')) {
  throw new Error('dist/index.html is missing <!--app-html--> placeholder');
}

html = html.replace('<!--app-html-->', () => appHtml);

const jsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${site}/#person`,
      name: data.brand,
      url: `${site}/`,
      email: `mailto:${data.contact.email}`,
      jobTitle: 'Frontend platform engineer',
      description: data.hero.lede,
      homeLocation: {
        '@type': 'Place',
        name: data.contact.meta.find((row) => row.key === 'based')?.value
      },
      worksFor: {
        '@type': 'Organization',
        name: 'GoDaddy'
      },
      sameAs: data.contact.meta
        .filter((row) => row.href && row.key !== 'site')
        .map((row) => row.href),
      alumniOf: data.about.education.map((ed) => ({
        '@type': 'EducationalOrganization',
        name: ed.school.split(' · ')[0],
        description: ed.degree
      })),
      knowsAbout: data.about.toolkit,
      subjectOf: {
        '@type': 'DigitalDocument',
        name: 'Résumé',
        encodingFormat: 'application/pdf',
        url: `${site}/${data.contact.resume}`
      }
    },
    {
      '@type': 'WebPage',
      '@id': `${site}/#webpage`,
      url: `${site}/`,
      name: `${data.brand} — Frontend Platform & Developer Experience`,
      description: data.hero.lede,
      about: { '@id': `${site}/#person` },
      mainEntity: { '@id': `${site}/#person` }
    }
  ]
});

const jsonLdTag = `<script type="application/ld+json">${jsonLd}</script>`;
if (!html.includes('</head>')) {
  throw new Error('dist/index.html is missing </head>');
}
html = html.replace('</head>', `${jsonLdTag}\n</head>`);

await writeFile(path.join(dist, 'index.html'), html);

const lastmod = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
await writeFile(path.join(dist, 'sitemap.xml'), sitemap);

const linkedin = data.contact.meta.find((row) => row.key === 'linkedin');
const github = data.contact.meta.find((row) => row.key === 'github');
const based = data.contact.meta.find((row) => row.key === 'based')?.value;
const projects = data.projects
  .map((p) => `- ${p.title} (${p.kicker}): ${p.body}`)
  .join('\n');

const llms = `# ${data.brand}

> ${data.hero.lede}

${data.brand} is a frontend platform engineer at GoDaddy, based in ${based}, open to remote work.

## Site

- [Home](${site}/): personal site — frontend platform and developer experience
- [Résumé (PDF)](${site}/${data.contact.resume}): one-page résumé
- [Sitemap](${site}/sitemap.xml): crawl map

## Focus

${data.about.sub}

${data.about.more.join('\n\n')}

## Case study

${data.machine.heading} ${data.machine.sub}

${data.machine.outcomes.map((o) => `- ${o.title}: ${o.body}`).join('\n')}

## Other work

${projects}

## Toolkit

${data.about.toolkit.join(', ')}

## Contact

- [${data.contact.email}](mailto:${data.contact.email})
- [LinkedIn](${linkedin?.href})
- [GitHub](${github?.href})
`;
await writeFile(path.join(dist, 'llms.txt'), llms);

await rm(ssrDir, { recursive: true, force: true });
