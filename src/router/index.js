import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/BackendView.vue'),
    children: [
      {
        path: 'products',
        component: () => import('../views/AdminProducts.vue')
      },
      {
        path: 'orders',
        component: () => import('../views/AdminCoupon.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('../views/LoginView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkActiveClass: 'active'
})

export default router
