import axios from "axios";

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

export const checkAndRefreshToken = async () => {
    const tokenTimestamp = getTokenTimestamp();

    if (tokenTimestamp) {
        const lastAuthTime = tokenTimestamp;
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - lastAuthTime;
        const oneDayInMillis = 24 * 60 * 60 * 1000;

        if (timeDifference > oneDayInMillis) {
            const refreshToken = getToken(true);
            if (refreshToken) {
                try {
                    const headers = {
                        Authorization: `Bearer ${refreshToken}`
                    };

                    const response = await axios.post('http://localhost:8080/api/v1/auth/refresh-token', {}, {
                        headers,
                    });

                    if (response.status === 200) {
                        const data = response.data;
                        saveToken(data.access_token);
                        localStorage.setItem('token-timestamp', new Date().getTime().toString());
                    } else {
                        console.error('Failed to refresh access token.');
                        // Возможно, здесь нужно выполнить logout, если обновление не удалось
                    }
                } catch (error) {
                    console.error('Error during token refresh:', error);
                    // Возможно, здесь нужно выполнить logout, если обновление не удалось
                }
            }
        }
    }
};
