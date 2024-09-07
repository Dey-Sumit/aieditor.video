import { enableTailwind } from "@remotion/tailwind";

import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

// Override the default Webpack configuration
export const webpackOverride = (currentConfig) => {
  const config = enableTailwind(currentConfig);
  return {
    ...config,
    resolve: {
      ...config.resolve,
      // Add the TsconfigPathsPlugin to resolve TypeScript paths
      plugins: [...(config.resolve?.plugins ?? []), new TsconfigPathsPlugin()],
    },
  };
};
