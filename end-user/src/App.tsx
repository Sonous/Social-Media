import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './pages/Home';
import MainLayout from './layouts/MainLayout';
import Login from './pages/account/Login';
import Signup from './pages/account/Signup';
import Reset from './pages/account/Reset';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route index element={<Home />} />
                </Route>

                <Route path="/account/login" element={<Login />} />
                <Route path="/account/signup" element={<Signup />} />
                <Route path="/account/reset" element={<Reset />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
