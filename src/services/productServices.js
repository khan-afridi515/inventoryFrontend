import { apiRequest } from "../apiRequest/apiRequest";

export const addProduct = (payload) => {
    return apiRequest("add", {
        method: "POST",
        body: payload,
    });
};

export const updateProduct = (id, payload) => {
    return apiRequest(`update/${id}`, {
        method: "PUT",
        body: payload,
    });
};

export const getProducts = () => {
    return apiRequest('get', {
        method: 'GET',
    });
};

export const deleteProduct = (id) => {
    return apiRequest(`delete/${id}`, {
        method: 'DELETE',
    });
};