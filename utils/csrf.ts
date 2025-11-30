import { v4 as uuidv4 } from 'uuid';

const CSRF_TOKEN_KEY = 'csrf_token';

export const generateCSRFToken = (): string => {
    const token = uuidv4();
    sessionStorage.setItem(CSRF_TOKEN_KEY, token);
    return token;
};

export const getCSRFToken = (): string | null => {
    return sessionStorage.getItem(CSRF_TOKEN_KEY);
};

export const validateCSRFToken = (token: string): boolean => {
    const storedToken = getCSRFToken();
    return storedToken === token;
};
