import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, resendOtp, signUpUser, verifyemail } from "../services/authServices"
import { AUTH_STORAGE_KEYS } from "../api/api";

const AuthContext = createContext();

const getAuthToken = (response) => {
    const possibleTokens = [
        response?.token,
        response?.accessToken,
        response?.access_token,
        response?.loginData?.accessToken,
        response?.loginData?.access_token,
        response?.data?.token,
        response?.data?.accessToken,
        response?.data?.access_token
    ];

    return possibleTokens.find((value) => typeof value === "string" && value.trim());
};

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEYS.user);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem(AUTH_STORAGE_KEYS.user);
        }
      }
    }, []);

    const login = async (values) => {
        try {

            setLoading(true);
            setError(null);
            setMessage("");

            const response = await loginUser(values);
           
            const token = getAuthToken(response);
            const userData = response?.user ?? response?.loginData?.user ?? response?.data?.user ?? null;

            if (token) {
                localStorage.setItem(
                    AUTH_STORAGE_KEYS.accessToken,
                    token
                );
                localStorage.setItem(
                    AUTH_STORAGE_KEYS.token,
                    token
                );
            }

            if (userData) {
                localStorage.setItem(
                    AUTH_STORAGE_KEYS.user,
                    JSON.stringify(userData)
                );
            }

            setUser(userData);
            setMessage(response?.message ?? response?.msg ?? "");
            return response;

        }

        catch (err) {
           setError(err.message);
           throw err;
         }
      finally {
         setLoading(false);

        }

    };


    const signUp = async (values) => {

        try{
            
           setLoading(true);
           setError(null);
           setMessage("");
           const response = await signUpUser(values);

           setMessage(response.msg);
           return response;

        }
        catch(err){
            setError(err.message);
            throw err;
        }
        finally{
            setLoading(false);
        }
    }


     const verifyEmail = async (values) => {

        try{
            
           setLoading(true);
           setError(null);
           setMessage("");
           const response = await verifyemail(values);

           setMessage(response.message);
           return response;

        }
        catch(err){
            setError(err.message);
            throw err;
        }
        finally{
            setLoading(false);
        }
    }


    const resendotp = async (values) => {

        try{
            
           setLoading(true);
           setError(null);
           setMessage("");
           const response = await resendOtp(values);

           setMessage(response.message);
           return response;

        }
        catch(err){
            setError(err.message);
            throw err;
        }
        finally{
            setLoading(false);
        }
    }


    const logout = () => {
        localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
        localStorage.removeItem(AUTH_STORAGE_KEYS.token);
        localStorage.removeItem(AUTH_STORAGE_KEYS.user);
        setUser(null);
    };

    return (

        <AuthContext.Provider value={{ user, loading, error, login, signUp, message, verifyEmail, resendotp, logout}}>

            {children}

        </AuthContext.Provider>

    );

};

export function useAuth() {
    return useContext(AuthContext);
}