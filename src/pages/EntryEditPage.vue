<template>
  <AppLayout :ready="!!entry" title="Editace položky">
    <q-form @submit.prevent="saveEntry">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-lg-6">
          <div class="row q-col-gutter-md">
            <q-input class="col-12 col-sm-8 col-md-4"
                     v-model.number="entry.amount"
                     label="Částka"
                     type="number"
                     outlined
                     dense
            />
            <q-select class="col-12 col-sm-4"
                      v-model="entry.currency"
                      :options="currencyOptions"
                      label="Měna"
                      outlined
                      dense
                      use-input
                      emit-value
                      input-debounce="300"
                      new-value-mode="add"
                      @new-value="normalizeCurrency"
            />
            <DatePicker class="col-12 col-md-4"
                        v-model="entry.date"/>
            <q-input class="col-12"
                     v-model="entry.description"
                     label="Popis"
                     type="textarea"
                     outlined
                     dense
            />
          </div>
        </div>
        <div class="col-12 col-lg-6">
          <div class="row q-col-gutter-md">
            <PersonPicker class="col-12 col-sm-6"
                          v-model="entry.payers"
                          :all-persons="event?.members"
                          label="Plátce"
            />
            <PersonPicker class="col-12 col-sm-6"
                          v-model="entry.receivers"
                          :all-persons="event?.members"
                          label="Příjemce"
            />
          </div>
        </div>
        <div class="col-12">
          <q-btn label="Uložit" color="primary" type="submit"/>
        </div>
      </div>
    </q-form>
  </AppLayout>
</template>

<script setup>
  import {ref, toRaw} from 'vue';
  import {useRoute, useRouter} from 'vue-router';
  import {db} from 'src/db';
  import AppLayout from 'layouts/AppLayout.vue';
  import PersonPicker from 'components/PersonPicker.vue';
  import {whenReady} from "library/helpers.js";
  import DatePicker from "components/DatePicker.vue";

  const route = useRoute();
  const router = useRouter();

  const entryId = Number(route.params.id);

  const entry = db.record(db.entries, entryId);
  const eventIdPromise = db.field(entry, 'event_id')
  const event = db.record(db.events, eventIdPromise);

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
