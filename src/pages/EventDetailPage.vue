<template>
  <AppLayout :ready="!!event" :title="event?.name">
    <div class="row reverse-wrap">
      <div class="col-12 col-sm-10" v-text="event.description"/>
      <q-btn class="col-12 col-sm-2" color="primary" @click="edit" outline label="Uprav"/>
    </div>
    <TotalsTable :id="eventId" class="q-my-md"/>
    <EntryTable :id="eventId">
      <q-btn class="full-width" color="positive" @click="add" label="Přidej"/>
    </EntryTable>
  </AppLayout>
</template>

<script setup>
  import {db} from "src/db";
  import {useRoute, useRouter} from "vue-router";
  import AppLayout from 'layouts/AppLayout.vue';
  import EntryTable from "components/EntryTable.vue";
  import TotalsTable from "components/TotalsTable.vue";

  const route = useRoute()
  const router = useRouter()
  const eventId = Number(route.params.id)
  const event = db.record(db.events, eventId);

  function edit() {
    router.push({name: 'event-edit', params: {id: eventId}})
  }

  async function add() {
    const newId = await db.entries.add({
      event_id: eventId,
      date: new Date,
      description: '',
      amount: 0,
      currency: await getDefaultCurrency(eventId),
      payers: null,
      receivers: null
    })
    router.push({name: 'entry', params: {id: newId}})
  }

  async function getDefaultCurrency(eventId) {
    return await mostUsedCurrency(db.entries.where({event_id: eventId}))
      || await mostUsedCurrency(db.entries)
      || "";
  }

  async function mostUsedCurrency(query) {
    let maxCurrency = null;
    let maxCount = 0;
    const counts = {};

    await query.filter(entry => entry.currency)
      .each(entry => {
        counts[entry.currency] = (counts[entry.currency] || 0) + 1;
        if (counts[entry.currency] > maxCount) {
          maxCount = counts[entry.currency];
          maxCurrency = entry.currency;
        }
      });
    return maxCurrency;
  }

</script>
