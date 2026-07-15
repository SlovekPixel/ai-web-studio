import importPlugin from "eslint-plugin-import";

/**
 * @param {'frontend' | 'backend'} appName
 * @returns {import("eslint").Linter.Config}
 */
export function createMonorepoBoundariesConfig(appName) {
  const forbiddenApp = appName === "frontend" ? "backend" : "frontend";

  return {
    plugins: {
      import: importPlugin,
    },
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src",
              from: `../${forbiddenApp}`,
              message: `${appName} cannot import from ${forbiddenApp}`,
            },
            {
              target: "./src",
              from: `../${forbiddenApp}/**`,
              message: `${appName} cannot import from ${forbiddenApp}`,
            },
          ],
        },
      ],
    },
  };
}
