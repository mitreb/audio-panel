interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  url?: string;
  noIndex?: boolean;
}

export function Seo({
  title = 'Audio Panel - Music Product Management System',
  description = 'A full-stack product management system for music-centric environments. Manage audio products including albums, singles, and music releases with cover art.',
  keywords = 'audio panel, music management, product management, album management, music catalog, audio products',
  ogImage = 'https://audiopanel.online/og-image.png',
  url = 'https://audiopanel.online/',
  noIndex = true,
}: SeoProps) {
  const robotsContent = noIndex ? 'noindex, nofollow' : 'index, follow';

  return (
    <>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robotsContent} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      <link rel="canonical" href={url} />
    </>
  );
}
