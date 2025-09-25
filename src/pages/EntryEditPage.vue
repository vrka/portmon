<template>
  <AppPage :ready="!!entry">
    <h3>Edit Entry</h3>
    <q-form @submit.prevent="saveEntry" class="q-gutter-md">

      <!-- Date -->
      <q-input v-model="dateString" outlined dense label="Date" class="q-mb-md">
        <template #append>
          <q-icon name="event" class="cursor-pointer" @click="showDatePicker = true"/>
        </template>
        <q-popup-proxy v-model="showDatePicker" transition-show="scale" transition-hide="scale">
          <q-date v-model="dateString" mask="YYYY-MM-DD" today-btn/>
        </q-popup-proxy>
      </q-input>

      <!-- Description -->
      <q-input
        v-model="entry.description"
        label="Description"
        type="textarea"
        outlined
        dense
        class="q-mb-md"
      />

      <!-- Amount -->
      <q-input
        v-model.number="entry.amount"
        label="Amount"
        type="number"
        outlined
        dense
        class="q-mb-md"
      />

      <!-- Currency -->
      <q-select
        v-model="entry.currency"
        :options="currencyOptions"
        label="Currency"
        outlined
        dense
        use-input
        emit-value
        input-debounce="300"
        new-value-mode="add"
        @new-value="normalizeCurrency"
        class="q-mb-md"
      />

      <PersonPicker
        v-model="entry.payers"
        :all-persons="persons"
        label="Plátce"
      />

      <PersonPicker
        v-model="entry.receivers"
        :all-persons="persons"
        label="Příjemce"
      />

      <q-btn label="Save" color="primary" type="submit"/>
    </q-form>
  </AppPage>
</template>

<script setup>
  import {computed, ref, toRaw} from 'vue';
  import {useRoute, useRouter} from 'vue-router';
  import {db} from 'src/db';
  import AppPage from 'components/AppPage.vue';
  import PersonPicker from 'components/PersonPicker.vue';
  import {whenReady} from "library/helpers.js";

  const route = useRoute();
  const router = useRouter();

  const entryId = Number(route.params.id);

  const entry = db.record(db.entries, entryId);
  const eventIdPromise = db.field(entry, 'event_id')
  const event = db.record(db.events, eventIdPromise);

  const persons = db.query(db.persons);

  const showDatePicker = ref(false);
  const dateString = computed({
    get: () => entry.value?.date?.toISOString().split('T')[0] || '',
    set: val => {
      entry.value.date = new Date(val);
    }
  });

  // Generate currency options: existing + allow free entry
  const currencyOptions = ref([]);

  whenReady(event, ev => currencyOptions.value = ev.currencies?.map(({code}) => ({
    label: code,
    value: code
  })) || []);

  async function saveEntry() {
    //make sure currencies are actual
    insertCurrency(entry.value.currency);
    await db.entries.put(toRaw(entry.value));
    router.back();
  }

  function insertCurrency(code) {
    if (!event.value.currencies) {
      event.value.currencies = [];
    }

    // only add if it’s not already there
    if (!event.value.currencies.some(c => c.code === code)) {
      event.value.currencies.push({code: code});
      currencyOptions.value.push({label: code, value: code})
      db.events.update(event.value.id, {currencies: toRaw(event.value.currencies)});
    }
  }

  function normalizeCurrency(val, done) {
    if (!val) return

    const code = val.trim().toUpperCase()
    insertCurrency(code)
    done(code)
  }

</script>
