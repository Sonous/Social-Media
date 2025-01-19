import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './pages/Home';
import MainLayout from './layouts/MainLayout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Reset from './pages/auth/Reset';
import { ProtectedRoutes } from './utils/ProtectedRoutes';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<ProtectedRoutes />}>
                    <Route element={<MainLayout />}>
                        <Route index element={<Home />} />
                    </Route>
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reset" element={<Reset />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
