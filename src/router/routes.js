const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {name: 'events', path: 'events', component: () => import('pages/EventsPage.vue')},
      {name: 'event', path: 'event/:id', component: () => import('pages/EventDetailPage.vue')},
      {name: 'event-edit', path: 'event/:id/edit', component: () => import('pages/EventEditPage.vue')},
      {name: 'persons', path: 'persons', component: () => import('pages/PersonsPage.vue')},
      {name: 'person-detail', path: 'person/:id', component: () => import('pages/PersonDetailPage.vue')},
      {name: 'entry', path: 'entry/:id', component: () => import('pages/EntryEditPage.vue')},

      {path: '', component: () => import('pages/IndexPage.vue')}
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
