'use client'
import axios from 'axios'
import SERVER_URL from "../config/serverUrl"

let Axios = axios.create({
    baseURL:SERVER_URL,
    withCredentials:true
})

let AxiosProtected

export default function AxiosProvider({children}){
    AxiosProtected.
}