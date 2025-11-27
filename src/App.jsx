import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminSeed from './pages/AdminSeed';
import Profile from "./pages/Profile.jsx";

function App() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
            {/* La Navbar est en dehors du flux principal des pages */}
            <Navbar />

            {/* On enlève 'container' et 'px-4' ici pour permettre le full-width dans Home */}
            <div className="flex-1">
                <Routes>
                    <Route path="/" element={<Home />} />

                    {/* Pour les autres pages, on peut remettre un conteneur centré ici ou dans la page elle-même */}
                    <Route path="/create" element={<div className="container mx-auto px-4 py-8"><CreatePost /></div>} />
                    <Route path="/article/:id" element={<div className="container mx-auto px-4 py-8"><PostDetail /></div>} />
                    <Route path="/login" element={<div className="container mx-auto px-4 py-8"><Login /></div>} />
                    <Route path="/signup" element={<div className="container mx-auto px-4 py-8"><Signup /></div>} />
                    <Route path="/seed" element={<div className="container mx-auto px-4 py-8"><AdminSeed /></div>} />
                    <Route path="/profile" element={<div className="container mx-auto px-4 py-8"><Profile /></div>} />
                </Routes>
            </div>
        </div>
    );
}

export default App;