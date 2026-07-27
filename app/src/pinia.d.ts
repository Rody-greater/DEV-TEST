import 'pinia'

declare module 'pinia' {
  // Allow the custom `persist` flag consumed by our persistPlugin.
  export interface DefineStoreOptionsBase<S, Store> {
    persist?: boolean
  }
}
