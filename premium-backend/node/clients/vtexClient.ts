/* eslint-disable prettier/prettier */
import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export default class Vtex extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      retries: 2,
    })
  }

  public getSkuAndContext(account: string, referenceId: string) {
    return this.http.get(
      `http://${account}.vtexcommercestable.com.br/api/catalog_system/pub/products/search?fq=alternateIds_RefId:${referenceId}`,
      {
        metric: 'getSkuAndContext',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    )
  }

  public getProductBySku(account: string, skuId: string) {
    return this.http.get(
      `http://${account}.vtexcommercestable.com.br/api/catalog_system/pub/products/search?fq=skuId:${skuId}`,
      {
        metric: 'getProductBySku',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    )
  }

  public getOrderForm(account: string, orderFormId: string) {
    return this.http.get(
      `http://${account}.vtexcommercestable.com.br/api/checkout/pub/orderForm/${orderFormId}`,
      {
        metric: 'getOrderForm',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
  }

  public getOrderFormConfiguration(
    account: string,
    appKey: string,
    appToken: string
  ) {
    return this.http.get(
      `http://${account}.vtexcommercestable.com.br/api/checkout/pvt/configuration/orderForm`,
      {
        metric: 'getOrderFormConfiguration',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-VTEX-API-AppKey': appKey,
          'X-VTEX-API-AppToken': appToken,
        },
      }
    )
  }

  // eslint-disable-next-line max-params
  public postOrderFormConfigurationPriceManual(
    account: string,
    appKey: string,
    appToken: string,
    orderFormConfiguration: any
  ) {
    return this.http.post(
      `http://${account}.vtexcommercestable.com.br/api/checkout/pvt/configuration/orderForm`,
      JSON.stringify(orderFormConfiguration),
      {
        metric: 'postOrderFormConfigurationPriceManual',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-VTEX-API-AppKey': appKey,
          'X-VTEX-API-AppToken': appToken,
        },
      }
    )
  }

  // eslint-disable-next-line max-params
  public putPrice(
    account: string,
    appKey: string,
    appToken: string,
    orderFormId: string,
    itemIndex: string,
    priceManual: any
  ) {
    return this.http.put(
      `http://${account}.vtexcommercestable.com.br/api/checkout/pub/orderForm/${orderFormId}/items/${itemIndex}/price`,
      JSON.stringify({ price: priceManual }),
      {
        metric: 'putPrice',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-VTEX-API-AppKey': appKey,
          'X-VTEX-API-AppToken': appToken,
        },
      }
    )
  }

  // eslint-disable-next-line max-params
  public postMarketingData(
    account: string,
    appKey: string,
    appToken: string,
    orderFormId: string,
    marketingData: any
  ) {
    return this.http.post(
      `http://${account}.vtexcommercestable.com.br/api/checkout/pub/orderForm/${orderFormId}/attachments/marketingData`,
      JSON.stringify(marketingData),
      {
        metric: 'postMarketingData',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-VTEX-API-AppKey': appKey,
          'X-VTEX-API-AppToken': appToken,
        },
      }
    )
  }

  // eslint-disable-next-line max-params
  public getCollectionDataByName(
    account: string,
    appKey: string,
    appToken: string,
    collectionName: string,
    page: number
  ) {
    return this.http.get(
      `http://${account}.vtexcommercestable.com.br/api/catalog_system/pvt/collection/search/${encodeURI(
        collectionName
      )}?pageSize=50&page=${page}`,
      {
        metric: 'getCollectionDataByName',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-VTEX-API-AppKey': appKey,
          'X-VTEX-API-AppToken': appToken,
        },
      }
    )
  }

  // eslint-disable-next-line max-params
  public getCollectionProducts(
    account: string,
    appKey: string,
    appToken: string,
    collectionId: string,
    page: number
  ) {
    return this.http.get(
      `http://${account}.vtexcommercestable.com.br/api/catalog/pvt/collection/${collectionId}/products?pageSize=50&page=${page}`,
      {
        metric: 'getCollectionProducts',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-VTEX-API-AppKey': appKey,
          'X-VTEX-API-AppToken': appToken,
        },
      }
    )
  }

  // eslint-disable-next-line max-params
  public deleteCollection(
    account: string,
    appKey: string,
    appToken: string,
    collectionId: string
  ) {
    return this.http.delete(
      `http://${account}.vtexcommercestable.com.br/api/catalog/pvt/collection/${collectionId}`,
      {
        metric: 'deleteCollection',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-VTEX-API-AppKey': appKey,
          'X-VTEX-API-AppToken': appToken,
        },
      }
    )
  }

  // eslint-disable-next-line max-params
  public createCollection(
    account: string,
    appKey: string,
    appToken: string,
    data: any
  ) {
    return this.http.post(
      `http://${account}.vtexcommercestable.com.br/api/catalog/pvt/collection/`,
      JSON.stringify(data),
      {
        metric: 'createCollection',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-VTEX-API-AppKey': appKey,
          'X-VTEX-API-AppToken': appToken,
        },
      }
    )
  }

  // eslint-disable-next-line max-params
  public createSubCollection(
    account: string,
    appKey: string,
    appToken: string,
    data: any
  ) {
    return this.http.post(
      `http://${account}.vtexcommercestable.com.br/api/catalog/pvt/subcollection/`,
      JSON.stringify(data),
      {
        metric: 'createSubCollection',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-VTEX-API-AppKey': appKey,
          'X-VTEX-API-AppToken': appToken,
        },
      }
    )
  }

  // eslint-disable-next-line max-params
  public getSubcollectionByCollectionId(
    account: string,
    appKey: string,
    appToken: string,
    collectionId: string
  ) {
    return this.http.get(
      `http://${account}.vtexcommercestable.com.br/api/catalog/pvt/collection/${collectionId}/subcollection`,
      {
        metric: 'getSubcollectionByCollectionId',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-VTEX-API-AppKey': appKey,
          'X-VTEX-API-AppToken': appToken,
        },
      }
    )
  }

  // eslint-disable-next-line max-params
  public postAddProductsToSubCollection(
    account: string,
    appKey: string,
    appToken: string,
    subCollectionId: string,
    skuId: any
  ) {
    return this.http.post(
      `http://${account}.vtexcommercestable.com.br/api/catalog/pvt/subcollection/${subCollectionId}/stockkeepingunit`,
      { SkuId: skuId },
      {
        metric: 'postAddProductsToSubCollection',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-VTEX-API-AppKey': appKey,
          'X-VTEX-API-AppToken': appToken,
        },
      }
    )
  }

  // eslint-disable-next-line max-params
  public postRemoveProductsFromSubCollection(
    account: string,
    appKey: string,
    appToken: string,
    subCollectionId: string,
    skuId: any
  ) {
    return this.http.delete(
      `http://${account}.vtexcommercestable.com.br/api/catalog/pvt/subcollection/${subCollectionId}/stockkeepingunit/${skuId}`,
      {
        metric: 'postRemoveProductsFromSubCollection',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-VTEX-API-AppKey': appKey,
          'X-VTEX-API-AppToken': appToken,
        },
      }
    )
  }
}
