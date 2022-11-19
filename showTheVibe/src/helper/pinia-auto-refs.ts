// "https://github.com/Allen-1998/pinia-auto-refs"
import { AutoToRefs, ToRef } from 'vue'

import attentionStore from '@/store/attention'
import canteenStore from '@/store/canteen'
import collectStore from '@/store/collect'
import homepageStore from '@/store/homepage'
import noteStore from '@/store/note'
import orderStore from '@/store/order'
import userStore from '@/store/user'

declare module 'vue' {
  export type AutoToRefs<T> = {
    [K in keyof T]: T[K] extends Function ? T[K] : ToRef<T[K]>
  }
}

const storeExports = {
  attention: attentionStore,
  canteen: canteenStore,
  collect: collectStore,
  homepage: homepageStore,
  note: noteStore,
  order: orderStore,
  user: userStore,
}

export function useStore<T extends keyof typeof storeExports>(storeName: T) {
  const store = storeExports[storeName]()
  const storeRefs = storeToRefs(store)
  return { ...store, ...storeRefs } as unknown as AutoToRefs<ReturnType<typeof storeExports[T]>>
}
