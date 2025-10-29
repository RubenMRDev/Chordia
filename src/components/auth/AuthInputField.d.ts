import type React from "react";
import { IconType } from "react-icons";
interface AuthInputFieldProps {
    icon: IconType;
    type: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
}
export declare const AuthInputField: React.FC<AuthInputFieldProps>;
export {};
