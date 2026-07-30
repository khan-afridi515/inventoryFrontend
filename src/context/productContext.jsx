import { createContext, useContext, useState, useCallback } from "react";
import { addProduct, updateProduct, getProducts, deleteProduct } from "../services/productServices";

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
    const [productloading, setProductLoading] = useState(false);
    const [producterror, setProductError] = useState(null);
    const [productmessage, setProductMessage] = useState("");
    const [productData, setProductData] = useState(null);
    // Separate states for update API
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const [updateMessage, setUpdateMessage] = useState("");
    const [updateData, setUpdateData] = useState(null);
    // States for fetching products
    const [productsLoading, setProductsLoading] = useState(false);
    const [productsError, setProductsError] = useState(null);
    const [productsList, setProductsList] = useState([]);

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [deleteError, setDeleteError] = useState("");

    const clearDeleteMessage = useCallback(() => {
        setDeleteMessage("");
    }, []);

    const addNewProduct = async (values) => {
        try {
            setProductLoading(true);
            setProductError(null);
            setProductMessage("");

            const response = await addProduct(values);
            const product = response?.product || response?.data || response;

            setProductData(product);
            setProductMessage(response?.message || response?.msg || "Product added successfully.");
            return response;
        } catch (err) {
            const message = err?.message || "Could not add the product.";
            setProductError(message);
            throw err;
        } finally {
            setProductLoading(false);
        }
    };

    const updateProductById = async (id, values) => {
        try {
            setUpdateLoading(true);
            setUpdateError(null);
            setUpdateMessage("");

            const response = await updateProduct(id, values);
            const product = response?.product || response?.data || response;

            setUpdateData(product);
            setUpdateMessage(response?.message || response?.msg || "Product updated successfully.");
            return response;
        } catch (err) {
            const message = err?.message || "Could not update the product.";
            setUpdateError(message);
            throw err;
        } finally {
            setUpdateLoading(false);
        }
    };

    const fetchProducts = useCallback(async () => {
        try {
            setProductsLoading(true);
            setProductsError(null);

            const response = await getProducts();
            const items = response?.data || response?.products || response || [];
            setProductsList(items);
            return items;
        } catch (err) {
            const message = err?.message || 'Could not fetch products.';
            setProductsError(message);
            throw err;
        } finally {
            setProductsLoading(false);
        }
    }, []);

      const deleteProductId = async (id) => {
        try {
            setDeleteLoading(true);
            setDeleteError(null);
            setDeleteMessage("");

            const response = await deleteProduct(id);
            setDeleteMessage(response?.message || response?.msg || "Product deleted successfully.");
            return response;
        } catch (err) {
            const message = err?.message || "Could not delete the product.";
            setDeleteError(message);
            throw err;
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <ProductContext.Provider
            value={{
                productloading,
                producterror,
                productmessage,
                productData,
                addNewProduct,
                // update API states and method
                updateLoading,
                updateError,
                updateMessage,
                updateData,
                updateProductById,
                // products GET API
                productsLoading,
                productsError,
                productsList,
                fetchProducts,

                //delete product by Id
                deleteProductId,
                deleteLoading,
                deleteError,
                deleteMessage,
                clearDeleteMessage
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const useProductContext = () => {
    const context = useContext(ProductContext);

    if (!context) {
        throw new Error("useProductContext must be used within a ProductProvider");
    }

    return context;
};