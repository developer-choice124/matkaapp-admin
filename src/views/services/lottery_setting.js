
import axios from "axios";

import {API} from "./components/httpveriables";

export const AllLotterysetting = (body) => {
    return axios({
        method: "POST",
        url: `${API}/lottery-type/list`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};
export const GetLotteryById = (body) => {
    return axios({
        method: "GET",
        url: `${API}/get_lottery/${body.lottery_id}`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
    });
};
export const getLotterySetting = (body) => {
    return axios({
        method: "GET",
        url: `${API}/lottery-type/${body.id}`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        }
    });
};

export const AddLotterysetting = (body) => {
    return axios({
        method: "POST",
        url: `${API}/lottery-type`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};
export const UpdateLottery = (body) => {
    return axios({
        method: "put",
        url: `${API}/lottery-type/`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};
export const deleteLottery = (body) => {
    return axios({
        method: "POST",
        url: `${API}/delete-lottery/${body.id}`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        }
    });
};