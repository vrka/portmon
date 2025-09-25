<template>
  <FilterTable :data="persons"
               :columns="computedColumns"
               @rowClick="onRowClick"
  >
    <template #body-cell-action="{ row }" v-if="showButtons">
      <q-td>
        <q-btn
          v-if="canRemove(row.id)"
          label="Remove"
          color="negative"
          @click.stop="doRemove(row.id)"
        />
        <q-btn
          v-if="canAdd(row.id)"
          label="Add"
          color="positive"
          @click.stop="doAdd(row.id)"
        />
      </q-td>
    </template>
  </FilterTable>
</template>

<script setup>
  import {computed} from 'vue';
  import {db} from 'src/db';
  import {useRouter} from "vue-router";
  import FilterTable from "components/FilterTable.vue";

  const props = defineProps({
    members: {type: Array, default: () => []}, // array of person IDs
    showButtons: {type: Boolean, default: false},
  });

  const router = useRouter();
  const emit = defineEmits(['add-member', 'remove-member']);
  const persons = db.query(db.persons);

  // columns
  const baseColumns = [
    {name: 'forename', label: 'Forename', align: 'left', field: 'forename', sortable: true},
    {name: 'surname', label: 'Surname', align: 'left', field: 'surname', sortable: true},
    {name: 'email', label: 'Email', align: 'left', field: 'email', sortable: true},
    {name: 'phone', label: 'Phone', align: 'left', field: 'phone', sortable: true},
    {name: 'account', label: 'Account', align: 'left', field: 'account', sortable: true}
  ];

  const computedColumns = computed(() => {
    if (props.showButtons) {
      return [...baseColumns, {name: 'action', label: '', align: 'center', field: 'id', sortable: true}];
    }
    return baseColumns;
  });


  function canAdd(id) {
    return !props.members.includes(id);
  }

  function canRemove(id) {
    return props.members.includes(id);
  }

  function doRemove(id) {
    emit('remove-member', id);
  }

  function doAdd(id) {
    emit('add-member', id);
  }

  function onRowClick(row) {
    router.push({name: 'person-detail', params: {id: row.id}});
  }
</script>
