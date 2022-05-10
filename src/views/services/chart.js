
import axios from "axios";

import {API} from "./components/httpveriables";

export const AllLotterychart = (body) => {
    return axios({
        method: "POST",
        url: `${API}/get-chart`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body)
    });
};
export const getChart = (body) => {
    var url = `${API}/get-chart/${body.id}`;
    return axios({
        method: "GET",
        url: `${url}`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        }
    });
};
export const deleteChart = (body) => {
    var url = `${API}/delete-chart/${body.id}`;
    return axios({
        method: "GET",
        url: `${url}`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        }
    });
};
export const getChartbyLotteryId = (body) => {
    return axios({
        method: "POST",
        url: `${API}/get-chart-lottery-id/${body.lottery_id}`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};
export const AddLotterychart = (body) => {
    return axios({
        method: "POST",
        url: `${API}/add-chart`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};
export const checkresultchart = (body) => {
    return axios({
        method: "POST",
        url: `${API}/check-chart`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};
export const update = (body, id) => {
    return axios({
        method: "POST",
        url: `${API}/update-chart/${id}`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};