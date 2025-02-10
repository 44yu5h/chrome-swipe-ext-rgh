
const container = document.createElement("div");
container.className = "browser-extension-swipe-back-container";

const leftArrow = document.createElement("img");
leftArrow.className = "browser-extension-swipe-back-arrow browser-extension-swipe-back-arrow-left";
const rightArrow = document.createElement("img");
rightArrow.className = "browser-extension-swipe-back-arrow browser-extension-swipe-back-arrow-right";

chrome.storage.sync.get(["selectedIcon"], function (data) {
  const selectedIcon = data.selectedIcon ?? "4.svg";
  leftArrow.src = chrome.runtime.getURL(`arrowStyles/${selectedIcon}`);
  rightArrow.src = leftArrow.src;
});

document.body.appendChild(leftArrow);
document.body.appendChild(rightArrow);

let positionScale = 13;
let position = 0;
let freezeUntil = 0;
let fadeDelay = 750;
document.documentElement.style.setProperty('--fade-delay', `${fadeDelay}ms`);
let resetTimeoutID = 0;
let transitionTimeoutID = 0;
let scrollTimeoutID = 0;

let arrowSize = 60;
document.documentElement.style.setProperty('--size', `${arrowSize}px`);

let animationMaxDistance = 160;
let activationDistance = 140;

const imageInitialLeft = -110;

function debounce(fn, duration) {
  let expiresAt = 0;
  return function debouncedFn() {
    if (Date.now() < expiresAt) {
    return;
    }
    expiresAt = Date.now() + duration;
    fn();
  };
}

const historyBack = debounce(function back() {
  window.history.back();
}, 500);

const historyForward = debounce(function historyForward() {
    window.history.forward();
}, 500);

function resetPosition() {
  position = 0;
  leftArrow.style.left = imageInitialLeft + "px";
  rightArrow.style.right = imageInitialLeft + "px";
}

function animateArrow(arrowElement) {
  const arrow = arrowElement;

  if (arrow === leftArrow) {
    arrow.style.left = `${
      imageInitialLeft +
      Math.min(position, animationMaxDistance * positionScale) / positionScale
    }px`;
  } else {
    arrow.style.right = `${
      imageInitialLeft +
      Math.min(-position, animationMaxDistance * positionScale) / positionScale
    }px`;
  }

  //TODO show only 1 icon at a time
  arrow.classList.remove("transition");
  window.clearTimeout(transitionTimeoutID);
  transitionTimeoutID = window.setTimeout(() => {
    arrow.classList.add("transition");
  }, 200);
}

function handleWheel(event) {
  if (event.deltaY !== 0) {
    freezeUntil = Date.now() + 50;
    return;
  }
  if (Date.now() < freezeUntil) {
    return;
  }
  position -= event.deltaX;
  if (position > 150 * positionScale) {
    position = 150 * positionScale;
  }
  if (position < -150 * positionScale) {
    position = -150 * positionScale;
  }

  if (position > 0) {
    animateArrow(leftArrow);
  } else {
    animateArrow(rightArrow);
  }

  if (position >= activationDistance * positionScale || position <= -activationDistance * positionScale) {
    freezeUntil = Date.now() + 500;
    if (position > 0) {
    historyBack();
    } else {
    historyForward();
    }
    position = 0;
  }
  if (scrollTimeoutID) {  // bug-fix, the scroll position was never reset; better control now
    clearTimeout(scrollTimeoutID);
  }
  scrollTimeoutID = setTimeout(() => {
    resetPosition();
  }, fadeDelay);
}

let lastScrollX = 0;
function handleScroll(event) {
  const scrollX = event.target.scrollX ?? event.target.scrollLeft;
  // only handles horizontal scroll
  if (scrollX !== lastScrollX) {
    position = 0;
    freezeUntil = Date.now() + 1000;
  }
  lastScrollX = scrollX;
}

function main() {
  // @ts-ignore
  if (/Mac/.test(window.navigator.platform)) {
    return;
  }
  document.body.appendChild(container);
  document.addEventListener("wheel", handleWheel);
  document.addEventListener("scroll", handleScroll, { capture: true });
}

chrome.storage.sync.get(["enableFeature"], function (data) {
  if (!data.enableFeature) {
    return;
  }
main();});
