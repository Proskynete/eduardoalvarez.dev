import React, { FC, memo, SyntheticEvent } from "react";
import { scrollToNextContent } from "helpers/scroll.helper";
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
  return (
    <nav className="col-xs-12">
      <ul>
        {sections.map((section: SectionsInterface) => (
          <li key={section.anchor}>
            <a
              href={section.anchor}
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
