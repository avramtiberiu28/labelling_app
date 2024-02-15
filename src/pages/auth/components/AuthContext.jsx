// AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import {useNavigate} from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [isLoggedIn, setLoggedIn] = useState(localStorage.getItem('loggedin') === 'true');
    const login = (token, username, id_societate, id_locatie, nume, prenume, VA, admin, id_user) => {
        setLoggedIn(true);
        localStorage.setItem('loggedin', 'true');
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('id_societate', id_societate)
        localStorage.setItem('id_locatie', id_locatie);
        localStorage.setItem('nume', nume);
        localStorage.setItem('prenume', prenume);
        localStorage.setItem('VA', VA);
        localStorage.setItem('admin', admin)
        localStorage.setItem('id_user', id_user)
        // Poți face și alte operații legate de autentificare aici, dacă este necesar
        navigate('/home');
        //return (<Navigate to={'/home'}/>)
    };

    const logout = () => {
        setLoggedIn(false);
        localStorage.clear();
        navigate('/login');
    };
    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
