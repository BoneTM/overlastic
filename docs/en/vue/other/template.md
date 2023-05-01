# Template Support

Components created with `@overlays/vue` can be used not only with imperative methods, but also in `<template>`.

To use a component created with `@overlays/vue`, it can be used not only with imperative methods, but also in `<template>`.

> Components that support `<template>` usage also support callback invocation without affecting each other's functionality. This is an optional feature.

### Step 1: Define Component

To use it in `<template>`, `modal` and `event` must be explicitly defined.

```vue
<!-- overlay.vue -->
<script setup>
import { defineEmits, defineProps } from 'vue-demi'
import { useOverlayMeta } from '@overlays/vue'
const props = defineProps({
  title: String,
  // To use in Template, you need to define the field used by v-model (default corresponds to visible)
  visible: Boolean
})

// Define event types used in the component (default: reject, resolve)
defineEmits(['reject', 'resolve'])

const { visible, resolve, reject } = useOverlayMeta({
  // If using template rendering, animation can be omitted
  // animation: 1000,
})
</script>
```

If you want to replace them with other fields and event names, you can pass in the corresponding configuration through `useOverlayMeta`.

```vue
<!-- overlay.vue -->
<script setup>
import { defineEmits, defineProps } from 'vue-demi'
import { useOverlayMeta } from '@overlays/vue'
const props = defineProps({
  title: String,
  modalValue: Boolean
})

defineEmits(['nook', 'ok'])

const { visible, resolve, reject } = useOverlayMeta({
  event: { resolve: 'ok', reject: 'nook' },
  modal: 'modalValue',
})
</script>

<template>
  ...
</template>
```

### Step 2: In Template

After defining modal and event, the popup component can be used in the `<template>`.

```vue
<!-- overlay.vue -->
<script setup>
import OverlayComponent from './overlay.vue'
const visible = ref(false)

const resolve = () => {
  // ...
}
const reject = () => {
  // ...
}
</script>

<template>
  <OverlayComponent
    v-model:visible="visible"
    @resolve="resolve"
    @reject="reject"
  />
</template>
```