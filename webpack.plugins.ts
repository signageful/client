/* eslint-disable @typescript-eslint/no-var-requires */
import type IForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { InjectManifest } from "workbox-webpack-plugin";
import path from "path";

const CopyPlugin = require("copy-webpack-plugin");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: "webpack-infrastructure",
  }),
  new CopyPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, "src/renderer/assets/"),
        to: path.resolve(__dirname, ".webpack/renderer/"),
      },
    ],
  }),
  //   new InjectManifest({
  //     swSrc: "./src/service-worker.ts",
  //     swDest: "./sw.js",
  //     exclude: [
  //       /\.map$/,
  //       /manifest$/,
  //       /service-worker\.js$/,
  //       /asset-manifest\.json$/,
  //       /LICENSE/,
  //       /\.js\.LICENSE\.txt$/,
  //     ],
  //   }),
];
