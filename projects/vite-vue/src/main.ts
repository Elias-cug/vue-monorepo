import { createApp } from 'vue';
import naive from 'naive-ui';
import { createPinia } from 'pinia';
import '@lee/base/src/styles/index.scss';
import router from '@lee/base/src/router/index';
import 'virtual:uno.css';
import App from './App.vue';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(naive);
app.mount('#app');
