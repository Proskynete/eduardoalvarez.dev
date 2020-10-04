import React, { FC } from "react";
import { scrollToTop } from "helpers/scroll.helper";
import Subscribe from "./Subscribe";
import SocialNetworks from "./SocialNetworks";

const Footer: FC = () => {
  return (
    <section className="row">
      <section className="col-xs-12">
        <Subscribe />
      </section>
      <SocialNetworks />
      <footer>
        <button onClick={() => scrollToTop()}>To top</button>
      </footer>
    </section>
  );
};

export default Footer;
