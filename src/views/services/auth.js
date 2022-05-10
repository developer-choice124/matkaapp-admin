
import axios from "axios";

import {API} from "./components/httpveriables";

export const USersignIn = (body) => {
    return axios({
        method: "POST",
        url: `${API}/login`,
        headers: {
        'Content-Type': 'application/json',
        },
        data: JSON.stringify(body),
    });
};
export const USerregistration = (body) => {
    return axios({
        method: "POST",
        url: `${API}/user-registration`,
        headers: {
        'Content-Type': 'application/json',
        },
        data: JSON.stringify(body),
    });
};
export const verifyOtp = (body) => {
    return axios({
        method: "POST",
        url: `${API}/verify-otp`,
        headers: {
        'Content-Type': 'application/json',
        },
        data: JSON.stringify(body),
    });
};
export const forgotPassword = (body) => {
    return axios({
        method: "POST",
        url: `${API}/forgot-password`,
        headers: {
        'Content-Type': 'application/json',
        },
        data: JSON.stringify(body),
    });
};
export const AdminsignIn = (body) => {
    return axios({
        method: "POST",
        url: `${API}/admin-login`,
        headers: {
        'Content-Type': 'application/json',
        },
        data: JSON.stringify(body),
    });
};