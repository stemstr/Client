const path = require("path");
const nextJest = require("next/jest");

const createJestConfig = nextJest();

const customJestConfig = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["./jest.setup.ts"],
  moduleDirectories: ["node_modules", path.join(__dirname, "./")],
};

module.exports = createJestConfig(customJestConfig);
