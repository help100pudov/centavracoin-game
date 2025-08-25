// src/composables/useAuth.js
export function useAuth() {
    const getToken = () => localStorage.getItem('jwt') || window.token || '';
    const isAuthorized = () => !!getToken();
    const getAuthHeaders = () => {
        const token = getToken();
        return token ? { 'Authorization': 'Bearer ' + token } : {};
    };
    return { getToken, isAuthorized, getAuthHeaders };
} 