import { PropsInterface } from "models/layout.model";
import { FC } from "react";
import Meta from "./Meta";

const Layout: FC<PropsInterface> = (props) => {
  const { customTitle, description, image, slug, children } = props;

  return (
    <>
      <Meta
        customTitle={customTitle}
        description={description}
        image={image}
        slug={slug}
      />
      <main>{children}</main>
    </>
  );
};

export default Layout;
