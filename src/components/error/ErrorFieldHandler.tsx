import React from "react";
import './Error.css'

interface Violation {
    fieldName: string;
    message: string;
}

interface ErrorHandlerProps {
    violations: Violation[];
    auth: boolean;
}

const ErrorFieldHandler: React.FC<ErrorHandlerProps> = ({violations, auth}) => {
    return (
        <>
            {auth ? (
                <div className={"auth"}>
                    <h3>Error</h3>
                    <ul className={"errors"}>
                        {violations.map((violation, index) => (
                            <li key={index}>{violation.message}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>
                    <h3>Error</h3>
                    <ul className={"errors"}>
                        {violations.map((violation, index) => (
                            <li key={index}>{violation.message}</li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default ErrorFieldHandler;
