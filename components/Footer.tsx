import { scrollToTop } from "helpers/scroll.helper";
import React, { FC } from "react";

const Footer: FC = () => {
  return <button onClick={() => scrollToTop()}>To top</button>;
};

export default Footer;
