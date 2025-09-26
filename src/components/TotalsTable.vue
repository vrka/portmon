<template>
  <q-table
    flat bordered dense
    :columns="columns"
    :rows="rowData"
    row-key="code"
    hide-bottom
  />
</template>

<script setup>
  import {db} from "src/db/index.js";
  import {usePersons} from "composables/usePersons.js";
  import {computed} from "vue";
  import {computeBalances} from "library/balances.js";

  const props = defineProps({
    id: {type: Number, required: true},
  })

  const {getName} = usePersons()

  const entries = db.query(db.entries.where({event_id: props.id}));
  const event = db.record(db.events, props.id);
  const safeMembers = computed(() => (event.value?.members ?? []));
  const balance = computed(() => computeBalances(entries.value, safeMembers.value, event.value?.currencies ?? []));
  const rowData = computed(() => Object.entries(balance.value).map(([code, item]) => ({code, ...item})));
  const columns = computed(() => {
    return [
      {
        name: 'currancy', label: 'Měna', align: 'left', field: 'code', sortable: true,
      },
      ...safeMembers.value.map(id => ({
        name: 'person_' + id,
        align: 'left',
        label: getName(id),
        field: id,
        sortable: true,
        format: (xx) => Number(xx).toFixed(2),
      })),
    ]
  });


</script>
