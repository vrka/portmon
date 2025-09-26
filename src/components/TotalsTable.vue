<template>
  <q-table
    flat bordered dense
    :columns="columns"
    :rows="rowData"
    row-key="code"
    hide-bottom
    @rowClick="toggleView"
  />
</template>

<script setup>
  import {db} from "src/db/index.js";
  import {usePersons} from "composables/usePersons.js";
  import {computed, ref} from "vue";
  import {computeBalances} from "library/balances.js";
  import {Screen} from 'quasar'


  const props = defineProps({
    id: {type: Number, required: true},
  })

  const {getName} = usePersons()

  const force = ref(false);
  const horizontal = computed(() => Screen.gt.md ^ force.value);
  const entries = db.query(db.entries.where({event_id: props.id}));
  const event = db.record(db.events, props.id);
  const safeMembers = computed(() => (event.value?.members ?? []));
  const balance = computed(() => computeBalances(entries.value, safeMembers.value, event.value?.currencies ?? []));
  const rowData = computed(() => horizontal.value ?
    Object.entries(balance.value).map(([code, item]) => ({code, ...item}))
    :
    safeMembers.value.map(id => Object.entries(balance.value).reduce((row, [code, values]) => {
        row[code] = values[id] ?? 0
        return row;
      },
      {id}))
  );
  const columns = computed(() => horizontal.value ? [
        {name: 'currancy', label: 'Měna', align: 'left', field: 'code', sortable: true,},
        ...safeMembers.value.map(id => ({
          name: 'person_' + id,
          align: 'right',
          label: getName(id),
          field: id,
          sortable: true,
          format: (xx) => Number(xx).toFixed(0),
        })),
      ] :
      [
        {
          name: 'person', label: 'Osoba', align: 'left', field: 'id', sortable: true,
          format: (id) => getName(id)
        },
        ...Object.keys(balance.value).map(code => ({
          name: code,
          align: 'right',
          label: code,
          field: code,
          sortable: true,
          format: (xx) => Number(xx).toFixed(0),
        }))
      ]
  );


  function toggleView() {
    force.value = !force.value;
  }


</script>
