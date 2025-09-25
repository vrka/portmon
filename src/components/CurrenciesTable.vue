<template>
  <q-list bordered separator>
    <q-item v-for="c in currencies" :key="c.code" class="items-start" clickable @click="tryEnableConversion(c)">
      <q-item-section>
        <q-item-label>{{ c.code }}
          <q-btn
            v-if="!used.includes(c.code)"
            icon="delete"
            color="negative"
            flat
            @click.stop="deleteCurrency(c)"
          />
        </q-item-label>
        <div v-if="c.ratio !== undefined" class="row items-center q-gutter-sm q-mt-xs">
          <q-btn
            dense
            round
            outline
            icon="close"
            color="negative"
            size="sm"
            @click.stop="disableConversion(c)"
          />
          <q-btn v-if="!c.reverse" @click="c.reverse=true">1</q-btn>
          <q-input
            v-else
            v-model.number="c.ratio"
            type="number"
            dense
            style="max-width: 100px"
          />
          <span> {{ c.code }} = </span>
          <q-btn v-if="c.reverse" @click="c.reverse=false">1</q-btn>
          <q-input
            v-else
            v-model.number="c.ratio"
            type="number"
            dense
            style="max-width: 100px"
          />
          <q-select
            v-model="c.base"
            :options="baseOptions(c)"
            option-label="label"
            option-value="value"
            outlined
            dense
            style="min-width: 100px"
          />
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
  import {ref, watch} from 'vue'

  const props = defineProps({
    currencies: {type: Array, default: () => []},
    used: {type: Array, default: () => []},
  })

  const emit = defineEmits(['delete-currency']);

  const currencyOptions = ref([])

  watch(
    () => props.currencies,
    (val) => {
      currencyOptions.value = val?.map(c => ({
        label: c.code,
        value: c.code
      })) || []
    },
    {immediate: true}
  )

  function tryEnableConversion(c) {
    if (c.ratio === undefined) {
      enableConversion(c)
    }
  }

  function enableConversion(c) {
    c.ratio = 1;
    c.reverse = false;
    c.base = '';
  }

  function disableConversion(c) {
    delete c.ratio;
    delete c.reverse;
    delete c.base;
  }

  function baseOptions(c) {
    return currencyOptions.value.filter(opt => opt.value !== c.code)
  }

  function deleteCurrency(c) {
    emit('delete-currency', c.code)
  }

</script>
