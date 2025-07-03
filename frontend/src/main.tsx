import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import App from './App.tsx';
import { Loading } from './components/Loading.tsx';
import { Toaster } from './components/ui/toaster.tsx';
import { TooltipProvider } from './components/ui/tooltip.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
            <TooltipProvider>
                <Suspense fallback={<Loading />}>
                    <App />
                    <Toaster />
                    <ToastContainer />
                </Suspense>
            </TooltipProvider>
    </React.StrictMode>,
);
