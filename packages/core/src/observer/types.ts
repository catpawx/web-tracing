export interface ObserverValue<T> {
  value: T
}

export type AnyFun = {
  (...args: any[]): any
}

export type VoidFun<T> = {
  (...args: T[]): void
}

export type Options = {
  computed?: boolean
  watch?: boolean
  callback?: AnyFun
}

export type Proxy = {
  value: any
  dirty: boolean
}
