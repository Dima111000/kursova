import { check } from '../http/userAPI.js'

export const isLogin = async () => {
    const loggined = await check().then(data => data);
    
    return loggined
}