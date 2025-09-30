<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>{{ title }}</q-toolbar-title>
        <router-link :to="{name:'about'}"><img src="../assets/app-icon.png"/></router-link>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>
    <q-page-container>
      <q-page padding>
        <div v-if="ready">
          <slot/>
        </div>
        <div v-else>
          <q-spinner size="50px" label="Loading..."/>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
  import {ref} from 'vue'
  import EssentialLink from 'components/EssentialLink.vue'

  defineProps({
    ready: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
    }
  });

  const linksList = [
    {
      title: 'Akce',
      caption: 'seznam všech akcí',
      icon: 'list',
      route: {name: 'events'}
    },
    {
      title: 'Osoby',
      caption: 'seznam všech osob',
      icon: 'person',
      route: {name: 'persons'}
    },
    {
      title: 'About',
      caption: 'info & debug',
      icon: 'help_outline',
      route: {name: 'about'}
    },
  ]

  const leftDrawerOpen = ref(false)

  function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }
</script>
