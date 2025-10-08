/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { json } from 'co-body'

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { finalPricePropz } from '../utils/finalPricePropz'
import type { Items } from '../types/Items'
import { getVerifyPurchase } from '../utils/getVerifyPurchase'
import { formatPrice } from '../utils/formatPriceVtex'
// import { AxiosError } from 'axios'
import { spendAndGetMarketingData } from '../utils/spendAndGetMarketingData'
import { createCollection } from '../utils/collection/createCollection'
import { getPromotions } from '../utils/collection/getPromotions'
import {
  isPremium,
  isPremiumCpf,
  updateIsPremiumCpf,
  createNewPremium,
} from '../utils/collection/isPremium'
import { getCollections } from '../utils/collection/getCollections'
import { getProducts } from '../utils/collection/getProducts'
import { updateCollections } from '../utils/collection/updateCollection'

const getAppId = (): string => {
  return process.env.VTEX_APP_ID ?? ''
}

export async function getPromotion(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { Propz, Vtex, apps },
    vtex: { account },
  } = ctx

  const app = getAppId()
  const {
    domain,
    token,
    username,
    password,
    typePromotion,
    appKey,
    appToken,
    storeId,
  } = await apps.getAppSettings(app)

  const { query } = ctx.request

  const validation = await Propz.checkFields([
    domain,
    token,
    username,
    password,
    typePromotion,
    storeId,
  ])

  const err = {
    success: false,
    message: 'fill in all fields within the admin',
  }

  if (!validation) {
    ctx.status = 400
    ctx.body = err
  }

  try {
    // const processIdentifiers = async (productRefIds: string) => {
    //   if (productRefIds) {
    //     const PRODUCTS_IDS_INCLUSIONS = productRefIds.split(',')
    //     console.log({PRODUCTS_IDS_INCLUSIONS});

    //     for await (const productRefId of PRODUCTS_IDS_INCLUSIONS) {
    //       const [vtexData] = await Vtex.getSkuAndContext(account, productRefId)

    //       // console.log('processIdentifiers > productRefId > ', productRefId, !!vtexData );

    //       if (vtexData) {
    //         const isAvailableQuantity =
    //           vtexData &&
    //           vtexData.items[0].sellers[0].commertialOffer.AvailableQuantity > 0

    //         const productRefVtex = vtexData?.items[0].referenceId[0].Value

    //         if (productRefVtex === productRefId && isAvailableQuantity) {
    //           return vtexData
    //         }
    //       }
    //     }
    //   }
    // }

    const processReferences = async (productRefIds: string) => {
      if (productRefIds) {
        const PRODUCTS_IDS_INCLUSIONS = productRefIds.split(',')
        // console.log({PRODUCTS_IDS_INCLUSIONS});

        const productsResponse = await Promise.all(
          PRODUCTS_IDS_INCLUSIONS.map(async (productRefId: string) => {
            const [vtexData] = await Vtex.getSkuAndContext(
              account,
              productRefId
            )

            return vtexData
          })
        )

        const products = productsResponse.filter((product: any) => {
          const isAvailableQuantity =
            product &&
            product.items[0].sellers[0].commertialOffer.AvailableQuantity > 0

          return product !== undefined && isAvailableQuantity
        })

        // console.log({products});

        return products
      }

      return []
    }

    const processPromotionData = async (response: any) => {
      const promotionFilteredOfTypePromotion: Items[] =
        typePromotion === 'PERSONALIZED'
          ? response.items.filter(
              (item: { promotion: { promotionType: string } }) =>
                item.promotion.promotionType === typePromotion
            )
          : response.items

      // console.log({promotionFilteredOfTypePromotion});

      const promisePromotions = []

      for await (const propzItem of promotionFilteredOfTypePromotion) {
        // console.log(propzItem.promotion.properties.PRODUCT_ID_INCLUSION);

        try {
          if (
            propzItem.active &&
            propzItem.promotion.active &&
            propzItem.promotion.requiresIdentification
          ) {
            const vtexDataArray = await processReferences(
              propzItem.promotion.properties.PRODUCT_ID_INCLUSION
            )
            // const vtexData = await processIdentifiers(
            //   propzItem.promotion.properties.PRODUCT_ID_INCLUSION
            // )

            const arrayData = await vtexDataArray.map(async (vtexData: any) => {
              if (vtexData) {
                const { Price, ListPrice, Installments } =
                  vtexData.items[0].sellers[0].commertialOffer

                const clusterHighlights =
                  Object.keys(vtexData.clusterHighlights).length > 0
                    ? vtexData.clusterHighlights
                    : []

                // console.log(vtexData)
                const priceFinal = Number(
                  (
                    finalPricePropz(propzItem?.promotion, ListPrice) ||
                    ListPrice
                  ).toFixed(2)
                )

                const installmentsFinal = Installments.map((item: any) => {
                  return {
                    ...item,
                    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                    TotalValuePlusInterestRate: priceFinal + item.InterestRate,
                    Value:
                      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                      (priceFinal + item.InterestRate) /
                      item.NumberOfInstallments,
                  }
                })

                const data = {
                  promotionMaxPerCustomer: {
                    pricePropz: {
                      sellingPrice: priceFinal,
                      listPrice: ListPrice,
                    },
                    priceVtex: {
                      sellingPrice: Price,
                      listPrice: ListPrice,
                    },
                    maxItems:
                      propzItem.remainingMaxPerCustomer > 0
                        ? propzItem.remainingMaxPerCustomer
                        : 'full-promotion',
                    product: vtexData.items[0].referenceId[0].Value,
                    typeMechanic: propzItem.promotion.mechanic,
                    quantityFlag: propzItem.promotion.minQuantity,
                  },
                  product: {
                    productId: vtexData.productId,
                    description: vtexData.description,
                    productName: vtexData.productName,
                    productReference: vtexData.productReference,
                    linkText: vtexData.linkText,
                    brand: vtexData.brand,
                    brandId: vtexData.brandId,
                    link: vtexData.link,
                    categories: vtexData.categories,
                    categoryId: vtexData.categoryId,
                    priceRange: {
                      sellingPrice: {
                        highPrice: priceFinal,
                        lowPrice: priceFinal,
                        __typename: 'PriceRange',
                      },
                      listPrice: {
                        highPrice: ListPrice,
                        lowPrice: ListPrice,
                        __typename: 'PriceRange',
                      },
                      __typename: 'ProductPriceRange',
                    },
                    productClusters: vtexData.productClusters,
                    clusterHighlights,
                    skuSpecifications: [],
                    specificationGroups: [],
                    __typename: 'Product',
                    items: [
                      {
                        ...vtexData.items[0],
                        sellers: [
                          {
                            ...vtexData.items[0].sellers[0],
                            commertialOffer: {
                              ...vtexData.items[0].sellers[0].commertialOffer,
                              Installments: installmentsFinal,
                              ListPrice,
                              PriceWithoutDiscount: ListPrice,
                              FullSellingPrice: ListPrice,
                              Price: priceFinal,
                              spotPrice:
                                priceFinal < ListPrice ? priceFinal : ListPrice,
                            },
                          },
                        ],
                      },
                    ],
                    rule: null,
                    sku: {
                      ...vtexData.items[0],
                      sellers: [
                        {
                          ...vtexData.items[0].sellers[0],
                          commertialOffer: {
                            ...vtexData.items[0].sellers[0].commertialOffer,
                            ListPrice,
                            PriceWithoutDiscount: ListPrice,
                            FullSellingPrice: ListPrice,
                            Price: priceFinal,
                            spotPrice:
                              priceFinal < ListPrice ? priceFinal : ListPrice,
                          },
                        },
                      ],
                      variations: [],
                    },
                  },
                }

                return data
              }

              return null
            })

            if (arrayData.length > 0) {
              promisePromotions.push(...arrayData)
            }
          }
        } catch (error) {
          return null
        }
      }

      const promotions = await Promise.all(promisePromotions)

      const promotionReduced: any = promotions.reduce(
        (acc: any, promotion: any) => {
          // console.log({promotion});

          if (promotion) {
            acc.promotionMaxPerCustomer.push(promotion.promotionMaxPerCustomer)
            acc.products.push(promotion.product)
          }

          return acc
        },
        {
          promotionMaxPerCustomer: [],
          products: [],
        }
      )

      return promotionReduced
    }

    const responsePromotionPropz = await Propz.getPromotionShowCase(
      domain,
      token,
      query.document,
      username,
      password,
      storeId
    )

    const collections = []

    if (query.showcase && query.showcase === 'true') {
      try {
        let pageCollections = 1

        let hasNextCollectionPage = true

        do {
          // eslint-disable-next-line no-await-in-loop
          const response = await Vtex.getCollectionDataByName(
            account,
            appKey,
            appToken,
            `Propz-${storeId}`,
            pageCollections
          )

          collections.push(...response.items)
          pageCollections++
          hasNextCollectionPage = response?.items?.length > 0
        } while (hasNextCollectionPage)
      } catch (error) {
        console.error(error)
      }
    }

    // console.log({collections});

    const data = await processPromotionData(responsePromotionPropz)

    ctx.status = 200
    ctx.body =
      query.showcase && query.showcase === 'true'
        ? { ...data, showcase: responsePromotionPropz, collections }
        : data
  } catch (error) {
    ctx.status = 400
    ctx.body = error
  }

  ctx.set('cache-control', 'no-cache')
  await next()
}

