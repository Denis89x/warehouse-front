import React, {useState} from "react";
import './Auth.css'
import axios from "axios";
import {saveToken} from "../../utils/auth";
import {useNavigate} from 'react-router-dom';

interface LoginPageProps {
    handleRegistrationClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
    handleValidationErrors: (hasErrors: boolean) => void;
    handleViolations: (violation: Violation[]) => void;
}

interface LoginFormData {
    username: string;
    password: string;
}

interface Violation {
    fieldName: string;
    message: string;
}

const LoginPage: React.FC<LoginPageProps> = ({handleRegistrationClick, handleValidationErrors, handleViolations}) => {
    const navigate = useNavigate();
    const [violations, setViolations] = useState<Violation[]>([]);

    const [loginFormData, setLoginFormData] = useState<LoginFormData>({
        username: '',
        password: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof LoginFormData) => {
        setLoginFormData({...loginFormData, [field]: e.target.value});
    };

    const handleLogin = async () => {
        try {
            console.error("123123")
            const response = await axios.post('http://localhost:8080/api/v1/auth/authenticate', loginFormData);

            console.error("124: " + response);

            if (response.status === 200) {
                const data = response.data;

                console.error("RESPONSE: " + response);

                if ('access_token' in data && 'refresh_token' in data) {
                    saveToken(data.access_token);
                    saveToken(data.refresh_token, true);

                    navigate('/type');
                } else {
                    console.error('Access token or refresh token not found in response.');
                    console.error("RESPONSE: " + response);
                }
            } else {
                console.error('LoginPage failed.');
                console.error("RESPONSE: " + response);
            }
        } catch (error: any) {
            setViolations([{fieldName: 'Username', message: error.response.data}])
            handleValidationErrors(true);
            handleViolations([{fieldName: 'Username', message: error.response.data}]);
        }
    };

    return (
        <div className="form-box login">
            <form action="">
                <h2>Sign In</h2>
                <div className="input-box">
                    <span className="icon"><i className='bx bxs-envelope'></i></span>
                    <input
                        type="text"
                        required
                        value={loginFormData.username}
                        onChange={(e) => handleInputChange(e, 'username')}
                    />
                    <label>Username</label>
                </div>
                <div className="input-box">
                    <span className="icon"><i className='bx bxs-lock-alt'></i></span>
                    <input
                        type="password"
                        required
                        value={loginFormData.password}
                        onChange={(e) => handleInputChange(e, 'password')}
                    />
                    <label>Password</label>
                </div>
                <div className="remember-password">
                    <label htmlFor=""><input type="checkbox"/>Remember Me</label>
                    <a href="#">Forget Password</a>
                </div>
                <button className="btn" onClick={handleLogin} type="button">Login In</button>
                <div className="create-account">
                    <p>Create A New Account? <a href="#" className="register-link"
                                                onClick={handleRegistrationClick}>Sign Up</a></p>
                </div>
            </form>
        </div>
    );
};

export default LoginPage