export const createCollection = async (
  Vtex: any,
  collectionsToCreate: any,
  account: string,
  appKey: string,
  appToken: string,
  storeId: any
) => {
  try {
    const createdCollections = []

    for await (const collection of collectionsToCreate) {
      const data = {
        Name: `Propz-${storeId} - ${collection.partnerPromotionId} - ${collection.name}`,
        Description: `Coleção criada automaticamente pelo app Propz Backend (Propz Service)`,
        Searchable: false,
        Highlight: false,
        DateFrom: collection.startDate,
        // "DateTo": collection.endDate,
        DateTo: '2070-12-31T03:00:00.000Z',
      }

      const response = await Vtex.createCollection(
        account,
        appKey,
        appToken,
        data
      )

      const subCollectionData = {
        CollectionId: response.Id,
        Name: `Propz-${storeId} - ${collection.partnerPromotionId} - ${collection.name}`,
        Description: `Sub-coleção criada automaticamente pelo app Propz Backend (Propz Service)`,
        Type: 'Inclusive',
        PreSale: false,
        Release: false,
      }

      const subCollectionResponse = await Vtex.createSubCollection(
        account,
        appKey,
        appToken,
        subCollectionData
      )

      const referenceIds = collection.properties.PRODUCT_ID_INCLUSION.split(',')

      const getPromotionProducts = await Promise.all(
        referenceIds.map((referenceId: string) =>
          Vtex.getSkuAndContext(account, referenceId)
        )
      )

      const productsImported = []

      for await (const product of getPromotionProducts) {
        const productAny = product as any

        if (productAny?.[0]?.items?.[0]) {
          const responseProducts = await Vtex.postAddProductsToSubCollection(
            account,
            appKey,
            appToken,
            subCollectionResponse.Id,
            productAny[0].items[0].itemId
          )

          productsImported.push(responseProducts)
        }
      }

      createdCollections.push({
        ...response,
        subCollectionId: subCollectionResponse.Id,
        products: productsImported,
      })
    }

    return createdCollections
  } catch (error) {
    console.error(error)

    return error
  }
}
