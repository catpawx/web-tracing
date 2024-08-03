import { isRef } from './ref'
import type { AnyFun, ObserverValue, VoidFun } from './types'
import { Watcher } from './watcher'

function watchInit(callback: AnyFun, getter: AnyFun) {
  // eslint-disable-next-line no-new
  new Watcher('', { watch: true, callback }, getter)
}

export function watch<T>(target: ObserverValue<T>, fun: VoidFun<T>) {
  if (!isRef(target)) return
  watchInit(
    (newValue: T, oldValue: T) => {
      fun(newValue, oldValue)
    },
    function () {
      return target.value
    },
  )
}
