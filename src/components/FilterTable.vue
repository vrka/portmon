<template>
  <div class="q-mb-md">
    <div class="row q-col-gutter-md items-center reverse-wrap">
      <q-input
        outlined
        dense
        debounce="300"
        v-model="search"
        label="vyhledat"
        class="col-12 col-sm-10"
      />
      <div class="col-12 col-sm-2">
        <slot/>
      </div>
    </div>

    <q-table
      class="q-my-md"
      v-if="data"
      :rows="filteredRows"
      :columns="columns"
      row-key="id"
      flat
      bordered
      @row-click="onRowClick"
      hide-pagination
      :pagination="{rowsPerPage:0}"
    >
      <template v-for="(_ ,slot ) in $slots" v-slot:[slot]="scope">
        <slot v-if="slot !=='default'" :name="slot" v-bind="scope"/>
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
