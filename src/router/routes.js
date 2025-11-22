const routes = [
  // Ruta de Login (sin layout)
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue')
  },

  // Rutas protegidas con MainLayout
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/digimons'
      },
      {
        path: 'digimons',
        component: () => import('pages/IndexPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
