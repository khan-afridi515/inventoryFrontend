import { ebayToken, ebayOrders } from "../services/ebayServices";
import { createContext, useContext, useState } from "react";


const ebayContext = createContext();

export const EbayProvider = ({ children }) => {

    const [ebayLoading, setEbayLoading] = useState(false);
    const [ebayError, setEbayError] = useState(null);
    const [ebayMessage, setEbayMessage] = useState("");

const getebayToken = async (values) =>{
    try{
      setEbayLoading(true);
      setEbayError(null);
      setEbayMessage("");

      const response = await ebayToken(values);
    
      console.log("ebay response", response);
      console.log("ebay access token", response.data.access_token);
      localStorage.setItem("ebayAccessToken", response.data.access_token);
      localStorage.setItem("ebayRefreshToken", response.data.refresh_token);

      setEbayMessage(response.message);
      return response;
    }
    catch(err){
        setEbayError(err.message);
        throw err;
    }
    finally{
        setEbayLoading(false);
    }
}

const getEbayOrders = async () => {
    try {
      setEbayLoading(true);
      setEbayError(null);
      setEbayMessage("");

      const ebayAccessToken = localStorage.getItem("ebayAccessToken");
      if (!ebayAccessToken) {
        throw new Error("eBay access token is not available");
      }

      const response = await ebayOrders(ebayAccessToken);
      console.log("eBay orders response", response);
      setEbayMessage("Fetched eBay orders successfully");
      return response;
    } catch (err) {
      setEbayError(err.message);
      throw err;
    } finally {
      setEbayLoading(false);
    }
}


    return (
        <ebayContext.Provider value={{ getebayToken, getEbayOrders, ebayError, ebayLoading, ebayMessage }}>
            {children}
        </ebayContext.Provider>
    );
}

export const ebayAuth = () => useContext(ebayContext);