<template>
  <h6>Měny</h6>
  <q-list bordered separator>
    <q-item v-for="c in currencies" :key="c.code" class="items-start">
      <q-item-section>
        <q-item-label>
          <div class="row items-center q-gutter-sm q-mt-xs">
            <q-input
              v-model.number="c.unit"
              type="number"
              dense
              style="max-width: 3rem"
            />
            <span v-text="c.code"/>
            <q-btn
              v-if="!c.ratio"
              rounded
              flat
              icon="currency_exchange" @click="tryEnableConversion(c)"/>
            <q-btn
              v-if="!used.includes(c.code)"
              icon="delete"
              color="negative"
              flat
              @click.stop="deleteCurrency(c)"
            />
          </div>
        </q-item-label>
        <div v-if="c.ratio" class="row items-center q-gutter-sm q-mt-xs">
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
            emit-value
            option-label="label"
            option-value="value"
            outlined
            dense
            style="min-width: 100px"
          />
        </div>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-label class="row q-gutter-md">
        <q-input
          v-model="newCode"
          dense
          @keyup.enter="addCurrency"
          style="max-width: 3rem"
        />
        <q-btn color="positive" outline icon="add_circle_outline" @click="addCurrency"/>
      </q-item-label>
    </q-item>
  </q-list>
</template>

<script setup>
  import {computed, ref} from 'vue'

  const props = defineProps({
    currencies: {type: Array, default: () => []},
    used: {type: Array, default: () => []},
  })

  const emit = defineEmits(['delete-currency', 'add-currency']);

  const newCode = ref('');

  const currencyOptions = computed(() => {
    return props.currencies?.map(c => ({
      label: c.code,
      value: c.code
    })) || []
  });

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

  async function addCurrency() {
    emit('add-currency', newCode.value);
    newCode.value = '';
  }

</script>
