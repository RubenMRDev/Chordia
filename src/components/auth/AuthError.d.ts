import type React from "react";
interface AuthErrorProps {
    error: string | null;
    onDismiss: () => void;
}
export declare const AuthError: React.FC<AuthErrorProps>;
export {};
