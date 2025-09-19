import { deleteCollection } from './deleteCollection'

export const getCollections = async (
  Vtex: any,
  account: string,
  appKey: string,
  appToken: string,
  promotions: any,
  storeId: any
) => {
  try {
    const allCollections = []

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

        // console.log(response);
        allCollections.push(response)
        pageCollections++
        hasNextCollectionPage = response?.items?.length > 0
      } while (hasNextCollectionPage)
    } catch (error) {
      // console.error(error);
    }

    const mappedCollections = allCollections.reduce(
      (items: any, collection: any) => {
        return items.concat(collection.items)
      },
      []
    )

    const existingCollections = mappedCollections.filter((collection: any) => {
      return promotions.some(
        (promotion: any) =>
          collection.name ===
          `Propz-${storeId} - ${promotion.partnerPromotionId} - ${promotion.name}`
      )
    })

    const collectionsToDelete = mappedCollections.filter((collection: any) => {
      return !promotions.some(
        (promotion: any) =>
          collection.name ===
          `Propz-${storeId} - ${promotion.partnerPromotionId} - ${promotion.name}`
      )
    })

    await deleteCollection(Vtex, account, appKey, appToken, collectionsToDelete)

    const collectionsToCreate = promotions.filter((promotion: any) => {
      return (
        promotion.name !== '' &&
        promotion.name !== null &&
        !mappedCollections.some(
          (collection: any) =>
            collection.name ===
            `Propz-${storeId} - ${promotion.partnerPromotionId} - ${promotion.name}`
        )
      )
    })

    const collectionsToUpdate = existingCollections.filter(
      (collection: any) => {
        return !collectionsToDelete.some(
          (collectionToDelete: any) => collectionToDelete.id === collection.id
        )
      }
    )

    return {
      allCollections,
      mappedCollections,
      existingCollections,
      collectionsToDelete,
      collectionsToCreate,
      collectionsToUpdate,
    }
  } catch (error) {
    console.error(error)

    return { error }
  }
}
