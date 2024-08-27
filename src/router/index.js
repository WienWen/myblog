import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      children: [
        {
          path: '/',
          name: 'article',
          component: () => import('../views/ArticleView.vue')
        },
        {
          path: '/about/:id',
          name: 'about',
          component: () => import('../views/AboutView.vue'),
          props: true
        },
        {
          path: '/msg',
          name: 'msg',
          component: () => import('../views/MsgView.vue')
        },
        {
          path: '/other',
          name: 'other',
          component: () => import('../views/OtherView.vue')
        },
        {
          path: '/search',
          name: 'search',
          component: () => import('../views/SearchResultView.vue')
        },
        {
          path: '/admin',
          name: 'admin',
          component: () => import('../views/AdminView.vue'),
        },
        {
          path: '/admin/article/:id?',
          name: 'adminArticle',
          component: () => import('../views/AdminArticleView.vue')
        }
      ]
    },
  ]
})

export default router
