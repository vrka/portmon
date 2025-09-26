<template>
  <FilterTable :data="persons"
               :columns="computedColumns"
               @rowClick="onRowClick"
  >
    <template #body-cell-action="{ row }" v-if="showButtons">
      <q-td class="text-center">
        <q-btn
          v-if="canRemove(row.id)"
          label="Odebrat"
          color="negative"
          @click.stop="doRemove(row.id)"
        />
        <q-btn
          v-if="canAdd(row.id)"
          label="Přidat"
          color="positive"
          @click.stop="doAdd(row.id)"
        />
      </q-td>
    </template>
    <slot/>
  </FilterTable>
</template>

<script setup>
  import {computed} from 'vue';
  import {db} from 'src/db';
  import {useRouter} from "vue-router";
  import FilterTable from "components/FilterTable.vue";

  const props = defineProps({
    members: {type: Array, default: () => []},
    used: {type: Array, default: () => []},
    showButtons: {type: Boolean, default: false},
  });

  const router = useRouter();
  const emit = defineEmits(['add-member', 'remove-member']);
  const persons = db.query(db.persons);

  // columns
  const baseColumns = [
    {name: 'forename', label: 'Příjmení', align: 'left', field: 'forename', sortable: true},
    {name: 'surname', label: 'Jméno', align: 'left', field: 'surname', sortable: true},
    {name: 'email', label: 'Email', align: 'left', field: 'email', sortable: true},
    {name: 'phone', label: 'Tel', align: 'left', field: 'phone', sortable: true},
    {name: 'account', label: 'Účet', align: 'left', field: 'account', sortable: true}
  ];

  const computedColumns = computed(() => {
    if (props.showButtons) {
      return [...baseColumns, {name: 'action', label: 'Akce', align: 'center', field: 'id', sortable: true}];
    }
    return baseColumns;
  });


  function canAdd(id) {
    return !props.members.includes(id);
  }

  function canRemove(id) {
    return props.members.includes(id) && !props.used.includes(id);
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
