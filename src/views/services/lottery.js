
import axios from "axios";

import {API} from "./components/httpveriables";

export const AllLottery = (body) => {
    return axios({
        method: "POST",
        url: `${API}/all-lottery`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};
export const lotteryfilterd = (body) => {
    return axios({
        method: "POST",
        url: `${API}/all-lottery/${body.slug}`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        }
    });
};
export const getLottery = (body) => {
    return axios({
        method: "GET",
        url: `${API}/lottery/${body.id}`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        }
    });
};
export const AddLottery = (body) => {
    return axios({
        method: "POST",
        url: `${API}/lottery`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};
export const UpdateLottery = (body, id) => {
    return axios({
        method: "POST",
        url: `${API}/update-lottery/${id}`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};
export const RemoveSupermaster = (body) => {
    return axios({
        method: "GET",
        url: `${API}/remove-supermaster/${body.id}/${body.supermasterId}`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        }
    });
};
export const deleteLottery = (body) => {
    return axios({
        method: "POST",
        url: `${API}/delete-lottery/${body.id}`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};