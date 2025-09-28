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
  import {computeBalances, formatValue, unit2params} from "library/balances.js";
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
  const safeCurrencies = computed(() => (event.value?.currencies ?? []));
  const units = computed(() => safeCurrencies.value.reduce((acc, {code, unit = 1}) => {
    acc[code] = unit2params(unit);
    return acc;
  }, {}));
  const balance = computed(() => computeBalances(entries.value, safeMembers.value, safeCurrencies.value));
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
          format: (value, row) => formatValue(value, units.value[row.code]),
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
          format: (value) => formatValue(value, units.value[code]),
        }))
      ]
  );


  function toggleView() {
    force.value = !force.value;
  }


</script>