export async function getIsPremium(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { Propz },
  } = ctx

  const { clientId } = ctx.query

  const { query } = ctx.request

  try {
    const data = await isPremium(Propz, clientId)

    ctx.status = 200
    ctx.body = query.showcase && query.showcase === 'true' ? data : data

    console.log('É premium? ', ctx.body)
  } catch (error) {
    ctx.status = 400
    ctx.body = error
  }

  ctx.set('cache-control', 'no-cache')
  await next()
}

export async function getIsPremiumCpf(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { Propz },
  } = ctx

  const { clientId } = ctx.query

  const { query } = ctx.request

  try {
    const data = await isPremiumCpf(Propz, clientId)

    ctx.status = 200
    ctx.body = query.showcase && query.showcase === 'true' ? data : data

    console.log('É premium? ', ctx.body)
  } catch (error) {
    ctx.status = 400
    ctx.body = error
  }

  ctx.set('cache-control', 'no-cache')
  await next()
}

export async function setUpdateIsPremiumCpf(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { Propz },
  } = ctx

  const { clientId } = ctx.query

  const { query } = ctx.request

  try {
    const data = await updateIsPremiumCpf(Propz, clientId)

    ctx.status = 200
    ctx.body = query.showcase && query.showcase === 'true' ? data : data

    console.log('Atualizou ', ctx.body)
  } catch (error) {
    ctx.status = 400
    ctx.body = error
  }

  ctx.set('cache-control', 'no-cache')
  await next()
}

