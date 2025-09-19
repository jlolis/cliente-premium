// node/index.ts
// eslint-disable-next-line prettier/prettier
import type {
  ServiceContext,
  ParamsContext,
  RecorderState} from '@vtex/api';
import {
  LRUCache,
  Service,
  method,
} from '@vtex/api'

import { Clients } from './clients'
import {
  postPricePDP,
  getPromotion,
  postRegisterPurchase,
  postVerifyPurchase,
  postBuildCollection
} from './handlers/propz'

// import { updateLiveUsers } from './event/liveUsersUpdate'

// Create a LRU memory cache for the Status client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
const memoryCache = new LRUCache<string, any>({ max: 10000 })

metrics.trackCache('status', memoryCache)

const TREE_SECONDS_MS = 3 * 1000
const CONCURRENCY = 10

declare global {
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {
    code: number
  }
}

export default new Service<Clients, State, ParamsContext>({
  clients: {
    implementation: Clients,
    options: {
      default: {
        retries: 2,
        timeout: 90000,
      },
      events: {
        exponentialTimeoutCoefficient: 2,
        exponentialBackoffCoefficient: 2,
        initialBackoffDelay: 50,
        retries: 1,
        timeout: TREE_SECONDS_MS,
        concurrency: CONCURRENCY,
      },
    },
  },
  routes: {
    /**
     * body:
     *   {
     *       "document":"45100809809",
     *       "showcase": "true"
     *   }
     */
    getPromotion: method({
      GET: [getPromotion],
    }),

    postPricePDP: method({
      POST: [postPricePDP]
    }),
    
    postRegisterPurchase: method({
      "POST": [postRegisterPurchase]
    }),

    postVerifyPurchase: method({
      "POST": [postVerifyPurchase]
    }),

    postBuildCollection: method({
      "POST": [postBuildCollection]
    })
  },
})
