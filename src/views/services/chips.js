
import axios from "axios";

import {API} from "./components/httpveriables";

export const AddCihps = (body) => {
    return axios({
        method: "POST",
        url: `${API}/add-chips`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};

// chip-history-by-userId
export const getChiphistory = (body, pagerule) => {
    return axios({
        method: "POST",
        url: `${API}/chip-history-by-userId/${body.id}`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(pagerule)
    });
};

// get-Chips-History-By-Date
export const getChipsHistoryByDate = (body) => {
    return axios({
        method: "get",
        url: `${API}/chips/${body._id}/${body.page}`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        }
    });
};

//get-Chips-History-By-Date(from-to)
export const getChipsHistoryByTODate = (body) => {
    return axios({
        method: "get",
        url: `${API}/chips/${body._id}/${body.sort}/${body.from}/${body.to}`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        }
    });
};


// get-Chips-History-By-One-Date
export const getChipsHistoryByOneDate = (body) => {
    return axios({
        method: "get",
        url: `${API}/chipsbydate/${body.id}/${body.from}/${body.to}/${body.page}`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        }
    });
};