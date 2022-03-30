import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/Administrator/AdminView.vue'),
    children: [
      {
        path: 'products',
        component: () => import('../views/Administrator/AdminProducts.vue')
      },
      {
        path: 'orders',
        component: () => import('../views/Administrator/AdminOrders.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('../views/Administrator/LoginView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkActiveClass: 'active'
})

export default router
