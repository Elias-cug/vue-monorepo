import { createMemoryHistory, createRouter } from "vue-router";

const routes: any = [];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
