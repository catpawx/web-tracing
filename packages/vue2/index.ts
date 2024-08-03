import type { InitOptions } from '@catpawx/web-tracing-core'
import {
  init,
  logError,
  parseError,
  SENDID,
  traceError,
} from '@catpawx/web-tracing-core'

function install(Vue: any, options: InitOptions) {
  const handler = Vue.config.errorHandler
  Vue.config.errorHandler = function (err: Error, vm: any, info: string): void {
    // const match = err.stack!.match(/(?<=http:\/\/.*:\d+\/).*:\d+:\d+/)
    // const position = match ? match[0] : ''
    // const line = position.split(':')[1] // 行
    // const col = position.split(':')[2] // 列
    // traceError({
    //   eventId: err.name,
    //   errMessage: err.message,
    //   line,
    //   col
    // })

    logError(err)
    const errorInfo = { eventId: SENDID.CODE, ...parseError(err) }
    traceError(errorInfo)
    // eslint-disable-next-line no-useless-call
    if (handler) handler.apply(null, [err, vm, info])
  }
  init(options)
}

export default { install }
export * from '@catpawx/web-tracing-core'
