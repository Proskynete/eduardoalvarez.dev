import { FC } from "react";
import { PropsInterface } from "../models/layout.model";
import Meta from "./Meta";

const Layout: FC<PropsInterface> = (props) => {
  return (
    <section>
      <Meta customTitle={props.customTitle} description={props.description} />
      <div>{props.children}</div>
    </section>
  );
};

export default Layout;
