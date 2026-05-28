import "@testing-library/jest-dom";
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: () => {},
});

Object.defineProperty(window, "requestAnimationFrame", {
  writable: true,
  value: (callback) => setTimeout(callback, 0),
});

Object.defineProperty(window, "cancelAnimationFrame", {
  writable: true,
  value: (id) => clearTimeout(id),
});
