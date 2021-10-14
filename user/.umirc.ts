import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  base: 'user',
  qiankun: {
    slave: {}
  },
  routes: [
    { path: '/', component: '@/pages/UserList' },
    { path: '/:userId', component: '@/pages/UserDetail' },
  ],
});
