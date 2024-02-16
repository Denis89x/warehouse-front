import React from "react";
import './Error.css'

interface Error {
    message: string
}

export const AuthError: React.FC<Error> = ({ message }) => {
    return (
        <div>
            <h3>Error</h3>
            <ul className={"errors"}>
                {message}
            </ul>
        </div>
    );
};