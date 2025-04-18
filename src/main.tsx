import React from 'react';
import ReactDOM from 'react-dom/client';
import ThemeConfig from './theme-config.tsx';
import './index.css';
import './i18n.js';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeConfig />
    </React.StrictMode>,
)
