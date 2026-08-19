import { apiRequest } from "../apiRequest/apiRequest"


export const ebayToken = (code) => {
    return apiRequest("ebay/token", 
        {
            method : "POST",
            body : { code }
        }
    )
}

export const ebayOrders = () => {
    return apiRequest("ebay/orders",
        {
            method: "GET"
        }
    )
}

export const ebayNotifications = () => {
    return apiRequest("ebay/notifications", {
        method: "GET"
    });
}

export const setupEbayNotifications = () => {
    return apiRequest("ebay/notifications/setup", {
        method: "POST"
    });
}