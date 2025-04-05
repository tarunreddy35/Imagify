import React from "react";
import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";

const AppContext = createContext()

const AppContextProvider = (props) => {

    const [showLogin, setShowLogin] = useState(false)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [user, setUser] = useState(null)

    const [credit, setCredit] = useState(false)

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate()

    const loadCreditsData = async () => {
        const token = localStorage.getItem('token'); 
        try {

            const { data } = await axios.get(backendUrl + '/api/user/credits', { headers: {
                Authorization: `Bearer ${token}`,
              }, })
            if (data.success) {
                setCredit(data.credits)
                setUser(data.user)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const generateImage = async (prompt) => {
        try {

            const { data } = await axios.post(backendUrl + '/api/image/generate-image', { prompt }, { headers: { Authorization: `Bearer ${token}` } })

            if (data.success) {
                loadCreditsData()
                return data.resultImage
            } else {
                toast.error(data.message)
                loadCreditsData()
                if (data.creditBalance === 0) {
                    navigate('/buy')
                }
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken('')
        setUser(null)
    }

    useEffect(()=>{
        if (token) {
            loadCreditsData()
        }
    },[token])

    const value = {
        token, setToken,
        user, setUser,
        showLogin, setShowLogin,
        credit, setCredit,
        loadCreditsData,
        backendUrl,
        generateImage,
        logout
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}
AppContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};


export { AppContext, AppContextProvider };