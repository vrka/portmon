<template>
  <router-view />
</template>

<script setup>
  import useErrorHandler from "composables/errorHandler.js";

  useErrorHandler();

</script>
