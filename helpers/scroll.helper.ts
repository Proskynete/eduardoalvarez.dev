import { SectionsInterface } from "models/sections.model";
import { easeInOutCubic } from "./animation.helper";

export const scrollToTop = (): void => {
  const current: number =
    document.documentElement.scrollTop || document.body.scrollTop;

  if (current > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, current - current / 20);
  }
};

export const scrollToNextContent = (anchor: string): void => {
  smoothScroll(anchor, 1000);
};

const smoothScroll = (anchor: string, duration: number): void => {
  const target: HTMLElement = document.querySelector(`${anchor}`);
  const targetPosition: number =
    target.getBoundingClientRect().top + window.scrollY - 55;

  const startPosition: number = window.pageYOffset;
  const distance: number = targetPosition - startPosition;
  let startTime: null | number = null;

  const animation = (currentTime: any): void => {
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
  listOfItems: Array<SectionsInterface>
) => {
  const listOfPositionItems = [];

  listOfItems.forEach((item) => {
    const element = document.querySelector(`#${item.anchor}`);
    listOfPositionItems.push(
      element.getBoundingClientRect().top + window.scrollY - 56
    );
  });

  listOfPositionItems.push(
    document.getElementsByTagName("body")[0].clientHeight
  );

  return listOfPositionItems;
};

export const handleListenerScroll = (
  arrayOfSections: Array<SectionsInterface>
) => {
  const listOfPositionItems = toggleClassWhenScrolling(arrayOfSections);
  const currentPosition = window.pageYOffset;

  arrayOfSections.forEach((element, i) => {
    const link = document.querySelector(
      `#section-navegation a[href='#${element.anchor}']`
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
