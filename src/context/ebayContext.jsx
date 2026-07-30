import { ebayToken, ebayOrders } from "../services/ebayServices";
import { createContext, useContext, useState } from "react";


const ebayContext = createContext();

export const EbayProvider = ({ children }) => {

  const [ebayLoading, setEbayLoading] = useState(false);
  const [ebayError, setEbayError] = useState(null);
  const [ebayMessage, setEbayMessage] = useState("");
  const [ebayData, setEbayData] = useState(null);

  const getebayToken = async (values) => {
    try {
      setEbayLoading(true);
      setEbayError(null);
      setEbayMessage("");

      const response = await ebayToken(values);

      console.log("ebay response", response);

      setEbayMessage(response.message);
      return response;
    }
    catch (err) {
      setEbayError(err.message);
      throw err;
    }
    finally {
      setEbayLoading(false);
    }
  }

  const getEbayOrders = async () => {
    try {
      setEbayLoading(true);
      setEbayError(null);
      setEbayMessage("");

      const response = await ebayOrders();
      console.log("eBay orders response", response);
      setEbayMessage("Fetched eBay orders successfully");
      setEbayData(response.data);
      return response;
    } catch (err) {
      setEbayError(err.message);
      throw err;
    } finally {
      setEbayLoading(false);
    }
  }


  return (
    <ebayContext.Provider value={{ getebayToken, getEbayOrders, ebayError, ebayLoading, ebayMessage, ebayData }}>
      {children}
    </ebayContext.Provider>
  );
}

export const ebayAuth = () => useContext(ebayContext);