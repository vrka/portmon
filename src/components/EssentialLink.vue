<template>
  <q-item exact
          v-bind="itemProps"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon"/>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>

  const props = defineProps({
    title: {type: String, required: true},
    caption: {type: String, default: ''},
    link: {type: String, default: ''},
    route: {type: [String, Object], default: null},
    icon: {type: String, default: ''},
    replace: {type: Boolean, default: false}
  })

  const isRoute = !!props.route
  const isLink = !isRoute && !!props.link

  // Only pass props relevant for the type
  const itemProps = isRoute
    ? {to: props.route, replace: props.replace}       // router link
    : isLink
      ? {href: props.link, target: '_blank', tag: 'a'} // external link
      : {}  // fallback

</script>
