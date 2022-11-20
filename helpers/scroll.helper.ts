import { SectionsInterface } from "models/sections.model";
import { easeInOutCubic } from "./animation.helper";

export const scrollToTop = (): void => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export const scrollToNextContent = (anchor: string): void => {
  smoothScroll(anchor, 1000);
};

const smoothScroll = (anchor: string, duration: number): void => {
  const target: HTMLElement = document.querySelector(`${anchor}`);
  const targetPosition: number =
    target.getBoundingClientRect().top + window.scrollY - 10;

  const startPosition: number = window.pageYOffset;
  const distance: number = targetPosition - startPosition;
  let startTime: null | number = null;

  const animation = (currentTime: number): void => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed: number = currentTime - startTime;
    const run: number = easeInOutCubic(
      timeElapsed,
      startPosition,
      distance,
      duration
    );

    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
};

export const toggleClassWhenScrolling = (
  itemsList: Array<SectionsInterface>
) => {
  const listOfPositionItems = [];

  itemsList.forEach((item) => {
    const element = document.querySelector(`#${item.anchor}`);
    listOfPositionItems.push(
      element.getBoundingClientRect().top + window.scrollY - 50
    );
  });

  listOfPositionItems.push(
    document.getElementsByTagName("body")[0].clientHeight
  );

  return listOfPositionItems;
};

export const handleListenerScroll = (
  sectionArray: Array<SectionsInterface>
) => {
  const listOfPositionItems = toggleClassWhenScrolling(sectionArray);
  const currentPosition = window.pageYOffset;

  sectionArray.forEach((ele, i) => {
    const link = document.querySelector(
      `#section-navegation a[href='#${ele.anchor}']`
    );

    if (
      currentPosition >= listOfPositionItems[i] &&
      currentPosition < listOfPositionItems[i + 1]
    ) {
      link.classList.add("current");
    } else {
      link.classList.remove("current");
    }
  });
};
