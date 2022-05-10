
import axios from "axios";

import {API} from "./components/httpveriables";


export const getAccountstatement = (body) => {
    return axios({
        method: "POST",
        url: `${API}/accountstatement/${body.id}`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};
export const settalmentUpdate = (body) => {
    return axios({
        method: "POST",
        url: `${API}/accountstatement-update`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};