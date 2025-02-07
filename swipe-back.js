const IMAGE_LEFT_ARROW = [
  "data:image/svg+xml;base64,",
  "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/",
  "Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAu",
  "MCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAg",
  "QnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXll",
  "cl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHht",
  "bG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4",
  "PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDQ3My42NTQgNDcz",
  "LjY1NCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDcz",
  "LjY1NCA0NzMuNjU0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Y2ly",
  "Y2xlIHN0eWxlPSJmaWxsOiM0QUJDOTY7IiBjeD0iMjM2LjgyNyIgY3k9",
  "IjIzNi44MjciIHI9IjIzNi44MjciLz4NCjxwYXRoIHN0eWxlPSJmaWxs",
  "OiNGRkZGRkY7IiBkPSJNMzM4LjQ2NSwyMDcuOTY5Yy00My40ODcsMC04",
  "Ni45NzUsMC0xMzAuNDU5LDBjMTEuMDgtMTEuMDgsMjIuMTYxLTIyLjE2",
  "MSwzMy4yNDEtMzMuMjQ1DQoJYzI1LjU2LTI1LjU2LTE0LjI1OS02NS4w",
  "ODQtMzkuODgzLTM5LjQ1NmMtMjcuMDExLDI3LjAxMS01NC4wMTgsNTQu",
  "MDIyLTgxLjAyOSw4MS4wMzNjLTEwLjg0MSwxMC44NDEtMTAuNTQ5LDI4",
  "LjkwNywwLjIxMywzOS42NjkNCgljMjcuMDExLDI3LjAwNyw1NC4wMTgs",
  "NTQuMDE4LDgxLjAyOSw4MS4wMjVjMjUuNTYsMjUuNTYsNjUuMDg0LTE0",
  "LjI1OSwzOS40NTYtMzkuODgzYy0xMS4wMTMtMTEuMDEzLTIyLjAyNi0y",
  "Mi4wMjYtMzMuMDM5LTMzLjAzNQ0KCWM0My4zNTcsMCw4Ni43MTMsMCwx",
  "MzAuMDY2LDBDMzc0LjI4MywyNjQuMDc3LDM3NC42MDQsMjA3Ljk2OSwz",
  "MzguNDY1LDIwNy45Njl6Ii8+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0K",
  "PGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+",
  "DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwv",
  "Zz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0K",
  "PC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg==",
].join("");

const container = document.createElement("div");
container.className = "browser-extension-swipe-back-container";

const leftArrow = document.createElement("img");
leftArrow.className = "browser-extension-swipe-back-arrow browser-extension-swipe-back-arrow-left";
leftArrow.src = IMAGE_LEFT_ARROW;

const rightArrow = document.createElement("img");
rightArrow.className = "browser-extension-swipe-back-arrow browser-extension-swipe-back-arrow-right";
rightArrow.src = IMAGE_LEFT_ARROW;

container.appendChild(leftArrow);
container.appendChild(rightArrow);

let postitionScale = 6;
let position = 0;
let freezeUntil = 0;
let fadeDelay = 500;
let resetTimeoutID = 0;
let transitionTimeoutID = 0;

const imageInitialLeft = -110;

function debounce(fn, duration) {
  let expiresAt = 0;
  return function debouncedFn() {
    console.log("debouncedFn");
    if (Date.now() < expiresAt) {
    console.log("Date.now() < expiresAt");
    return;
    }
    expiresAt = Date.now() + duration;
    fn();
  };
}

const historyBack = debounce(function back() {
  window.history.back();
  console.log("back");
  console.log(window.history.length);
  console.log("-----------------");
}, 200);

const historyForward = debounce(function historyForward() {
    // window.history.forward();
  console.log("forward");
  console.log(window.history.length);
  console.log("-----------------");
}, 200);

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
      Math.min(position, 120 * postitionScale) / postitionScale
    }px`;
  } else {
    arrow.style.right = `${
      imageInitialLeft +
      Math.min(-position, 120 * postitionScale) / postitionScale
    }px`;
  }

  arrow.classList.remove("transition");
  window.clearTimeout(transitionTimeoutID);
  transitionTimeoutID = window.setTimeout(() => {
    arrow.classList.add("transition");
  }, 200);
}

function handleWheel(event) {
  if (event.deltaY !== 0) {
    freezeUntil = Date.now() + 50;
    console.log("freezeUntil = Date.now() + 50;");
    return;
  }
  if (Date.now() < freezeUntil) {
    console.log(Date.now(), freezeUntil);
    return;
  }
  position -= event.deltaX;
  if (position > 150 * postitionScale) {
    console.log("position > 150 * postitionScale");
    position = 150 * postitionScale;
  }
  if (position < -150 * postitionScale) {
    console.log("position < -150 * postitionScale");
    postitionScale = -150 * postitionScale;
  }

  if (position > 0) {
    console.log("ani  mateArrow");
    animateArrow(leftArrow);
  } else {
    console.log("animateArrow");
    animateArrow(rightArrow);
  }

  window.clearTimeout(resetTimeoutID);
  resetTimeoutID = window.setTimeout(resetPosition, fadeDelay);

  if (position >= 130 * postitionScale || position <= -130 * postitionScale) {
    console.log("position");
    freezeUntil = Date.now() + 500;
    if (position > 0) {
    console.log("back");
    historyBack();
    } else {
    console.log("forward");
    // historyForward();
    }
    position = 0;
  }
}

let lastScrollX = 0;
function handleScroll(event) {
  const scrollX = event.target.scrollX ?? event.target.scrollLeft;
  // only handles horizontal scroll
  if (scrollX !== lastScrollX) {
    console.log("scrollx !==");
    position = 0;
    freezeUntil = Date.now() + 1000;
  }
  lastScrollX = scrollX;
}

function main() {
  // @ts-ignore
  if (/Mac/.test(window.navigator.platform)) {
    console.log("mac");
    return;
  }
  document.body.appendChild(container);
  document.addEventListener("wheel", handleWheel);
  document.addEventListener("scroll", handleScroll, { capture: true });
}

main();
