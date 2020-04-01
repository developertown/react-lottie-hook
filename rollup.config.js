import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import clear from "rollup-plugin-clear";
import sourceMaps from "rollup-plugin-sourcemaps";
import camelCase from "lodash.camelcase";
import json from "@rollup/plugin-json";
import ts from "@wessberg/rollup-plugin-ts";

import pkg from "./package.json";

module.exports = {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      name: camelCase(pkg.name),
      format: "umd",
      sourcemap: true,
      globals: {
        react: "React",
        tslib: "tslib",
      },
    },
    { file: pkg.module, format: "es", sourcemap: true },
  ],
  external: [...Object.keys(pkg.devDependencies), ...Object.keys(pkg.peerDependencies)],
  watch: {
    include: "src/**",
  },
  plugins: [
    clear({
      targets: ["dist"],
      watch: false,
    }),
    json(), // Compile TypeScript files
    ts(),
    commonjs(),
    resolve(),
    sourceMaps(),
  ],
};
