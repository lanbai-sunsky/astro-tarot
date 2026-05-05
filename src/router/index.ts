import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/tarot',
    },
    {
      path: '/tarot',
      name: 'tarot',
      component: () => import('@/views/TarotView.vue'),
    },
    {
      path: '/chart',
      name: 'chart',
      component: () => import('@/views/ChartView.vue'),
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('@/views/HistoryView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
    },
  ],
})

export default router
