import { createContext, useContext, useState } from "react";
import { loginUser, resendOtp, signUpUser, verifyemail } from "../services/authServices"
import { AUTH_STORAGE_KEYS } from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    const login = async (values) => {
        try {

            setLoading(true);
            setError(null);
            setMessage("");

            const response = await loginUser(values);

            localStorage.setItem(
                AUTH_STORAGE_KEYS.accessToken,
                   response.token
               );

            localStorage.setItem(
              AUTH_STORAGE_KEYS.user,
               JSON.stringify(response.user)
             );

            setUser(response.user);
            setMessage(response.msg);
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


    return (

        <AuthContext.Provider value={{ user, loading, error, login, signUp, message, verifyEmail, resendotp}}>

            {children}

        </AuthContext.Provider>

    );

};

export const useAuth = () => useContext(AuthContext);