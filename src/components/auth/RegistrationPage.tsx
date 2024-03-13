import React, {useState} from "react";
import './Auth.css'
import axios from "axios";
import {saveToken} from "../../utils/auth";
import {useNavigate} from 'react-router-dom';

interface RegistrationPageProps {
    handleLoginClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

interface RegistrationFormData {
    username: string;
    password: string;
    email: string;
}

interface Violation {
    fieldName: string;
    message: string;
}

interface RegistrationPageProps {
    handleLoginClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
    handleValidationErrors: (hasErrors: boolean) => void;
    handleViolations: (violation: Violation[]) => void;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({handleLoginClick, handleValidationErrors, handleViolations}) => {
    const navigate = useNavigate();
    const [violations, setViolations] = useState<Violation[]>([]);

    const [registrationFormData, setRegistrationFormData] = useState<RegistrationFormData>({
        username: '',
        password: '',
        email: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof RegistrationFormData) => {
        setRegistrationFormData({...registrationFormData, [field]: e.target.value});
    };

    const handleRegistration = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/v1/auth/register', registrationFormData);

            if (response.status === 200) {
                const data = response.data;

                if ('access_token' in data && 'refresh_token' in data) {
                    saveToken(data.access_token);
                    saveToken(data.refresh_token, true);

                    navigate('/type');
                } else {
                    console.error('Access token or refresh token not found in response.');
                }
            } else {
                console.error('Registration failed.');
            }
        } catch (error: any) {
            if (error.response && error.response.data.violations) {
                setViolations(error.response.data.violations);
                handleValidationErrors(true);
                handleViolations(error.response.data.violations);
            } else {
                setViolations([{fieldName: '', message: 'An error occurred.'}]);
                handleValidationErrors(true);
                handleViolations(error.response.data.violations);
            }
        }
    };

    return (
        <div className="form-box register">
            <form action="">
                <h2>Sign Up</h2>
                <div className="input-box">
                    <span className="icon"><i className='bx bxs-user'></i></span>
                    <input
                        type="text"
                        required
                        value={registrationFormData.username}
                        onChange={(e) => handleInputChange(e, 'username')}
                    />
                    <label>Username</label>
                </div>
                <div className="input-box">
                    <span className="icon"><i className='bx bxs-envelope'></i></span>
                    <input
                        type="text"
                        required
                        value={registrationFormData.email}
                        onChange={(e) => handleInputChange(e, 'email')}
                    />
                    <label>Email</label>
                </div>
                <div className="input-box">
                    <span className="icon"><i className='bx bxs-lock-alt'></i></span>
                    <input
                        type="password"
                        required
                        value={registrationFormData.password}
                        onChange={(e) => handleInputChange(e, 'password')}
                    />
                    <label>Password</label>
                </div>
                <div className="remember-password">
                    <label htmlFor=""><input type="checkbox"/>I agree with this statement</label>
                </div>
                <button className="btn" onClick={handleRegistration} type={"button"}>Sign Up</button>
                <div className="create-account">
                    <p>Already Have An Account? <a href="#" className="login-link"
                                                   onClick={handleLoginClick}>Sign In</a></p>
                </div>
            </form>
        </div>
    );
};

export default RegistrationPage;