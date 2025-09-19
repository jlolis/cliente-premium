export const deleteCollection = async (Vtex: any, account: string, appKey: string, appToken: string, collectionsToDelete: any) => {
    try {
        for await (const collection of collectionsToDelete) {
            await Vtex.deleteCollection(account, appKey, appToken, collection.id)
        }
    } catch (error) {
        console.error(error);
    }
}