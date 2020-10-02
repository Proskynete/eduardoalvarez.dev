import { FC } from "react";
import Head from "next/head";
import { PropsInterface } from "models/meta.model";

const Meta: FC<PropsInterface> = (props) => {
  const { customTitle, description, image, url } = props;

  return (
    <Head>
      <meta name="image" content={image} />
      <link rel="canonical" href={url} />

      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={customTitle} />
      <meta property="og:title" content={customTitle} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      <meta name="twitter:description" content={description} />
      <meta name="twitter:title" content={customTitle} />
      <meta property="twitter:image" content={image} />
      <meta name="twitter:url" content={url} />

      <link rel="icon" href="/favicon/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <meta name="description" content={description}></meta>
      <title>{customTitle}</title>
    </Head>
  );
};

export default Meta;
