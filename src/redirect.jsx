import React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ebayAuth } from "./context/ebayContext";
import { setupEbayNotifications } from "./services/ebayServices";

const Redirect = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [notificationSetupError, setNotificationSetupError] = useState(null);
    const [notificationSetupSuccess, setNotificationSetupSuccess] = useState(null);
    const timeoutRef = useRef(null);
    const { getebayToken, ebayError, ebayLoading, ebayMessage } = ebayAuth();

    const exchangeCodeForToken = async (authorizationCode) => {
        try {
            console.log('eBay authorization code received:', authorizationCode);
            await getebayToken(authorizationCode);
            
            // Setup notifications after successful token exchange
            try {
                await setupEbayNotifications();
                console.log('eBay notifications setup completed successfully');
                setNotificationSetupSuccess('eBay notifications setup completed successfully');
            } catch (notificationError) {
                console.error('Failed to setup eBay notifications:', notificationError);
                setNotificationSetupError(notificationError.message || 'Failed to setup eBay notifications');
                // Don't throw - allow the flow to continue even if notification setup fails
            }
            
            setSuccess(true);
            setLoading(false);

            timeoutRef.current = window.setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (exchangeError) {
            console.error('Token exchange failed:', exchangeError);
            setError('Failed to complete eBay authorization.');
            setLoading(false);
        }
    };

  

    useEffect(() => {
        const handleRedirect = async () => {
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

            if (errorParam) {
                console.error('eBay authorization error:', errorParam, errorDescription);
                setError(`Authorization failed: ${errorDescription || errorParam}`);
                setLoading(false);
                return;
            }

            const storedState = localStorage.getItem('ebay_state');

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
            localStorage.removeItem('ebay_state');

            if (code) {
                console.log("Authorization successful! Code:", code);
                await exchangeCodeForToken(code);
            } else {
                setError('No authorization code received');
                setLoading(false);
            }
        };

        handleRedirect();
    }, [navigate]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

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
            <h1>{success ? "Welcome!" : "Connecting eBay..."}</h1>
            {(loading || ebayLoading) && <p>Please wait...</p>}
            {success && (
                <>
                    <p style={{ color: "green", margin: "20px 0" }}>
                        eBay authorization completed successfully!
                    </p>
                    {notificationSetupSuccess && (
                        <p style={{ color: "green", margin: "15px 0", fontWeight: "500" }}>
                            ✓ {notificationSetupSuccess}
                        </p>
                    )}
                    {notificationSetupError && (
                        <p style={{ color: "#F97316", margin: "15px 0", fontWeight: "500" }}>
                            ⚠️ Warning: {notificationSetupError}. Your inventory system will continue to work normally.
                        </p>
                    )}
                </>
            )}
            {!success && ebayMessage && (
                <p style={{ color: "green", margin: "20px 0" }}>{ebayMessage}</p>
            )}
        </div>
    );
}






export default Redirect;