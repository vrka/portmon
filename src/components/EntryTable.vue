<template>
  <FilterTable :data="entries"
               :columns="columns"
               @rowClick="onRowClick"
  >
    <slot/>
  </FilterTable>
</template>

<script setup>
  import FilterTable from "components/FilterTable.vue";
  import {db} from "src/db/index.js";
  import {useRouter} from "vue-router";
  import {usePersons} from "composables/usePersons.js";

  const router = useRouter()
  const {getMembers} = usePersons()

  const props = defineProps({
    id: {type: Number, required: true},
  })
  const entries = db.query(db.entries.where({event_id: props.id}));
  const columns = [
    {
      name: 'date', label: 'Datum', align: 'left', field: 'date', sortable: true,
      format: val => val ? new Date(val).toLocaleDateString() : ''
    },
    {name: 'description', label: 'Popis', align: 'left', field: 'description', sortable: true},
    {name: 'amount', label: 'Částka', align: 'right', field: 'amount', sortable: true},
    {name: 'currency', label: 'Měna', align: 'left', field: 'currency', sortable: true},
    {
      name: 'payers', label: 'Plátce', align: 'left', field: 'payers', sortable: true,
      format: getMembers,
    },
    {
      name: 'receivers', label: 'Příjemci', align: 'left', field: 'receivers', sortable: true,
      format: getMembers,
    },
  ];

  function onRowClick(row) {
    router.push({name: 'entry', params: {id: row.id}})
  }

</script>
