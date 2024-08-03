import './src/observer/index'

import { SENDID } from './src/common'
import { initBase } from './src/lib/base'
import { initError, parseError } from './src/lib/err'
import { initEvent } from './src/lib/event'
import * as exportMethods from './src/lib/exportMethods'
import { initHttp } from './src/lib/http'
import { initIntersection } from './src/lib/intersectionObserver'
import { initLineStatus } from './src/lib/line-status'
import { initOptions, options as _options } from './src/lib/options'
import { initPerformance } from './src/lib/performance'
import { initPv } from './src/lib/pv'
import { initRecordScreen } from './src/lib/recordscreen'
import { initReplace } from './src/lib/replace'
import { initSendData } from './src/lib/sendData'
import type { InitOptions } from './src/types'
import { logError } from './src/utils/debug'
import { _global } from './src/utils/global'

function init(options: InitOptions): void {
  if (_global.__webTracingInit__) return
  if (!initOptions(options)) return

  // 注册全局
  initReplace()
  initBase()
  initSendData()
  initLineStatus()

  // 注册各个业务
  initError()
  initEvent()
  initHttp()
  initPerformance()
  initPv()
  initIntersection()
  initRecordScreen()

  _global.__webTracingInit__ = true
}

export {
  exportMethods,
  init,
  InitOptions,
  logError,
  _options as options,
  parseError,
  SENDID,
}
export * from './src/lib/exportMethods'
export default { init, ...exportMethods, options: _options }
