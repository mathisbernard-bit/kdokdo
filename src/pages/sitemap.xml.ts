import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('blog');

  const staticPages = [
    '',
    '/blog',
    '/a-propos',
  ];

  const blogUrls = posts.map(post => ({
    url: `/blog/${post.slug}/`,
    date: post.data.date,
  }));

  const urls = [
    ...staticPages.map(p => ({ url: p, date: new Date().toISOString().split('T')[0] })),
    ...blogUrls,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ url, date }) => `  <url>
    <loc>https://kdokdo.com${url}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === '' ? '1.0' : url.startsWith('/blog/') && url.length > 6 ? '0.8' : '0.6'}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
