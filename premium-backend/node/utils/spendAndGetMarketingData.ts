export const spendAndGetMarketingData = async (
    ctx: any, 
    appData: any,
    response: any,
    orderForm: any
) => {

    const { domain, token, document, username, password, appKey, appToken, storeId } = appData

    const { orderFormId } = orderForm

    const {
        clients: { Propz, Vtex },
        vtex: { account },
    } = ctx

    const responsePromotionPropz = await Propz.getPromotionShowCase(
        domain,
        token,
        document,
        username,
        password,
        storeId
    )

    const spendAndGetPromotion = responsePromotionPropz.items.filter(
    (item: { promotion: { mechanic: string } }) =>
        item.promotion.mechanic === 'spend_and_get'
    )

    // console.log('spendAndGetPromotion', spendAndGetPromotion);

    const appliedPromotions = spendAndGetPromotion.filter(
        (promotionItem: { promotion: any}) => {
            const foundSpendAndGetPromotion = response.ticket.ticketDiscounts.find(
            (item: { partnerPromotionId: string }) => promotionItem.promotion.partnerPromotionId === item.partnerPromotionId 
            )
            return !!foundSpendAndGetPromotion
        }
    )

    // console.log('appliedPromotions', appliedPromotions);

    const marketingData = orderForm.marketingData || {}

    // console.log('marketingData', marketingData);
    

    const marketingTags = marketingData.marketingTags || []

    if(appliedPromotions.length > 0) {
    
        const tagName = 'SpendAndGet_' + appliedPromotions[0].promotion.discountAmount
    
        await Vtex.postMarketingData(
            account,
            appKey,
            appToken,
            orderFormId,
            {
            ...marketingData,
            'marketingTags': [...marketingTags.filter((tag: any) => tag.indexOf('SpendAndGet') === -1), tagName],
            }
        ) 
    } else {
        await Vtex.postMarketingData(
            account,
            appKey,
            appToken,
            orderFormId,
            {
            ...marketingData,
            'marketingTags': marketingTags.filter((tag: any) => tag.indexOf('SpendAndGet') === -1),
            }
        )
    }

}