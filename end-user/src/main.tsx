import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Toaster } from './components/ui/toaster.tsx';
import { Loading } from './components/Loading.tsx';
import PostModalProvider from './context/PostModalProvider.tsx';
import { TooltipProvider } from './components/ui/tooltip.tsx';
import { ToastContainer } from 'react-toastify';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <PostModalProvider>
            <TooltipProvider>
                <Suspense fallback={<Loading />}>
                    <App />
                    <Toaster />
                    <ToastContainer />
                </Suspense>
            </TooltipProvider>
        </PostModalProvider>
    </React.StrictMode>,
);
