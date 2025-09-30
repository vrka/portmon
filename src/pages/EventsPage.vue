<template>
  <AppLayout title="Akce">
    <div class="row reverse-wrap">
      <div class="col-12 col-sm-10">Akce</div>
      <q-btn class="col-12 col-sm-2" color="positive" @click="addEvent">Přidej</q-btn>
    </div>
    <q-list bordered separator style="max-width: 350px">
      <q-item v-for="event in events" :key="event.id" :to="{ name: 'event', params: { id: event.id } }">
        <q-item-section>
          <q-item-label overline>{{ getMembers(event.members) }}</q-item-label>
          <q-item-label>{{ event.name }}</q-item-label>
          <q-item-label caption>{{ event.description }}</q-item-label>
        </q-item-section>

        <q-item-section side top v-if="!event.opened">
          <q-item-label caption>Uzavřeno</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </AppLayout>
</template>

<script setup>
  import {db} from "src/db";
  import {useRouter} from 'vue-router'
  import AppLayout from 'layouts/AppLayout.vue';
  import {usePersons} from 'src/composables/usePersons'

  const router = useRouter()
  const events = db.query(db.events)
  const {getMembers} = usePersons()

  async function addEvent() {
    const newId = await db.events.add({
      name: 'new event',
      description: '',
      members: [],
      opened: true,
      currencies: []
    })
    router.push({name: 'event', params: {id: newId}})
  }
</script>
