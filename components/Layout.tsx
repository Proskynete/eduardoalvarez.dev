import { PropsInterface } from "models/layout.model";
import { FC } from "react";
import Meta from "./Meta";

const Layout: FC<PropsInterface> = (props) => {
  const { customTitle, description, image, url, children } = props;

  return (
    <>
      <Meta
        customTitle={customTitle}
        description={description}
        image={image}
        url={url}
      />
      <main>{children}</main>
    </>
  );
};

export default Layout;
