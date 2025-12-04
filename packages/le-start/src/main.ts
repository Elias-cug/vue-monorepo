import { createApp } from 'vue';
import naive from 'naive-ui';
import { createPinia } from 'pinia';
import UI from '@lee/ui';
import '@lee/base/src/styles/index.scss';
import router from '@lee/base/src/router/index';
import { useAppStore } from '@lee/base/src/store/app';
import CustomHeader from './layout/CustomHeader.vue';
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

const appStore = useAppStore();
appStore.setCustomHeader(CustomHeader);

app.mount('#app');
