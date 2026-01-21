import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    // Default to English, could check localStorage
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('appLanguage') || 'english';
    });

    useEffect(() => {
        localStorage.setItem('appLanguage', language);
        // We can also set a class on the body if we need specific fonts
        if (language === 'hindi') {
            document.body.classList.add('lang-hindi');
        } else {
            document.body.classList.remove('lang-hindi');
        }
    }, [language]);

    const toggleLanguage = (lang) => {
        if (lang) setLanguage(lang);
        else setLanguage(prev => prev === 'english' ? 'hindi' : 'english');
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
