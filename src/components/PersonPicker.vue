<template>
  <div>
    <h6>{{ label }}</h6>
    <q-checkbox
      v-model="allSelected"
      label="Všichni"
      class="q-mb-sm"
    />
    <q-list bordered separator>
      <q-item
        v-for="person in allPersons"
        :key="person"
        clickable
        :active="isSelected(person)"
        active-class="bg-primary text-white"
        @click="togglePerson(person)"
      >
        <q-item-section>
          <q-item-label>{{ getPerson(person).forename }} {{ getPerson(person).surname }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
  import {computed} from 'vue';
  import {usePersons} from "composables/usePersons.js";

  const props = defineProps({
    modelValue: {type: Array, default: () => []},
    allPersons: {type: Array, default: () => []},
    label: {type: String, default: ''},
  })

  const emit = defineEmits(['update:modelValue']);
  const {getPerson} = usePersons();

  const allSelected = computed({
    get() {
      return props.modelValue === null
    },
    set(val) {
      if (val) {
        emit('update:modelValue', null)
      } else {
        emit('update:modelValue', [])
      }
    }
  })

  function togglePerson(id) {
    if (allSelected.value) {
      const newValue = props.allPersons.map(i => i.id).filter(i => i !== id)
      emit('update:modelValue', newValue)
    } else {
      const current = [...props.modelValue]
      const index = current.indexOf(id)
      if (index === -1) {
        current.push(id)
      } else {
        current.splice(index, 1)
      }
      emit('update:modelValue', current)
    }
  }

  function isSelected(id) {
    return props.modelValue == null || props.modelValue.includes(id)
  }
</script>
