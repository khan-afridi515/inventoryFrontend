import {
    API_BASE_URL,
    AUTH_STORAGE_KEYS
} from "../api/api";
export async function apiRequest(endpoint,
{
   method = "GET",
   body,
    headers = {}
   } = {}
){
   const requestHeaders={
      Accept:"application/json",
       ...headers
     };

    if(body){
    requestHeaders["Content-Type"]="application/json";
    }

    const token=localStorage.getItem(
     AUTH_STORAGE_KEYS.accessToken
    );

    if(token){
     requestHeaders.Authorization=`Bearer ${token}`;
     }

    const response=await fetch(
   `${API_BASE_URL}/${endpoint}`,
          {
            method,
            headers:requestHeaders,
            body:body
            ?
            JSON.stringify(body)
            :
            undefined
          }
     );
     
    const data=await response.json();
    if(!response.ok){
      throw new Error(
       data.message ||
        "Something went wrong"
        );
      }
   return data;
}