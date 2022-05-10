
import axios from "axios";

import {API} from "./components/httpveriables";

export const Add = (body) => {
    return axios({
        method: "POST",
        url: `${API}/register`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};
export const getUserByuserid = (body) => {
    return axios({
        method: "POST",
        url: `${API}/get-user-list`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
};

export const allusers = async (body, pagerule) => {
    var link = `${API}/all-users`;
    if(body.role && body.id){
        link = `${link}/${body.role}/${body.id}`;
    }else if(body.role){
        link = `${link}/${body.role}`;
    }
    let users = await axios({
        method: "POST",
        url: link,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(pagerule)
    });
    
    return users;
  
  }
export const getUser = async (body) => {
    let users = await axios({
        method: "GET",
        url: `${API}/user/${body.id}`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        }
    });
    
    return users;
  
  }
export const updateUser = async (body, user_id) => {
    let users = await axios({
        method: "POST",
        url: `${API}/update/${user_id}`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
    
    return users;
  
  }
export const deleteuser = async (body, pagerule) => {
    let users = await axios({
        method: "POST",
        url: `${API}/delete-user/${body.id}/${body.status}`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(pagerule),
    });
    
    return users;
  
  }
export const changePassword = async (body) => {
    let users = await axios({
        method: "POST",
        url: `${API}/change-password`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
    
    return users;
  
  }
export const authChangePassword = async (body) => {
    let users = await axios({
        method: "POST",
        url: `${API}/auth-change-password`,
        headers: {
        'Content-Type': 'application/json'
        },
        data: JSON.stringify(body),
    });
    
    return users;
  
  }
export const blocked = async (body) => {
    let users = await axios({
        method: "POST",
        url: `${API}/blocked-user`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
    
    return users;
  
  }
export const getdeletedUser = async (body) => {
    let users = await axios({
        method: "POST",
        url: `${API}/get-deleted-user`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
    
    return users;
  
  }

  export const getChipsById = async (body) => {
    let users = await axios({
        method: "GET",
        url: `${API}/chipsbyid/${body.id}`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        }
    });
    
    return users;
  
  }

  export const setUserSetting = async (body) => {
    let users = await axios({
        method: "POST",
        url: `${API}/user-setting?user_id=${body.user_id}`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        },
        data: JSON.stringify(body),
    });
    
    return users;
  
  }

  export const getUserSetting = async (body) => {
    let usersetting = await axios({
        method: "GET",
        url: `${API}/get-user-setting?user_id=${body.user_id}`,
        headers: {
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem("token")
        }
    });

    return usersetting;
  
  }