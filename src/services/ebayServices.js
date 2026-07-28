import { apiRequest } from "../apiRequest/apiRequest"


export const ebayToken = (code) => {
    return apiRequest("ebay/token", 
        {
            method : "POST",
            body : { code }
        }
    )
}

export const ebayOrders = (ebayAccessToken) => {
    return apiRequest("ebay/orders",
        {
            method: "POST",
            body: { accessToken: ebayAccessToken }
        }
    )
}