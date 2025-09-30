import EventsPage from 'pages/EventsPage.vue';
import EventDetailPage from 'pages/EventDetailPage.vue';
import EventEditPage from 'pages/EventEditPage.vue';
import PersonsPage from 'pages/PersonsPage.vue';
import PersonDetailPage from 'pages/PersonDetailPage.vue';
import EntryEditPage from 'pages/EntryEditPage.vue';
import ErrorNotFound from 'pages/ErrorNotFound.vue';
import AboutPage from "pages/AboutPage.vue";

const routes = [
  {
    path: '/',
    children: [
      {name: 'about', path: '', component: AboutPage},
      {name: 'events', path: '', component: EventsPage},
      {name: 'event', path: 'event/:id', component: EventDetailPage},
      {name: 'event-edit', path: 'event/:id/edit', component: EventEditPage},
      {name: 'persons', path: 'persons', component: PersonsPage},
      {name: 'person-detail', path: 'person/:id', component: PersonDetailPage},
      {name: 'entry', path: 'entry/:id', component: EntryEditPage},

    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: ErrorNotFound
  }
]

export default routes
