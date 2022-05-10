
import axios from "axios";

import {API} from "./components/httpveriables";

export const getprofitandloss = (body, pagerule) => {
    return axios({
        method: "POST",
        url: `${API}/profitandloss/${body.id}`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(pagerule),
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