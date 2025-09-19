// import allPromorionsData from './allPromotionsRaw.json'

export const getPromotions = async (Propz: any, domain: string, token: string, username: string, password: string, storeId: string) => {
    console.log('getPromotions');
    
    // console.log({
    //     Propz,
    //     domain,
    //     token,
    //     username,
    //     password,
    //     storeId
    // });
    
    try {

        // const allPromotions: any[] = allPromorionsData
        const allPromotions: any[] = []
        let page = 1

        let hasNextPage = true

        do {
          const response = await Propz.getAllPromotion(domain, token, username, password, storeId, page)
          allPromotions.push(response)
          page++
          hasNextPage = response.next !== null
        } while (hasNextPage)

        // console.log(allPromotions);

        const mappedPromotionsItems = allPromotions.reduce((items: any, promotion: any) => {
        return items.concat(promotion.items)
        }, [])
        
        const personalizedPromotions = mappedPromotionsItems.filter((promotion: any) => promotion.promotionType === 'PERSONALIZED')
        const promotions = personalizedPromotions.filter((promotion: any) => promotion.properties.PRODUCT_ID_INCLUSION !== undefined)

        return promotions

    } catch (error) {
        console.error(error);
        return error
    }
}