export async function postCreateNewPremium(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { Propz },
  } = ctx

  const { dadosnovocliente } = ctx.query

  const { query } = ctx.request

  try {
    const data = await createNewPremium(Propz, dadosnovocliente)

    ctx.status = 200
    ctx.body = query.showcase && query.showcase === 'true' ? data : data

    console.log('Cadastrou ', ctx.body)
  } catch (error) {
    ctx.status = 400
    ctx.body = error
  }

  ctx.set('cache-control', 'no-cache')
  await next()
}

export async function postPricePDP(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { Propz, apps },
  } = ctx

  const app = getAppId()
  const { domain, token, username, password, typePromotion, storeId } =
    await apps.getAppSettings(app)

  const validation = await Propz.checkFields([
    domain,
    token,
    username,
    password,
    typePromotion,
  ])

  const err = {
    success: false,
    message: 'fill in all fields within the admin',
  }

  if (!validation) {
    ctx.status = 400
    ctx.body = err
  }

  const { document, product } = await json(ctx.req)

  const responsePromotionPropz = await Propz.getPromotionShowCase(
    domain,
    token,
    document,
    username,
    password,
    storeId
  )

  // console.log({ responsePromotionPropz: responsePromotionPropz.items })

  console.log(
    responsePromotionPropz.items.filter((item: any) =>
      ['1000101944', '1000610001'].includes(item.promotion.promotionId)
    )
  )

  const priceArray = responsePromotionPropz.items.reduce(
    (acc: any[], currerItem: any) => {
      const { PRODUCT_ID_INCLUSION } = currerItem.promotion.properties
      const tempValue = {
        sellingPrice: 0,
        listPrice: 0,
      }

      if (PRODUCT_ID_INCLUSION) {
        const PRODUCTS_IDS_INCLUSIONS = PRODUCT_ID_INCLUSION.split(',')

        PRODUCTS_IDS_INCLUSIONS.map((currentPromotion: any) => {
          if (currentPromotion === product.productReference) {
            const { ListPrice } = product.items[0].sellers[0].commertialOffer

            const priceFinal = Number(
              finalPricePropz(currerItem.promotion, ListPrice).toFixed(2)
            )

            tempValue.listPrice = ListPrice
            tempValue.sellingPrice = priceFinal
          }

          return currentPromotion
        })
      }

      if (tempValue.sellingPrice > 0) {
        return [...acc, tempValue]
      }

      return acc
    },
    []
  )

  const [price] = priceArray.sort(
    (a: { sellingPrice: number }, b: { sellingPrice: number }) =>
      a.sellingPrice - b.sellingPrice
  )

  const installmentsFinalArray = responsePromotionPropz.items.reduce(
    (acc: any[], currerItem: any) => {
      const { PRODUCT_ID_INCLUSION } = currerItem.promotion.properties
      let tempValue = null

      if (PRODUCT_ID_INCLUSION) {
        const PRODUCTS_IDS_INCLUSIONS = PRODUCT_ID_INCLUSION.split(',')

        PRODUCTS_IDS_INCLUSIONS.map((currentPromotion: any) => {
          if (currentPromotion === product.productReference) {
            const { Installments, ListPrice } =
              product.items[0].sellers[0].commertialOffer

            const priceFinal = Number(
              finalPricePropz(currerItem.promotion, ListPrice).toFixed(2)
            )

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            tempValue = Installments.map((item: any) => {
              const interestRate = Number(item.InterestRate)

              return {
                ...item,
                TotalValuePlusInterestRate: priceFinal + interestRate,
                Value: (priceFinal + interestRate) / item.NumberOfInstallments,
              }
            })
          }

          return currentPromotion
        })
      }

      if (tempValue) {
        return [...acc, tempValue]
      }

      return acc
    },
    []
  )

  // const [installmentsFinal] = installmentsFinalArray

  const [installmentsFinal] = installmentsFinalArray.sort((a: any, b: any) => {
    const aPIX = a.find((item: any) => item.PaymentSystemName === 'Pix')
    const bPIX = b.find((item: any) => item.PaymentSystemName === 'Pix')

    return aPIX.Value - bPIX.Value
  })

  const sellingPrice =
    price.sellingPrice > 0
      ? price.sellingPrice
      : product.priceRange.sellingPrice.highPrice

  const listPrice =
    price.listPrice > 0
      ? price.listPrice
      : product.priceRange.listPrice.highPrice

  ctx.body = {
    ...product,
    items: product.items.map((item: any) => {
      return {
        ...item,
        sellers: [
          {
            ...item.sellers[0],
            commertialOffer: {
              ...item.sellers[0].commertialOffer,
              Installments: installmentsFinal,
              ListPrice: listPrice,
              PriceWithoutDiscount: listPrice,
              FullSellingPrice: listPrice,
              Price: sellingPrice,
              spotPrice: sellingPrice < listPrice ? sellingPrice : listPrice,
            },
          },
        ],
      }
    }),
    priceRange: {
      sellingPrice: {
        highPrice: sellingPrice,
        lowPrice: sellingPrice,
        __typename: 'PriceRange',
      },
      listPrice: {
        highPrice: listPrice,
        lowPrice: listPrice,
        __typename: 'PriceRange',
      },
      __typename: 'ProductPriceRange',
    },
  }

  ctx.set('cache-control', 'no-cache')
  await next()
}

