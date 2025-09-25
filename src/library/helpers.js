import { watch } from 'vue'

/**
 * Call callback when the ref has a value (first non-null/undefined)
 * Only triggers once
 */
export function whenReady(refValue, callback) {
  const stop = watch(
    refValue,
    val => {
      if (val !== null && val !== undefined) {
        stop()
        callback(val)
      }
    },
    { immediate: true, flush: 'sync' }
  )
}

export function waitReady(refValue) {
  return new Promise(resolve => whenReady(refValue, resolve))
}
