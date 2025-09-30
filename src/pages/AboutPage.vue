<template>
  <AppLayout :ready="ready" :title="'Portmon ' + version">
    <q-btn v-if="!showDebug" color="negative" @click="showDebug=true">Debug</q-btn>
    <div v-else class="q-gutter-md">
      <q-btn color="negative" outline icon="delete_forever" @click="confirm(onDelete,'Purge whole DB?')">Delete DB</q-btn>
      <q-input type="textarea" v-model="dump" autogrow outlined/>
      <q-btn @click="confirm(onSave, 'Replace existing DB?')" color="negative" outline>Save</q-btn>
    </div>
  </AppLayout>
</template>

<script setup>
  import AppLayout from "layouts/AppLayout.vue";
  import {db} from "src/db/index.js";
  import {onMounted, ref} from "vue";
  import {Notify} from "quasar";
  import {confirm} from "library/confirm.js";

  const version = W_VERSION;
  const dump = ref('');
  const ready = ref(false);
  const showDebug = ref(false);

  onMounted(loadDump);

  async function loadDump() {
    console.log("dumping");
    dump.value = JSON.stringify(await db.dumpDb(), null, 2);
    ready.value = true;
  }

  async function onSave() {
    const parsed = JSON.parse(dump.value);

    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Invalid dump format')
    }

    // Clear all tables and repopulate
    await db.transaction('rw', db.tables, async () => {
      for (const table of db.tables) {
        await table.clear()
        if (parsed[table.name]) {
          await table.bulkAdd(parsed[table.name])
        }
      }
    })

    Notify.create({type: 'positive', message: 'Database restored from dump'})
    await loadDump();
  }

  async function onDelete() {
    await db.deleteDatabase()
    await loadDump();
  }

</script>
