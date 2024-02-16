import React, {ReactNode} from "react";
import './Button.css'

interface ButtonProps {
    children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({children}) => {
    return (
        <button className={"confirm-btn"}>{children}</button>
    );
};