import {Header} from "../header/Header";
import {Link, useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {getToken} from "../../utils/auth";
import axios from "axios";
import ErrorFieldHandler from "../error/ErrorFieldHandler";

interface ProfileFormData {
    currentPassword: string;
    newPassword: string;
}

interface Violation {
    fieldName: string;
    message: string;
}

export const ProfilePage = () => {
    const navigate = useNavigate();
    const [violations, setViolations] = useState<Violation[]>([]);

    const [profileFormData, setProfileFormData] = useState<ProfileFormData>({
        currentPassword: '',
        newPassword: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof ProfileFormData) => {
        setProfileFormData({...profileFormData, [field]: e.target.value});
    };

    const handleEditProfile = async () => {
        try {
            const token = getToken();

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const response = await axios.patch(`http://localhost:8080/api/v1/profiles/change-password`, profileFormData, {
                headers,
            });

            if (response.status === 200) {
                navigate("/order")
            }
        } catch (error: any) {
            setViolations([{fieldName: 'Password', message: error.response.data}])
            console.error("vio;: " + violations)
        }
    };

    return (
        <div className={"main-page"}>
            <Header/>
            <div className={"create-block"}>
                <div className={"back"}>
                    <Link to={"/order"}>
                        <button className={"back-btn"}>
                            <div className={"back-btn-inside"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth={1.5} d="M20 12H4m0 0l6-6m-6 6l6 6"></path>
                                </svg>
                                <span>Back</span>
                            </div>
                        </button>
                    </Link>
                </div>
                {violations.length > 0 && <ErrorFieldHandler violations={violations} auth={false}/>}
                <div className={"form"}>
                    <form action="">
                        <div className={"link-header"}>
                            <p>
                                <Link to={"/order"}>
                                    Profile
                                </Link>
                                &gt; Edit
                            </p>
                            <div className={"link-btn"}>
                                <h3>Edit Profile</h3>
                                <button onClick={handleEditProfile} type={"button"} className={"button"}>
                                    Edit
                                </button>
                            </div>
                        </div>
                        <div className={"crud-form"}>
                            <label htmlFor="currentPassword">Current password</label>
                            <input
                                id={"currentPassword"}
                                type="text"
                                required
                                placeholder={"Current password"}
                                value={profileFormData.currentPassword}
                                onChange={(e) => handleInputChange(e, 'currentPassword')}
                            />
                        </div>
                        <div className={"crud-form"}>
                            <label htmlFor="newPassword">New password</label>
                            <input
                                id={"newPassword"}
                                type="text"
                                required
                                placeholder={"New password"}
                                value={profileFormData.newPassword}
                                onChange={(e) => handleInputChange(e, 'newPassword')}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};