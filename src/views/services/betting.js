
import axios from "axios";

import { API } from "./components/httpveriables";

export const Betplace = (body) => {
    return axios({
        method: "POST",
        url: `${API}/bet-placed`,
        headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};
export const getbetresult = (body) => {
    return axios({
        method: "POST",
        url: `${API}/bet-result`,
        headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};
export const getBetting = (body, pagerule) => {
    return axios({
        method: "POST",
        url: `${API}/get_betting/${body.id}/${body.lottery_id}`,
        headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(pagerule),
    });
};
export const all_betting = (body, pagerule) => {
    return axios({
        method: "POST",
        url: `${API}/all_betting/${body.slug}`,
        headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(pagerule),
    });
};
export const betannounce = (body) => {
    return axios({
        method: "POST",
        url: `${API}/bet-announce/`,
        headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};
export const plbyDigit = (body) => {
    return axios({
        method: "POST",
        url: `${API}/get_pl_by_digit/`,
        headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};
export const plbysuggestiondigit = (body) => {
    return axios({
        method: "POST",
        url: `${API}/get_pl_by_suggestiondigit/`,
        headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};
export const getBattingbyuserId = (body) => {
    return axios({
        method: "POST",
        url: `${API}/betting_by_user`,
        headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};
export const getBattingbyLotteryId = (body) => {
    return axios({
        method: "POST",
        url: `${API}/betting_by_lotteryid`,
        headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};
export const bettingbydigit = (body) => {
    return axios({
        method: "POST",
        url: `${API}/betting_by_digit`,
        headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};
export const getTotalbatting = (body) => {
    return axios({
        method: "GET",
        url: `${API}/get_total/${body.role}/${body.id}`,
        headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem("token")
        }
    });
};
export const get_books = (body) => {
    return axios({
        method: "GET",
        url: `${API}/get_books/${body.user_id}/${body.lottery_id}`,
        headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem("token")
        }
    });

};
// get_live_books
export const get_live_books = (body) => {
    return axios({
        method: "GET",
        url: `${API}/get_live_books/${body.lottery_id}`,
        headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem("token")
        }
    });

};
export const get_currnet_bets_count = (body) => {
    return axios({
        method: "GET",
        url: `${API}/currentbetscount/${body.id}`,
        headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem("token")
        }
    });
};

export const get_currnet_bets = (body) => {
    return axios({
        method: "GET",
        url: `${API}/currentbets/${body.id}`,
        headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem("token")
        }
    });
};