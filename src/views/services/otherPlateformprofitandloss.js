
import axios from "axios";

import {API} from "./components/httpveriables";

export const getcasinoprofitandloss = (body) => {
    return axios({
        method: "POST",
        url: `${API}/profitandloss_otherplateform/`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};
export const getcasinoBetHistory = (body) => {
    return axios({
        method: "POST",
        url: `${API}/getcasinoBetHistory/`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};
export const getTotalprofitandloss = (body) => {
    return axios({
        method: "GET",
        url: `${API}/get_total_profitloss/${body.slug}/${body.id}`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        }
    });
};