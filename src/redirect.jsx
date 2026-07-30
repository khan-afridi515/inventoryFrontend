import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ebayAuth } from "./context/ebayContext";

const Redirect = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { getebayToken, ebayError, ebayLoading, ebayMessage } = ebayAuth();


    // const exchangeCodeForToken = async (authorizationCode) => {
    //     try {
    //         console.log('eBay authorization code received:', authorizationCode);
    //         await getebayToken(authorizationCode);
    //         navigate('/');
    //     } catch (exchangeError) {
    //         console.error('Token exchange failed:', exchangeError);
    //         setError('Failed to complete eBay authorization.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    useEffect(() => {
        getebayToken("v^1.1#i^1#p^3#f^0#r^1#I^3#t^Ul41XzI6MzU3M0Q4ODhENkU0NTJDRUU1Q0UzQzdCNTIwODYwMDlfMF8xI0VeMTI4NA==")
    }, [])

    useEffect(() => {
        if (!window.location.search) {
            setLoading(false);
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        const errorParam = params.get('error');
        const errorDescription = params.get('error_description');

        console.log("Code and state", code, state);

        // Handle authorization errors from eBay
        if (errorParam) {
            console.error('eBay authorization error:', errorParam, errorDescription);
            setError(`Authorization failed: ${errorDescription || errorParam}`);
            setLoading(false);
            return;
        }

        // Get stored state
        const storedState = localStorage.getItem('ebay_state');

        // Check state to prevent CSRF
        if (!state) {
            setError('No state returned from eBay');
            setLoading(false);
            return;
        }

        if (storedState && state !== storedState) {
            console.error('State mismatch - possible CSRF attack');
            setError('Invalid state: Possible security issue');
            setLoading(false);
            return;
        } else if (!storedState) {
            console.warn('Stored state is null. This could be due to a React double-render, or you are testing from a different domain than the redirect URL.');
        }

        console.log("Callback origin:", window.location.origin);

        // Clear stored state after validation
        localStorage.removeItem('ebay_state');

        // Exchange code for token (backend not deployed yet)
        // if (code) {
        //     console.log("Authorization successful! Code:", code);
        //     setLoading(false);
        //     navigate('/');
        // } else {
        //     setError('No authorization code received');
        //     setLoading(false);
        // }
    }, [navigate]);

    if (error || ebayError) {
        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <h1>Authorization Failed</h1>
                <p style={{ color: "red" }}>{error || ebayError}</p>
                <button onClick={() => navigate("/")}>Return to Home</button>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h1>Connecting eBay...</h1>
            {(loading || ebayLoading) && <p>Please wait...</p>}
            {ebayMessage && (
                <>
                    <p style={{ color: "green", margin: "20px 0" }}>{ebayMessage}</p>
                    <button onClick={() => navigate("/")}>Return to Home</button>
                </>
            )}
        </div>
    );
}






export default Redirect;