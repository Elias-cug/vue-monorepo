import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// tree-shaking-->naive-ui
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

import Unocss from "unocss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
    Unocss(),
  ],
});
