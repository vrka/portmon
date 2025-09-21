<template>
  <div class="q-pa-md" style="max-width: 350px">
    <q-list bordered separator>
      <q-item v-for="event in events" :key="event.id" :to="{ name: 'event', params: { id: event.id } }">
        <q-item-section>
          <q-item-label overline>OVERLINE</q-item-label>
          <q-item-label>{{ event.name }}</q-item-label>
          <q-item-label caption >{{ event.description }}</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>5 min ago</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="positive" @click="addEvent"/>
    </q-page-sticky>

  </div>
</template>

<script setup>
  import {liveQuery} from "dexie";
  import {db} from "src/db";
  import {useObservable} from "@vueuse/rxjs";
  import {useRouter} from 'vue-router'

  const router = useRouter()

  const events = useObservable(liveQuery(async () => db.events.toArray()))

  async function addEvent() {
    const newId = await db.events.add({
      name: ' new event',
      description: ''
    })
    router.push({name: 'event', params: {id: newId}})
  }
</script>
