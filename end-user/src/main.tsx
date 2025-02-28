import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { Toaster } from './components/ui/toaster.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Loading } from './components/Loading.tsx';
import PostModalProvider from './context/PostModalProvider.tsx';
import { TooltipProvider } from './components/ui/tooltip.tsx';
import { ToastContainer } from 'react-toastify';

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <PostModalProvider>
                    <TooltipProvider>
                        <Suspense fallback={<Loading />}>
                            <App />
                            <Toaster />
                            <ToastContainer />
                        </Suspense>
                    </TooltipProvider>
                </PostModalProvider>
            </QueryClientProvider>
        </Provider>
    </React.StrictMode>,
);
