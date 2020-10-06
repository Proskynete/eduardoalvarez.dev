import React, { FC, memo, SyntheticEvent, useEffect } from "react";
import {
  handleListenerScroll,
  scrollToNextContent,
} from "helpers/scroll.helper";
import {
  SectionsInterface,
  TableOfSectionsPropsInterface,
} from "models/sections.model";

const handleGoTo = (event: SyntheticEvent<EventTarget>): void => {
  event.preventDefault();
  const targetElement: HTMLInputElement = event.target as HTMLInputElement;
  const title: string = targetElement.getAttribute("href");
  scrollToNextContent(title);
};

const TableOfSections: FC<TableOfSectionsPropsInterface> = (props) => {
  const { sections } = props;

  useEffect(() => {
    window.addEventListener(
      "scroll",
      () => handleListenerScroll(sections),
      true
    );

    return () => {
      window.removeEventListener(
        "scroll",
        () => handleListenerScroll(sections),
        true
      );
    };
  }, []);

  return (
    <nav id="section-navegation" className="section-navegation">
      <ul className="inner">
        {sections.map((section: SectionsInterface) => (
          <li key={section.title} className="item">
            <a
              href={`#${section.anchor}`}
              className="link"
              onClick={(e: SyntheticEvent<EventTarget>) => handleGoTo(e)}
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default memo(TableOfSections);
