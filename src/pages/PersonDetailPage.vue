<template>
  <AppLayout :ready="!!person">
    <q-form @submit.prevent="savePerson" class="q-gutter-md">
      <q-input v-model="person.forename"
               label="Forename"
               outlined
               dense
      />
      <q-input v-model="person.surname"
               label="Surname"
               outlined
               dense
      />
      <q-input v-model="person.email"
               label="Email"
               outlined
               dense
               type="email"
      />
      <q-input v-model="person.phone"
               label="Phone"
               outlined
               dense
      />
      <q-input v-model="person.account"
               label="Account"
               outlined
               dense
      />
      <q-btn label="Save" color="primary" type="submit"/>
    </q-form>
  </AppLayout>
</template>

<script setup>
  import {onMounted, ref, toRaw} from 'vue';
  import {useRoute, useRouter} from 'vue-router';
  import {db} from 'src/db';
  import AppLayout from 'layouts/AppLayout.vue';

  const route = useRoute();
  const router = useRouter();

  const person = ref(null);

  const personId = Number(route.params.id);

  // fetch person from Dexie
  async function loadPerson() {
    person.value = await db.persons.get(personId);
  }

  onMounted(loadPerson);

  // save person changes
  async function savePerson() {
    if (!person.value) return;
    await db.persons.put(toRaw(person.value));
    router.back();
  }
</script>
