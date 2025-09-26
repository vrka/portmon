<template>
  <div>
    <div class="row justify-between items-baseline">
      <span class="text-subtitle1" v-text="label"/>
      <q-toggle v-model="allSelected"
                label="Všichni"
                left-label/>
    </div>
    <q-list bordered separator>
      <q-item
        v-for="person in allPersons"
        :key="person"
        clickable
        dense
        :active="isSelected(person)"
        xactive-class="bg-primary text-white"
        active-class="text-black"
        :class="{'text-grey-7': !isSelected(person)}"

        @click="togglePerson(person)"
      >
        <q-item-section>
          <q-checkbox v-model="selected"
                    :val="person"
                    :label="getPerson(person).forename + ' ' + getPerson(person).surname"
          />
        </q-item-section>
        <q-item-section side>
          <q-btn dense flat outline square :icon="isExcluded(person) ? 'star': 'star_outline'"
                 :color="isExcluded(person) ? 'yellow-9' : isSelected(person) ? 'black': 'text-grey-7'"
                 @click.stop="longPressPerson(person)"/>
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

  const selected = computed({
    get() {
      return props.modelValue === null ? props.allPersons : props.modelValue
    },
    set(val) {
      emit('update:modelValue', val)
    }
  })

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
      const newValue = props.allPersons.filter(i => i !== id)
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

  function longPressPerson(id) {
    emit('update:modelValue', [id])
  }

  function isSelected(id) {
    return props.modelValue == null || props.modelValue.includes(id)
  }

  function isExcluded(id) {
    return props.modelValue && props.modelValue.length === 1 && props.modelValue[0] === id;
  }
</script>
