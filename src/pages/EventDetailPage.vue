<template>
  <div v-if="event">
    <h2>Edit Event: {{ event.name }}</h2>

    <q-input
      v-model="event.name"
      label="Name"
      outlined
      class="q-mb-md"
    />
    <q-input
      v-model="event.description"
      label="Description"
      type="textarea"
      outlined
      class="q-mb-md"
    />

    <q-btn
      color="primary"
      label="Save"
      @click="saveEvent"
      :loading="saving"
    />
  </div>

  <div v-else>
    <q-spinner color="primary" size="2em"/>
    <span class="q-ml-md">Loading event...</span>
  </div>
</template>

<script setup>
  import {ref, onMounted} from 'vue'
  import {useRoute} from 'vue-router'
  import {db} from 'src/db'
  import {toRaw} from 'vue'
  import {useRouter} from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  const eventId = Number(route.params.id) // convert string -> number

  const event = ref(null)
  const saving = ref(false)

  // Load event from IndexedDB
  onMounted(async () => {
    event.value = await db.events.get(eventId)
  })

  // Save changes
  async function saveEvent() {
    if (!event.value) return
    saving.value = true
    try {
      await db.events.put(toRaw(event.value))
      router.push({name: 'events'})
    }
    finally {
      saving.value = false
    }
  }
</script>
