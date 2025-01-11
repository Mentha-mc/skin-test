import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import './index.css';
import './styles/fonts.css'; // 添加字体样式

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('./components/vue/Home.vue')
    },
    {
      path: '/react',
      component: () => import('./components/react/ReactApp.vue')
    }
  ]
});

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);
app.mount('#app');