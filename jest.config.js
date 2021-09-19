module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFiles: ["jest-canvas-mock"], // https://github.com/felippenardi/lottie-react-web/issues/21
  collectCoverageFrom: ["src/**/*.{ts,js,tsx,jsx}", "!**/node_modules/**"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  globals: {
    "ts-jest": {
      compiler: "typescript"
    },
  },
};
