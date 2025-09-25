<template>
  <AppPage :ready="!!event">
    <h3>Edit Event: {{ event.name }}</h3>
    <q-checkbox v-model="event.opened"
                label="Uzavřeno"
                :true-value="false"
                :false-value="true"/>
    <q-input
      v-model="event.name"
      label="Name"
      outlined
      class="q-mb-md"
    />
    <q-input
      v-model="event.description"
      label="Description"
      type="textarea"
      outlined
      class="q-mb-md"
    />
    <PersonTable showButtons
                 :members="event.members"
                 @add-member="addMember"
                 @remove-member="removeMember"
    />
    <CurrenciesTable :currencies="event.currencies"
                     :used="usedCurrencies"
                     @delete-currency="onDeleteCurrency"
    />
    <q-btn
      class="q-mt-md"
      color="primary"
      label="Save"
      @click="saveEvent"
      :loading="saving"
    />
  </AppPage>
</template>

<script setup>
  import {computed, ref, toRaw} from 'vue'
  import {useRoute, useRouter} from 'vue-router'
  import {db} from 'src/db'
  import AppPage from "components/AppPage.vue";
  import PersonTable from "components/PersonTable.vue";
  import CurrenciesTable from "components/CurrenciesTable.vue";

  const route = useRoute()
  const router = useRouter()
  const eventId = Number(route.params.id)

  const event = db.record(db.events, eventId);
  const entries = db.query(db.entries.where({event_id: eventId}));
  const saving = ref(false)

  const usedCurrencies = computed(() => Array.from(new Set(entries.value.map(e => e.currency))));

  async function saveEvent() {
    saving.value = true
    try {
      await db.events.put(toRaw(event.value))
      router.push({name: 'event', params: eventId})
    } finally {
      saving.value = false
    }
  }

  async function updateMembers() {
    await db.events.update(eventId, {
      members: [...event.value.members]
    })
  }

  async function addMember(personId) {
    if (!event.value.members.includes(personId)) {
      // update local state
      event.value.members.push(personId)
      await updateMembers();
    }
  }

  async function removeMember(personId) {
    event.value.members = event.value.members.filter(id => id !== personId)
    await updateMembers();
  }

  function onDeleteCurrency(code) {
    const index = event.value.currencies.findIndex(c => c.code === code)
    if (index !== -1) {
      event.value.currencies.splice(index, 1)
    }
  }
</script>
