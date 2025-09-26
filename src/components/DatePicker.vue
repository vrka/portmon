<template>
  <q-input v-model="dateString" outlined dense label="Datum" class="q-mb-md">
    <template #append>
      <q-icon name="event" class="cursor-pointer"/>
      <q-popup-proxy v-model="showDatePicker" transition-show="scale" transition-hide="scale">
        <q-date v-model="dateString" mask="YYYY-MM-DD" today-btn/>
      </q-popup-proxy>
    </template>
  </q-input>
</template>

<script setup>
  import {computed, ref} from "vue";

  const props = defineProps({
    modelValue: {
      type: [Date, null],
    }
  })

  const emit = defineEmits(['update:modelValue'])

  const showDatePicker = ref(false);
  const dateString = computed({
    get: () => props.modelValue?.toISOString().split('T')[0] || '',
    set: val => {
      emit('update:modelValue', new Date(val));
    }
  });

</script>
