import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Signup() {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '', pseudo: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(formData.email, formData.password, formData.pseudo);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Devenir Membre du Loup</h2>
            {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="pseudo" type="text" placeholder="Pseudo" onChange={handleChange} className="w-full p-2 border rounded" required />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" required />
                <input name="password" type="password" placeholder="Mot de passe" onChange={handleChange} className="w-full p-2 border rounded" required />
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">S'inscrire</button>
            </form>
            <p className="text-center mt-4 text-sm">Déjà un compte ? <Link to="/login" className="text-primary font-bold">Connexion</Link></p>
        </div>
    );
}

export default Signup;