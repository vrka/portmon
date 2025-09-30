<template>
  <AppLayout :ready="ready" :title="'Portmon ' + version">
    <q-btn v-if="!showDump" color="negative" @click="showDump=true">Dump</q-btn>
    <div v-else>
      <q-input type="textarea" v-model="dump" autogrow outlined/>
      <q-btn class="q-my-md" @click="onSave" color="negative" outline>Save</q-btn>
    </div>
  </AppLayout>
</template>

<script setup>
  import AppLayout from "layouts/AppLayout.vue";
  import {dumpDb, db} from "src/db/index.js";
  import {onMounted, ref} from "vue";
  import {Notify} from "quasar";

  const version = W_VERSION;
  const dump = ref('');
  const ready = ref(false);
  const showDump = ref(false);

  onMounted(loadDump);

  async function loadDump() {
    console.log("dumping");
    dump.value = JSON.stringify(await dumpDb(), null, 2);
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

</script>
