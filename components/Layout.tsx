import { AlertContextProvider } from "context/alertContext";
import { PropsInterface } from "models/layout.model";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FC, useEffect, useRef, useState } from "react";

import Alert from "./Alert";

const Footer = dynamic(() => import("components/Footer"));
const Meta = dynamic(() => import("components/Meta"));
const Nav = dynamic(() => import("components/Nav"));
const ProgressBarScrolling = dynamic(
  () => import("components/ProgressBarScrolling")
);

const Layout: FC<PropsInterface> = (props) => {
  const {
    customTitle,
    description,
    image,
    slug,
    children,
    footer = true,
    algolia,
  } = props;
  const [path, setPath] = useState("");
  const target = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setPath(router.pathname);
  }, [router.pathname]);

  return (
    <AlertContextProvider>
      <Meta
        customTitle={customTitle}
        description={description}
        image={image}
        slug={slug}
      />
      <ProgressBarScrolling target={target} />
      <Nav path={path} algolia={algolia} />
      <main className="container-fluid" ref={target}>
        <Alert />
        {children}
        {footer ? <Footer /> : null}
      </main>
    </AlertContextProvider>
  );
};

export default Layout;
