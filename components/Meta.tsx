import Head from "next/head";
import { PropsInterface } from "../models/meta.model";

const Meta = (props: PropsInterface) => {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <meta name="Description" content={props.description}></meta>
      <title>{props.customTitle}</title>
    </Head>
  );
};

export default Meta;
