import { guestInstance, authInstance } from './index.js'
import jwtDecode from 'jwt-decode'

export const signup = async (email, password) => {
    try {
        const response = await guestInstance.post('user/signup', {email, password, role: 'USER'})
        const token = response.data.token
        const user = jwtDecode(token)
        localStorage.setItem('token', token)
        return user
    } catch (e) {
        alert(e.response.data.message)
        return false
    }
}

export const login = async (email, password) => {
    try {
        const response = await guestInstance.post('user/login', {email, password})
        const token = response.data.token
        const user = jwtDecode(token)
        localStorage.setItem('token', token)
        return user
    } catch (e) {
        alert(e.response.data.message)
        return false
    }
}

export const logout = () => {
    localStorage.removeItem('token')
}

export const check = async () => {
    let userToken, userData
    try {
        userToken = localStorage.getItem('token')
        if (!userToken) {
            return false
        }
        const response = await authInstance.get('user/check')
        userToken = response.data.token
        userData = jwtDecode(userToken)
        localStorage.setItem('token', userToken)
        return true
    } catch(e) {
        localStorage.removeItem('token')
        return false
    }
}

export const deleteUser = async (id) => {
    try {
        const response = await authInstance.delete(`user/delete/${id}`)
        return true
    } catch (e) {
        alert(e.response.data.message)
        return false
    }
}

export const getAll = async () => {
    try {
        const response = await authInstance.get('user/getall')
        return response.data
    } catch (e) {
        alert(e.response.data.message)
        return false
    }
}