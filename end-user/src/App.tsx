import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './pages/Home';
import MainLayout from './layouts/MainLayout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Reset from './pages/auth/Reset';
import { ProtectedRoutes } from './utils/AuthProtectedRoutes';
import { UnauthorProtectRoute } from './utils/UnauthorProtectRoute';
import { Inbox } from './pages/Inbox';
import { Profile } from './pages/Profile';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<ProtectedRoutes />}>
                    <Route element={<MainLayout />}>
                        <Route index element={<Home />} />
                        <Route path='/inbox' element={<Inbox />} />
                        <Route path='/:username' element={<Profile />} />
                    </Route>
                </Route>

                <Route element={<UnauthorProtectRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/reset" element={<Reset />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
