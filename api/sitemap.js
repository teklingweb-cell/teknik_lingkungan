const SITE = 'https://tekniklingkungan.com';
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://goqmeheazigreyvfwfih.supabase.co';
const SUPABASE_ANON = process.env.SUPABASE_ANON_KEY || 'sb_publishable_dvWMgg6ZMw1qWMd6fZlfxQ_g8Q0Nt34';

function escapeXml(value) {
  return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function contentUrl(path, item) {
  const query = item.slug ? `?slug=${encodeURIComponent(item.slug)}` : `?id=${encodeURIComponent(item.id)}`;
  return `${SITE}/${path}${query}`;
}

module.exports = async function handler(req, res) {
  try {
    const headers = { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` };
    const [newsResponse, researchResponse] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/news?select=id,slug,date,created_at&order=date.desc`, { headers }),
      fetch(`${SUPABASE_URL}/rest/v1/penelitian?select=id,slug,year,created_at&order=year.desc`, { headers })
    ]);
    if (!newsResponse.ok || !researchResponse.ok) throw new Error('Supabase sitemap query failed');
    const news = await newsResponse.json();
    const research = await researchResponse.json();
    const staticUrls = ['/', '/profile', '/sejarah', '/visi-misi', '/struktur', '/advisory-board', '/fasilitas', '/penelitian', '/pencapaian', '/staf', '/mitra', '/berita', '/kontak'];
    const urls = staticUrls.map(path => ({ loc: `${SITE}${path}`, changefreq: path === '/' || path === '/berita' || path === '/penelitian' ? 'weekly' : 'monthly', priority: path === '/' ? '1.0' : '0.7' }));
    news.forEach(item => urls.push({ loc: contentUrl('berita-detail', item), changefreq: 'monthly', priority: '0.6', lastmod: item.date || item.created_at }));
    research.forEach(item => urls.push({ loc: contentUrl('penelitian-detail', item), changefreq: 'monthly', priority: '0.6', lastmod: item.created_at || (item.year ? `${item.year}-01-01` : undefined) }));
    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${escapeXml(url.loc)}</loc>${url.lastmod ? `<lastmod>${escapeXml(String(url.lastmod).slice(0, 10))}</lastmod>` : ''}<changefreq>${url.changefreq}</changefreq><priority>${url.priority}</priority></url>`).join('\n')}\n</urlset>`;
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=3600');
    return res.status(200).send(body);
  } catch (error) {
    return res.status(503).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  }
};
