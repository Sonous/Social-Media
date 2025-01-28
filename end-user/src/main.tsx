import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { Toaster } from './components/ui/toaster.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Loading } from './components/Loading.tsx';

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <Suspense fallback={<Loading />}>
                    <App />
                    <Toaster />
                </Suspense>
            </QueryClientProvider>
        </Provider>
    </React.StrictMode>,
);
