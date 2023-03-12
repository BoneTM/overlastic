import type { Ref } from 'vue-demi'
import { getCurrentInstance, inject, onMounted, provide, watch } from 'vue-demi'
import { useVModel } from '@vueuse/core'
import { delay, noop } from '@unoverlays/utils'
import { OverlayMetaKey } from '../internal'

export interface OverlayOptions {
  /** animation duration to avoid premature destruction of components */
  animation?: number
  /** whether to set visible to true immediately */
  immediate?: boolean
  /**
   * v-model fields used by template
   *
   * @default 'visible'
   */
  model?: string

  /**
   * template use event name
   */
  event?: {
    /**
   * cancel event name used by the template
   *
   * @default 'cancel'
   */
    cancel?: string
    /**
   * confirm event name used by the template
   *
   * @default 'confirm'
   */
    confirm?: string
  }
  /**
   * whether to automatically handle components based on visible and animation
   *
   * @default true
   */
  automatic?: boolean
}

export interface OverlayMeta {
  /** the notification cancel, modify visible, and destroy it after the animation ends */
  cancel: Function
  /** the notification confirm, modify visible, and destroy it after the animation ends */
  confirm: Function
  /** destroy the current instance (immediately) */
  vanish: Function
  /** visible control popup display and hide */
  visible: Ref<boolean>
  /** use in template */
  isTemplate?: boolean
}

/**
 * get overlay layer meta information
 * @function cancel  the notification cancel, modify visible, and destroy it after the animation ends
 * @function confirm the notification confirm, modify visible, and destroy it after the animation ends
 * @function vanish destroy the current instance (immediately)
 * @field visible control popup display and hide
 * @returns
 */
export function useOverlayMeta(options: OverlayOptions = {}) {
  const { animation = 0, immediate = true, model = 'visible', automatic = true } = options
  const meta = inject(OverlayMetaKey, useTemplateMeta(model, options))

  // The component directly obtains the default value
  // vanish will have no effect, and no watch will be performed.
  if (!meta.isTemplate && automatic) {
    watch(meta.visible, async () => {
      if (meta.visible.value)
        return
      if (animation > 0)
        await delay(animation)
      meta.vanish?.()
    })
  }

  if (!meta.isTemplate && immediate)
    onMounted(() => meta.visible.value = true)

  provide(OverlayMetaKey, null)
  return meta
}

export function useTemplateMeta(model: string, options: OverlayOptions = {}) {
  const instance = getCurrentInstance()
  const events = options.event || {}

  if (!instance)
    throw new Error('Please use useOverlayMeta in component setup')

  const visible = useVModel(instance.props, model, instance.emit, { passive: true }) as Ref<boolean>

  const cancel = (value?: any) => {
    visible.value = false
    instance?.emit(events.cancel || 'cancel', value)
  }
  const confirm = (value?: any) => {
    visible.value = false
    instance?.emit(events.confirm || 'confirm', value)
  }
  return {
    cancel,
    confirm,
    vanish: noop,
    visible,
    isTemplate: true,
  }
}