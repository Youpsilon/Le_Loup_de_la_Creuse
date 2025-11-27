import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setError("Identifiants incorrects (ou complot bancaire).");
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Accès Investisseur</h2>
            {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" required />
                <input name="password" type="password" placeholder="Mot de passe" onChange={handleChange} className="w-full p-2 border rounded" required />
                <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-blue-700">Se connecter</button>
            </form>
            <p className="text-center mt-4 text-sm">Pas de compte ? <Link to="/signup" className="text-primary font-bold">Créer un compte</Link></p>
        </div>
    );
}

export default Login;