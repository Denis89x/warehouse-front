import axios from "axios";
import {NavigateFunction, useNavigate} from "react-router-dom";

export const saveToken = (token: string, isRefreshToken: boolean = false) => {
    const tokenKey = isRefreshToken ? 'refresh-token' : 'token';
    localStorage.setItem(tokenKey, token);

    const timestampKey = isRefreshToken ? 'refresh-token-timestamp' : 'token-timestamp';
    localStorage.setItem(timestampKey, new Date().getTime().toString());
};

export const getTokenTimestamp = (isRefreshToken: boolean = false): number | null => {
    const timestampKey = isRefreshToken ? 'refresh-token-timestamp' : 'token-timestamp';
    const timestamp = localStorage.getItem(timestampKey);
    return timestamp ? parseInt(timestamp, 10) : null;
};

export const getToken = (isRefreshToken: boolean = false) => {
    const tokenKey = isRefreshToken ? 'refresh-token' : 'token';
    return localStorage.getItem(tokenKey);
};

export const removeToken = (isRefreshToken: boolean = false) => {
    const tokenKey = isRefreshToken ? 'refresh-token' : 'token';
    localStorage.removeItem(tokenKey);
};

export const checkAndRefreshToken = async (navigate: NavigateFunction) => {
    const tokenTimestamp = getTokenTimestamp();
    console.error("OKKKKKKKKKKKKKK")

    if (tokenTimestamp) {
        const lastAuthTime = tokenTimestamp;
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - lastAuthTime;
        const oneDayInMillis = 24 * 60 * 60 * 1000;

        if (timeDifference > oneDayInMillis) {
            const refreshToken = getToken(true);
            if (refreshToken) {
                try {
                    console.error("1")
                    const headers = {
                        Authorization: `Bearer ${refreshToken}`
                    };

                    console.error("2")
                    const response = await axios.post('http://localhost:8080/api/v1/auth/refresh-token', {}, {
                        headers,
                    });

                    console.error("3")
                    if (response.status === 200) {
                        const data = response.data;
                        saveToken(data.access_token);
                        localStorage.setItem('token-timestamp', new Date().getTime().toString());
                        console.error("4")
                    } else {
                        navigate('/auth')
                    }
                } catch (error) {
                    navigate('/auth')
                }
            }
        }
    }
};
