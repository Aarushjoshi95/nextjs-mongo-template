const SITE = 'https://aarushjoshi.in';

export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      // AI search / answer engines are explicitly welcome to read the public site.
      { userAgent: ['GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'ClaudeBot', 'anthropic-ai', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'CCBot'], allow: '/', disallow: ['/api/'] },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
