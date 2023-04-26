# Getting Started

> Unoverlays only supports Vue3 | Vue2 Composition-api

## Install

With pnpm: 
```sh
pnpm add @unoverlays/vue
```

With yarn:
```sh
yarn add @unoverlays/vue
```

## Global

You can register Unoverlays globally, which will inherit the application context for all popups.

```ts
// main.js
import Vue from 'vue'
import unoverlay from '@unoverlays/vue'

const app = new Vue({})
app.use(unoverlay)
```

## Usage



### Step 1: Define Component

Unoverlays is suitable for most components. Using useOverlayMeta can provide finer control over the component process.

```vue
<!-- overlay.vue -->
<script>
import { useOverlayMeta } from '@unoverlays/vue-v2'
export default {
  mixins: [useOverlayMeta({ animation: 1000 })],
  methods: {
    onClick() {
      // use this.$visible
      // use this.$resolve or this.$reject
    }
  }
}
</script>

<template>
  <div v-if="visible" @click="resolve(`${title}:confirmed`)">
    {{ title }}
  </div>
</template>
```

### Step 2: Create Overlay

You can use the `defineOverlay` method to convert the component into a modal dialog in Javascript / Typescript, which allows you to call it.

```ts
import { defineOverlay } from '@unoverlays/vue'
import OverlayComponent from './overlay.vue'

// Convert to imperative callback
const callback = defineOverlay(OverlayComponent)
// Call the component and get the value of the resolve callback
const value = await callback({ title: 'callbackOverlay' })
// value === "callbackOverlay:confirmed"
```

You can also use `renderOverlay` to directly call the component and skip the `defineOverlay` method.

```ts
import { renderOverlay } from '@unoverlays/vue'
import OverlayComponent from './overlay.vue'

const value = await renderOverlay(OverlayComponent, {
  props: { title: 'useOverlay' }
})
// value === "useOverlay:confirmed"
```