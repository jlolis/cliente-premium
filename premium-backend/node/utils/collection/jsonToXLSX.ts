import xlsx from "json-as-xlsx"

export default async function jsonToXLSX(products: any) {
    try {
        const data = [
        {
            sheet: 'mySheetName',
            columns: [
                { label:'SKU', value: 'sku' },
                { label:'PRODUCT', value: 'product' },
                { label:'SKUREFID', value: 'skuRefId' },
                { label:'PRODUCTREFID', value: 'productRefId' },
            ],
            content: products.map((product: any) => {
                return {
                    sku: '',
                    product: '',
                    skuRefId: product,
                    productRefId: ''
                }
            })
        }
        ]

        let settings = {
            fileName: "MySpreadsheet", // Name of the resulting spreadsheet
            extraLength: 3, // A bigger number means that columns will be wider
            writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
            writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
        }

        const buffer = await xlsx(data, settings) // Will download the excel file

        return buffer
    } catch (error) {
        return error
    }
}