# Getting Started

> Unoverlay Vue is generated with Vue's Composition api, so it only supports Vue3 | Vue2 Composition-api

You can install `Unoverlay Vue` by opening your terminal in your project and running the following command:

## Install

With pnpm: 
```sh
pnpm add unoverlay-vue
```

With yarn:
```sh
yarn add unoverlay-vue
```

## Global

You can register Unoverlay Vue globally, it will inherit the application context for all popup layers, of course, it is optional, everything is up to you.

```ts
// main.js
import { createApp } from 'vue'
import unoverlay from 'unoverlay-vue'

const app = createApp({})
app.use(unoverlay)
```

## Usage

You can use your imagination boldly!

### Step.1: Define Component

Unoverlay Vue is suitable for most components, using `useOverlayMeta` can have more fine-grained control over component flow.

```vue
<!-- overlay.vue -->
<script setup>
import { defineEmits, defineProps } from 'vue'
import { useOverlayMeta } from 'unoverlay-vue'
const props = defineProps({
  title: String,
  // If you want to use it as a component in template,
  // you need to define visible in props
  visible: Boolean
})

// Define the events used in the component(optional)
// This allows you to use hints in components
defineEmits(['cancel', 'confirm'])

// Get Overlay information from useOverlayMeta
const { visible, confirm, cancel } = useOverlayMeta({
  // Animation duration to avoid premature destruction of components
  // Only use component in template and no need to define
  animation: 1000
})
</script>

<template>
  <div v-if="visible" @click="confirm(`${title}:confirmed`)">
    {{ title }}
  </div>
</template>
```

### Step.2-1: Create Overlay

You can convert a component into a modal with the `createOverlay` method, which allows you to call in `Javascript` / `Typescript`

```ts
import { createOverlay } from 'unoverlay-vue'
import OverlayComponent from './overlay.vue'

// Convert to imperative overlay
const callback = createOverlay(OverlayComponent)
// Call the component and get the value of confirm
const value = await callback({ title: 'callbackOverlay' })
// value === "callbackOverlay:confirmed"
```

You can also invoke the component directly via `renderOverlay`, skipping the `createOverlay` method.

```ts
import { renderOverlay } from 'unoverlay-vue'
import OverlayComponent from './overlay.vue'

const value = await renderOverlay(OverlayComponent, {
  props: { title: 'useOverlay' }
})
// value === "useOverlay:confirmed"
```

### Step.2-2: In Template

You can still use components in template and enjoy the advantages brought by template.

```vue
<!-- overlay.vue -->
<script setup>
import OverlayComponent from './overlay.vue'
const visible = ref(false)

const confirm = () => {
  // ...
}
const cancel = () => {
  // ...
}
</script>

<template>
  <overlay-component
    v-model:visible="visible"
    @confirm="confirm"
    @cancel="cancel"
  />
</template>
```