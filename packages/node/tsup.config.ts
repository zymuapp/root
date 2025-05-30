import { esbuildDecorators } from "@anatine/esbuild-decorators";
import { type Options, defineConfig } from "tsup";

const config: Options = {
  format: ["cjs", "esm"],
  entry: ["src/index.ts"],
  splitting: true,
  sourcemap: true,
  clean: false,
  platform: "node",
  minify: true,
  treeshake: true,
  dts: true,
  esbuildPlugins: [esbuildDecorators()],
  publicDir: "src/protos",
};

export default defineConfig(config);
