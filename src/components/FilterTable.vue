<template>
  <div class="q-mb-md">
    <q-input
      outlined
      dense
      debounce="300"
      v-model="search"
      label="vyhledat"
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
      <template v-for="(_ ,slot ) in $slots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope"/>
      </template>
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
