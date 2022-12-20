import data from "data/config.json";
import { PropsInterface } from "models/meta.model";
import Head from "next/head";
import { memo } from "react";

const Meta = (props: PropsInterface) => {
  const { customTitle, description, image, slug = "", publishDate } = props;

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />

      <title>
        {customTitle} | {data.domain}
      </title>

      <link rel="icon" href="/favicon/favicon.ico" />
      <meta name="description" content={description} />

      <link rel="manifest" href="/manifest.json" />
      <meta name="robots" content="index, follow" />

      <meta name="keywords" content={data.keywords} />
      <meta name="author" content={data.author.name} />
      <meta name="copyright" content={data.author.name} />
      <meta name="application-name" content={`Blog de ${data.author.name}`} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={data.title} />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#0A3F66" />
      <link
        rel="apple-touch-icon"
        sizes="192x192"
        href="/images/manifest/192x192.png"
      />

      <meta name="image" content={`${data.url}${image}`} />
      <link rel="canonical" href={`${data.url}/${slug}`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={`${data.url}/${slug}`} />
      <meta name="twitter:title" content={customTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:creator" content="@proskynete" />

      <meta property="og:type" content="blog" />
      <meta property="og:title" content={customTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${data.url}/${slug}`} />
      <meta property="og:image" content={`${data.url}/${image}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="600" />
      <meta property="og:image:alt" content={customTitle} />
      <meta property="og:site_name" content={customTitle} />
      {publishDate && (
        <meta property="article:published_time" content={publishDate} />
      )}
    </Head>
  );
};

export default memo(Meta);
