<template>
  <AppLayout title="Osoby">
    <PersonTable/>
    <AppToolbar>
      <q-btn fab icon="add" color="positive" @click="addPerson"/>
    </AppToolbar>
  </AppLayout>
</template>


<script setup>
  import {useRouter} from 'vue-router';
  import {db} from "src/db";
  import AppLayout from 'layouts/AppLayout.vue';
  import PersonTable from "components/PersonTable.vue";
  import AppToolbar from "components/AppToolbar.vue";

  const router = useRouter();

  async function addPerson() {
    const newId = await db.persons.add({
      forename: 'New',
      surname: 'Person',
      email: '',
      phone: '',
      account: '',
    })
    router.push({name: 'person-detail', params: {id: newId}});
  }

</script>
