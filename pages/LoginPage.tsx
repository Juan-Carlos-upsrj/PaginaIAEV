import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple validation
        if (!email || !password) return alert('Por favor completa todos los campos');
        if (isRegistering && !name) return alert('Por favor ingresa tu nombre');

        // Simulate login/register
        const userName = name || email.split('@')[0];
        login(email, userName);

        // Redirect based on role
        const isStudent = /^\d/.test(email);
        if (isStudent) {
            navigate('/dashboard');
        } else {
            navigate('/admin');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-30"></div>

                <div className="relative z-10">
                    <div className="text-center mb-8">
                        <div className="mb-6 transform hover:scale-105 transition-transform duration-300 inline-block">
                            <span className="text-5xl font-extrabold flex tracking-tight drop-shadow-sm">
                                <span className="text-iaev-blue">I</span>
                                <span className="text-iaev-yellow">A</span>
                                <span className="text-iaev-green">E</span>
                                <span className="text-iaev-red">V</span>
                                <span className="text-white ml-2 drop-shadow-md">SITE</span>
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Bienvenido</h1>
                        <p className="text-blue-100 font-medium">Ingresa tus credenciales para continuar</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {isRegistering && (
                            <div>
                                <label className="block text-sm font-medium text-blue-100 mb-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="Tu nombre"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-blue-100 mb-1">Correo Institucional</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="ej. 0000123@alumno.iaev.mx"
                            />
                            <p className="text-xs text-blue-300 mt-1">
                                Alumnos: Usar matrícula (ej. 0000...) | Docentes: Usar correo (ej. nombre@...)
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-blue-100 mb-1">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all"
                        >
                            {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="text-sm text-blue-200 hover:text-white transition-colors"
                        >
                            {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;