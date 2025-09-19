export const updateCollections = async (
  Vtex: any,
  account: string,
  appKey: string,
  appToken: string,
  collectionsToUpdate: any,
  productsByCollection: any,
  promotions: any,
  storeId: any
) => {
  try {
    for await (const collection of collectionsToUpdate) {
      const promorionFound = promotions.find(
        (promotion: any) =>
          collection.name ===
          `Propz-${storeId} - ${promotion.partnerPromotionId} - ${promotion.name}`
      )

      const referenceIds =
        promorionFound.properties.PRODUCT_ID_INCLUSION.split(',')

      const productsToImport = await Promise.all(
        referenceIds.map((referenceId: string) =>
          Vtex.getSkuAndContext(account, referenceId)
        )
      )

      const productsOfCollection = productsByCollection.find(
        (prodCollection: { collectionId: any }) =>
          prodCollection.collectionId === collection.id
      )

      // console.log('productsToImport');
      // console.log(JSON.stringify(productsToImport));
      // console.log('productsOfCollection');
      // console.log(JSON.stringify(productsOfCollection));

      const productsToImportArray = productsToImport
        .map((product: any) => Number(product[0]?.items[0]?.itemId))
        .filter(itemId => !!itemId)

      const productsOfCollectionArray = productsOfCollection.products
        .map((product: any) => product.SkuId)
        .filter((skuId: any) => !!skuId)

      const productsToRemove = productsOfCollectionArray.filter(
        (product: any) => !productsToImportArray.includes(product)
      )

      const productsToAdd = productsToImportArray.filter(
        (product: any) => !productsOfCollectionArray.includes(product)
      )

      const subCollection = await Vtex.getSubcollectionByCollectionId(
        account,
        appKey,
        appToken,
        collection.id
      )

      if (productsToRemove.length > 0) {
        for await (const skuId of productsToRemove) {
          await Vtex.postRemoveProductsFromSubCollection(
            account,
            appKey,
            appToken,
            subCollection[0].Id,
            skuId
          )
        }
      }

      if (productsToAdd.length > 0) {
        for await (const skuId of productsToAdd) {
          await Vtex.postAddProductsToSubCollection(
            account,
            appKey,
            appToken,
            subCollection[0].Id,
            skuId
          )
        }
      }
    }
  } catch (error) {
    console.error(error)
    // return error
  }
}
