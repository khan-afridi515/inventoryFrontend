import { apiRequest } from "../apiRequest/apiRequest";

export const loginUser=(payload)=>{

    return apiRequest(
        "login",
        {

            method:"POST",

            body:payload

        }

    );

};


export const signUpUser = (payload) => {
    return apiRequest("user", 
        {
            method : "POST",
            body : payload
        }
    )
}

export const verifyemail = (payload) => {
    return apiRequest("email", 
        {
            method : "POST",
            body : payload
        }
    )
}

export const resendOtp = (payload) => {
    return apiRequest("resend", 
        {
            method : "POST",
            body : payload
        }
    )
}