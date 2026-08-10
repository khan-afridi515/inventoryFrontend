import { ebayToken, ebayOrders } from "../services/ebayServices";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const ebayContext = createContext();

export const EbayProvider = ({ children }) => {
  const [ebayLoading, setEbayLoading] = useState(false);
  const [ebayError, setEbayError] = useState(null);
  const [ebayMessage, setEbayMessage] = useState("");
  const [ebayData, setEbayData] = useState(null);
  const ebayDataRef = useRef(ebayData);
  const hasLoadedOrdersRef = useRef(false);
  const loadingOrdersRef = useRef(false);

  useEffect(() => {
    ebayDataRef.current = ebayData;
  }, [ebayData]);

  const getebayToken = useCallback(async (values) => {
    try {
      setEbayLoading(true);
      setEbayError(null);
      setEbayMessage("");

      const response = await ebayToken(values);
      setEbayMessage(response.message);
      return response;
    } catch (err) {
      setEbayError(err.message);
      throw err;
    } finally {
      setEbayLoading(false);
    }
  }, []);

  const getEbayOrders = useCallback(async () => {
    if (loadingOrdersRef.current) {
      return { data: ebayDataRef.current };
    }

    if (hasLoadedOrdersRef.current && Array.isArray(ebayDataRef.current) && ebayDataRef.current.length > 0) {
      return { data: ebayDataRef.current };
    }

    try {
      setEbayLoading(true);
      setEbayError(null);
      setEbayMessage("");
      loadingOrdersRef.current = true;

      const response = await ebayOrders();
      console.log("response", response);
      const nextData = Array.isArray(response?.data) ? response.data : [];
      setEbayMessage("Fetched eBay orders successfully");
      setEbayData(nextData);
      ebayDataRef.current = nextData;
      hasLoadedOrdersRef.current = true;
      return response;
    } catch (err) {
      setEbayError(err.message);
      throw err;
    } finally {
      setEbayLoading(false);
      loadingOrdersRef.current = false;
    }
  }, []);

  return (
    <ebayContext.Provider value={{ getebayToken, getEbayOrders, ebayError, ebayLoading, ebayMessage, ebayData }}>
      {children}
    </ebayContext.Provider>
  );
};

export const ebayAuth = () => useContext(ebayContext);