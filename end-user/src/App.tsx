import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './pages/Home';
import MainLayout from './layouts/MainLayout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Reset from './pages/auth/Reset';
import { ProtectedRoutes } from './utils/AuthProtectedRoutes';
import { UnauthorProtectRoute } from './utils/UnauthorProtectRoute';
import { Inbox } from './pages/Inbox';
import { Profile } from './pages/profile/Profile';
import Posts from './pages/profile/Posts';
import Saved from './pages/profile/Saved';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<ProtectedRoutes />}>
                    <Route element={<MainLayout />}>
                        <Route index element={<Home />} />
                        <Route path="/inbox" element={<Inbox />} />
                        <Route path="/:username" element={<Profile />} >
                            <Route index element={<Posts />} />
                            <Route path="saved" element={<Saved />} />
                        </Route>
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
