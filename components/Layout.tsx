import { FC } from "react";
import { PropsInterface } from "models/layout.model";
import Meta from "./Meta";

const Layout: FC<PropsInterface> = (props) => {
  const { customTitle, description, image, url, children } = props;

  return (
    <section>
      <Meta
        customTitle={customTitle}
        description={description}
        image={image}
        url={url}
      />
      <div>{children}</div>
    </section>
  );
};

export default Layout;