export async function postVerifyPurchase(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { Propz, Vtex, apps },
    vtex: { account },
  } = ctx

  const app: string = getAppId()
  const { domain, token, username, password, appKey, appToken, storeId } =
    await apps.getAppSettings(app)

  const validation = await Propz.checkFields([
    domain,
    token,
    username,
    password,
  ])

  const err = {
    success: false,
    message: 'fill in all fields within the admin',
  }

  if (!validation) {
    ctx.status = 400
    ctx.body = err
  }

  try {
    const { orderFormId, document, sessionId } = await json(ctx.req)

    try {
      const orderForm = await Vtex.getOrderForm(account, orderFormId)

      const verifyPurchase = getVerifyPurchase({
        orderForm,
        document,
        sessionId,
      })

      // ======= REMOVENDO MUDANÇA DO ALLOW MANUAL PRICE POR CAUSA DA PBM =======
      // const responseGetOrderFormConfiguration = await Vtex.getOrderFormConfiguration(
      //   account,
      //   appKey,
      //   appToken
      // )

      if (verifyPurchase.ticket.items.length > 0) {
        // try {
        //   await Vtex.postOrderFormConfigurationPriceManual(
        //     account,
        //     appKey,
        //     appToken,
        //     {
        //       ...responseGetOrderFormConfiguration,
        //       allowManualPrice: true,
        //     }
        //   )
        // } catch (error) {
        //   const err = error as AxiosError
        //   console.error(err.response?.data)
        // }

        try {
          const response: any = await Propz.postVerifyPurchase(
            domain,
            token,
            username,
            password,
            verifyPurchase
          )

          const appData = {
            domain,
            token,
            document,
            username,
            password,
            appKey,
            appToken,
            storeId,
          }

          await spendAndGetMarketingData(ctx, appData, response, orderForm)

          response.ticket.items.map(
            async (itemPropz: {
              discounts: Array<{ unitPriceWithDiscount: number }>
              itemId: string
            }) => {
              if (itemPropz.discounts.length > 0) {
                const price = Number(
                  itemPropz.discounts[0].unitPriceWithDiscount
                ).toFixed(2)

                const priceFormated = String(price).replace(/[^\d]+/, '')

                try {
                  await Vtex.putPrice(
                    account,
                    appKey,
                    appToken,
                    orderFormId,
                    itemPropz.itemId,
                    Number(priceFormated)
                  )
                } catch (error) {
                  return error
                }
              }

              return itemPropz
            }
          )

          const promotionPurchase = response.ticket.items.filter(
            (item: { discounts: [] }) => item.discounts.length > 0 && item
          )

          ctx.body = {
            response: {
              ...response,
              ticket: {
                ...response.ticket,
                amount: Number(formatPrice(response.ticket.amount)),
                items: promotionPurchase,
              },
            },
          }
        } catch (error) {
          ctx.body = error
        }

        // await Vtex.postOrderFormConfigurationPriceManual(
        //   account,
        //   appKey,
        //   appToken,
        //   {
        //     ...responseGetOrderFormConfiguration,
        //     allowManualPrice: false,
        //   }
        // )
      } else {
        ctx.body = {
          response: verifyPurchase,
        }
      }
    } catch (error) {
      console.error(error)
      ctx.body = error
    }
  } catch (error) {
    ctx.status = 400
    ctx.body = error
  }

  ctx.set('cache-control', 'no-cache')
  await next()
}

