import type { InitOptions } from '@catpawx/web-tracing-core'
import { init } from '@catpawx/web-tracing-core'

function install(app: any, options: InitOptions) {
  init(options)
}

export default { install }
export * from '@catpawx/web-tracing-core'
