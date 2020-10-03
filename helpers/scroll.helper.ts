import { easeInOutCubic } from "./animation.helper";

export const scrollToTop = (): void => {
  const current: number =
    document.documentElement.scrollTop || document.body.scrollTop;

  if (current > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, current - current / 20);
  }
};

export const scrollToNextContent = (title: string): void => {
  smoothScroll(title, 1000);
};

const smoothScroll = (elementName: string, duration: number): void => {
  const target: HTMLElement = document.querySelector(elementName);
  const targetPosition: number =
    target.getBoundingClientRect().top + window.scrollY - 30;

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
  listOfItems: Array<any>
): Array<any> => {
  const listOfPositionItems = [];

  listOfItems.forEach((item) => {
    const element = document.querySelector(`#${item.link}`);
    listOfPositionItems.push(
      element.getBoundingClientRect().top + window.scrollY - 35
    );
  });

  listOfPositionItems.push(
    document.getElementsByTagName("body")[0].clientHeight
  );

  return listOfPositionItems;
};

export const handleListenerScroll = (arrayOfSections: Array<any>): void => {
  const listOfItems = arrayOfSections;

  const listOfPositionItems = toggleClassWhenScrolling(listOfItems);
  const currentPosition = window.pageYOffset;

  listOfItems.forEach((element, i) => {
    const link = document.querySelector(`a[href='#${element.link}']`);

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