export async function postRegisterPurchase(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { Propz, apps },
  } = ctx

  const app: string = getAppId()
  const { domain, token, username, password } = await apps.getAppSettings(app)

  const validation = await Propz.checkFields([
    domain,
    token,
    username,
    password,
  ])

  const err = {
    success: false,
    message: 'fill in all fields within the admin',
  }

  if (!validation) {
    ctx.status = 400
    ctx.body = err

    return
  }

  try {
    const data = await json(ctx.req)

    const response = await Propz.postRegisterPurchase(
      domain,
      token,
      username,
      password,
      data
    )

    ctx.status = 200
    ctx.body = response
  } catch (error) {
    ctx.status = 400
    ctx.body = error
  }

  ctx.set('cache-control', 'no-cache')
  await next()
}

export async function postBuildCollection(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { Propz, Vtex, apps },
    vtex: { account },
  } = ctx

  const app: string = getAppId()
  const { domain, token, username, password, appKey, appToken, storeId } =
    await apps.getAppSettings(app)

  const validation = await Propz.checkFields([
    domain,
    token,
    username,
    password,
  ])

  const err = {
    success: false,
    message: 'fill in all fields within the admin',
  }

  if (!validation) {
    ctx.status = 400
    ctx.body = err
  }

  try {
    const promotions = await getPromotions(
      Propz,
      domain,
      token,
      username,
      password,
      storeId
    )

    const collections = await getCollections(
      Vtex,
      account,
      appKey,
      appToken,
      promotions,
      storeId
    )

    if (collections.error) {
      ctx.status = 400
      ctx.body = collections.error

      return
    }

    const {
      allCollections,
      mappedCollections,
      existingCollections,
      collectionsToDelete,
      collectionsToCreate,
      collectionsToUpdate,
    } = collections

    const productsByCollection = await getProducts(
      Vtex,
      account,
      appKey,
      appToken,
      mappedCollections,
      storeId
    )

    await updateCollections(
      Vtex,
      account,
      appKey,
      appToken,
      collectionsToUpdate,
      productsByCollection,
      promotions,
      storeId
    )

    const createdCollections = await createCollection(
      Vtex,
      collectionsToCreate,
      account,
      appKey,
      appToken,
      storeId
    )

    ctx.status = 200
    ctx.body = {
      promotions,
      allCollections,
      mappedCollections,
      existingCollections,
      collectionsToUpdate,
      collectionsToDelete,
      collectionsToCreate,
      createdCollections,
      productsByCollection,
    }
  } catch (error) {
    ctx.status = 400
    ctx.body = { error }
  }

  ctx.set('cache-control', 'no-cache')
  await next()
}
