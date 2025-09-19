export const getProducts = async (
  Vtex: any,
  account: string,
  appKey: string,
  appToken: string,
  mappedCollections: any,
  storeId: any
) => {
  try {
    const promises = []

    for await (const collection of mappedCollections) {
      try {
        let pageCollectionsProducts = 1

        let hasNextCollectionProductsPage = true

        do {
          // eslint-disable-next-line no-await-in-loop
          const response = await Vtex.getCollectionProducts(
            account,
            appKey,
            appToken,
            collection.id,
            pageCollectionsProducts,
            storeId
          )

          // console.log(response);
          promises.push({
            collectionId: collection.id,
            products: response.Data,
          })
          pageCollectionsProducts++
          hasNextCollectionProductsPage = response.Page < response.TotalPage
        } while (hasNextCollectionProductsPage)
      } catch (error) {
        // console.error(error);
      }
    }

    const productsByCollection = promises.reduce((acc: any, promise: any) => {
      const found = acc.findIndex(
        (item: any) => item.collectionId === promise.collectionId
      )

      if (found > -1) {
        acc[found].products.push(...promise.products)
      } else {
        acc.push({
          collectionId: promise.collectionId,
          products: promise.products,
        })
      }

      return acc
    }, [])

    return productsByCollection
  } catch (error) {
    console.error(error)

    return error
  }
}
