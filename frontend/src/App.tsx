import { BrowserRouter, Route, Routes } from 'react-router';
import AccountLayout from './layouts/AccountLayout';
import MainLayout from './layouts/MainLayout';
import Login from './pages/auth/Login';
import Reset from './pages/auth/Reset';
import Signup from './pages/auth/Signup';
import Home from './pages/Home';
import ChatRoom from './pages/inbox/ChatRoom';
import { Inbox } from './pages/inbox/Inbox';
import NotFound from './pages/NotFound';
import PostDetail from './pages/PostDetail';
import Posts from './pages/profile/Posts';
import { Profile } from './pages/profile/Profile';
import Saved from './pages/profile/Saved';
import EditProfile from './pages/setting/EditProfile';
import { UnauthorProtectRoutes } from './utils/UnauthorProtectRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/inbox" element={<Inbox />}>
                        <Route path=":roomId" element={<ChatRoom />} />
                    </Route>
                    <Route path="/:username" element={<Profile />}>
                        <Route index element={<Posts />} />
                        <Route path="saved" element={<Saved />} />
                    </Route>
                    <Route path="/accounts" element={<AccountLayout />}>
                        <Route index element={<NotFound />} />
                        <Route path="edit" element={<EditProfile />} />
                    </Route>
                    <Route path="/not-found" element={<NotFound />} />

                    <Route path="/p/:postId" element={<PostDetail />} />
                    <Route path="*" element={<NotFound />} />
                </Route>

                <Route element={<UnauthorProtectRoutes />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/reset" element={<Reset />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
