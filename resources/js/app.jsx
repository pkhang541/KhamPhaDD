import '../css/app.css';
import './bootstrap';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { GoogleOAuthProvider } from '@react-oauth/google';

const appName = import.meta.env.VITE_APP_NAME || 'KhamPhaDD Journal';

createInertiaApp({
    title: (title) => `${title} — ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <GoogleOAuthProvider clientId="339221242828-eve7duoveticjaefet2e6cnfleh0j7l0.apps.googleusercontent.com">
                <App {...props} />
            </GoogleOAuthProvider>
        );
    },
    progress: {
        color: '#1B3022',
    },
});
