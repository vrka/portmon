<template>
  <AppLayout title="Osoby">
    <PersonTable>
      <q-btn color="positive" @click="addPerson">Přidej</q-btn>
    </PersonTable>
  </AppLayout>
</template>


<script setup>
  import {useRouter} from 'vue-router';
  import {db} from "src/db";
  import AppLayout from 'layouts/AppLayout.vue';
  import PersonTable from "components/PersonTable.vue";

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
