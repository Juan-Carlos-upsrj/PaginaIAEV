import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { loginSchema, sanitizeInput } from '../utils/validation';
import { z } from 'zod';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormErrors({});

        try {
            // Validate input
            const validatedData = loginSchema.parse({
                email: sanitizeInput(email),
                password: password, // Do not sanitize password
                name: isRegistering ? sanitizeInput(name) : undefined
            });

            // Simulate login/register
            const userName = validatedData.name || validatedData.email.split('@')[0];
            login(validatedData.email, userName);

            // Redirect based on role
            const isStudent = /^\d/.test(validatedData.email);
            if (isStudent) {
                navigate('/dashboard');
            } else {
                navigate('/admin');
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors: Record<string, string> = {};
                // Safety check for error.errors
                if (error.errors && Array.isArray(error.errors)) {
                    error.errors.forEach(err => {
                        if (err.path[0]) {
                            errors[err.path[0] as string] = err.message;
                        }
                    });
                }
                setFormErrors(errors);
            } else {
                console.error("Login error:", error);
                alert("Ocurrió un error al iniciar sesión.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/50 dark:border-gray-700 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="text-center mb-8">
                        <div className="mb-6 transform hover:scale-105 transition-transform duration-300 inline-block">
                            <span className="text-5xl font-extrabold flex tracking-tight drop-shadow-sm">
                                <span className="text-blue-600">I</span>
                                <span className="text-yellow-500">A</span>
                                <span className="text-green-500">E</span>
                                <span className="text-red-500">V</span>
                                <span className="text-gray-800 dark:text-white ml-2">SITE</span>
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Bienvenido</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Ingresa tus credenciales para continuar</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {isRegistering && (
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Completo</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${formErrors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
                                    placeholder="Tu nombre"
                                />
                                {formErrors.name && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                                )}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Institucional</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${formErrors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
                                placeholder="ej. 0000123@alumno.iaev.mx"
                            />
                            {formErrors.email && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Alumnos: Usar matrícula (ej. 0000...) | Docentes: Usar correo (ej. nombre@...)
                            </p>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${formErrors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
                                placeholder="••••••••"
                            />
                            {formErrors.password && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                            )}
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
                            onClick={() => {
                                setIsRegistering(!isRegistering);
                                setFormErrors({});
                            }}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors"
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