import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  base: 'shop',

  qiankun: {
    master: {
      apps: [{
        name: 'user',
        entry: 'http://localhost:8002'
      }]
    },
    slave: {}
  },
  routes: [
    { path: '/', component: '@/pages/shopList' },
    { path: '/shopDetail/:shopId', component: '@/pages/shopDetail/index' },
    { path: '/test', component: '@/pages/shopTestYeMian' },
  ],
});
