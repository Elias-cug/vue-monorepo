import { createApp } from 'vue';
import naive from 'naive-ui';
import { createPinia } from 'pinia';
import UI from '@lee/ui';
import '@lee/base/src/styles/index.scss';
import router from '@lee/base/src/router/index';
import { setupRoutes } from './pages';
import 'virtual:uno.css';
import App from './App.vue';

setupRoutes();

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(naive);
app.use(UI);
app.mount('#app');
