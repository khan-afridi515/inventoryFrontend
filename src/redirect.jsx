import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Redirect = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const state = params.get("state");
        const errorParam = params.get("error");
        const errorDescription = params.get("error_description");

        // Handle authorization errors from eBay
        if (errorParam) {
            console.error("eBay authorization error:", errorParam, errorDescription);
            setError(`Authorization failed: ${errorDescription || errorParam}`);
            setLoading(false);
            return;
        }

        // Validate state token to prevent CSRF attacks
        const storedState = sessionStorage.getItem("ebay_state");
        if (!state || state !== storedState) {
            console.error("State mismatch - possible CSRF attack");
            setError("Invalid state: Possible security issue");
            setLoading(false);
            return;
        }

        // Clear stored state after validation
        sessionStorage.removeItem("ebay_state");

        // Exchange code for token
        if (code) {
            exchangeCodeForToken(code);
        } else {
            setError("No authorization code received");
            setLoading(false);
        }
    }, [navigate]);

    // const exchangeCodeForToken = async (code) => {
    //     try {
    //         const response = await fetch("/api/ebay/callback", {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             credentials: "include",
    //             body: JSON.stringify({ code }),
    //         });

    //         if (!response.ok) {
    //             const errorData = await response.json().catch(() => ({}));
    //             throw new Error(errorData.message || `Server error: ${response.status}`);
    //         }

    //         const data = await response.json();
    //         console.log("eBay authorization successful");

    //         // Redirect to dashboard on success
    //         navigate("/dashboard");
    //     } catch (err) {
    //         console.error("Token exchange failed:", err);
    //         setError(`Connection failed: ${err.message}`);
    //         setLoading(false);
    //     }
    // };

    if (error) {
        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <h1>Authorization Failed</h1>
                <p style={{ color: "red" }}>{error}</p>
                <button onClick={() => navigate("/")}>Return to Home</button>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h1>Connecting eBay...</h1>
            {loading && <p>Please wait...</p>}
        </div>
    );
}






export default Redirect;