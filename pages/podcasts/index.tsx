import dynamic from "next/dynamic";
import { memo } from "react";
const Layout = dynamic(() => import("components/Layout"));

const Podcast = () => {
  return (
    <div>
      <iframe src="https://open.spotify.com/embed/episode/3EVmm0kBvhqvFophatBITU?utm_source=generator&theme=0"></iframe>
    </div>
  );
};

export default memo(Podcast);

export const getStaticProps = async (): Promise<unknown> => {
  return {
    props: {},
  };
};
