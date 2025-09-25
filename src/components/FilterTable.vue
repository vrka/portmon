<template>
  <div class="q-mb-md">
    <q-input
      outlined
      dense
      debounce="300"
      v-model="search"
      label="Quick Search"
      class="q-mb-md"
    />

    <q-table
      v-if="data"
      :rows="filteredRows"
      :columns="columns"
      row-key="id"
      flat
      bordered
      @row-click="onRowClick"
      hide-pagination
    >
      <slot v-for="name in Object.keys($slots)" :name="name" v-bind="{ row: row }"/>
    </q-table>
  </div>
</template>

<script setup>
  import {computed, ref} from 'vue';

  const props = defineProps({
    columns: {type: Array, required: true},
    data: {type: Array},
  });

  const emit = defineEmits(['row-click']);

  const search = ref('');

  const filteredRows = computed(() => {
    if (!search.value) return props.data;
    const s = search.value.toLowerCase();
    return props.data.filter(p =>
      Object.values(p).some(v => v?.toString().toLowerCase().includes(s))
    );
  });

  function onRowClick(evt, row) {
    emit('row-click', row);
  }
</script>
