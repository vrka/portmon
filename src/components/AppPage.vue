<template>
  <q-page padding>
    <div v-if="ready">
      <slot/>
    </div>
    <div v-else>
      <q-spinner size="50px" label="Loading..."/>
    </div>
  </q-page>

</template>

<script setup>
  defineProps({
    ready: {
      type: Boolean,
      default: true
    }
  });
</script>
