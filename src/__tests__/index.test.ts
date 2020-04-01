import * as index from "../index";

describe("index", () => {
  it("doesn't over-export", () => {
    const allowedExports = [
      "Lottie",
      "useLottie",
      "Renderer",
      "ClickAway"
    ];
    expect(Object.keys(index).sort()).toEqual(allowedExports.sort());
  });
});