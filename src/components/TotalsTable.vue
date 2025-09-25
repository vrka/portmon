<template>
  <div>totals</div>
</template>

<script setup>
  import {db} from "src/db/index.js";
  import {usePersons} from "composables/usePersons.js";
  import {waitReady} from "library/helpers.js";
  import {ref} from "vue";

  const props = defineProps({
    id: {type: Number, required: true},
  })

  const {getName} = usePersons()

  const entries = db.query(db.entries.where({event_id: props.id}));
  const event = db.record(db.events, props.id);
  const columns = ref([]);


  Promise.all([waitReady(entries), waitReady(event)]).then(() => {
    const members = event.value.members;
    const nullRow = Object.fromEntries(members.map(n => [n, 0]));
    const bilance = {};

    entries.value.each(entry => {
      const payers = entry.payers === null ? members : entry.payers;
      const receivers = entry.receivers === null ? members : entry.receivers;
      if (!payers.length || !receivers.length || !entry.currency || !entry.amount)
        return;
      const {curr, amount} = getReal(entry, event.currencies);
      ensureCurrency(curr);
      updateBilance(curr, payers, amount);
      updateBilance(curr, receivers, -amount);
    })

    function updateBilance(curr, members, amount) {
      const amount_split = amount / members.length;
      members.each(m => {
        bilance[curr][m] += amount_split;
      })
    }

    function getReal(entry, currencies) {
      let amount = entry.amount;
      let curr = entry.currency;
      while (true) {

        const item = currencies.find(c => c.code === curr && c.ratio !== undefined);
        if (!item) break;
        amount *= item.reverse ? item.ratio : 1 / item.ratio;
        curr = item.base;
      }
      return {curr, amount};
    }

    function ensureCurrency(code) {
      if (!(code in bilance))
        bilance[code] = {...nullRow};
    }
  })


</script>
