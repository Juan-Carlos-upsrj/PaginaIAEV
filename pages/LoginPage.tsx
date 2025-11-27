import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useAcademic } from '../context/AcademicContext';
import { loginSchema, sanitizeInput } from '../utils/validation';
import { z } from 'zod';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useUser();
    const { allowedEmails, createStudent, students } = useAcademic();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [cuatrimestre, setCuatrimestre] = useState(1);
    const [group, setGroup] = useState<'A' | 'B' | 'C' | 'D'>('A');

    // "isRegistering" now means "Completing Registration" for whitelisted students
    const [isRegistering, setIsRegistering] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormErrors({});
        setGeneralError(null);
        setSuccessMessage(null);

        try {
            // Basic validation
            if (!email || !password) {
                setGeneralError("Por favor ingresa correo y contraseña.");
                return;
            }

            // Check if it's a student email (starts with number) or teacher (starts with letter)
            const isStudentEmail = /^\d/.test(email);

            if (isStudentEmail) {
                // Student Logic
                if (!allowedEmails.includes(email)) {
                    setGeneralError("Este correo no está autorizado. Contacta al administrador.");
                    return;
                }

                const existingStudent = students.find(s => s.email === email);

                if (isRegistering) {
                    // Completing registration
                    if (existingStudent) {
                        setGeneralError("Ya existe una cuenta con este correo. Inicia sesión.");
                        setIsRegistering(false);
                        return;
                    }

                    if (!name) {
                        setFormErrors({ name: "El nombre es requerido." });
                        return;
                    }

                    // Create the student account
                    createStudent({
                        name: sanitizeInput(name),
                        email: sanitizeInput(email),
                        cuatrimestre,
                        group,
                        avatar: `https://ui-avatars.com/api/?name=${name}&background=random`
                    });

                    // Auto login
                    login(email, name);
                    navigate('/dashboard');

                } else {
                    // Login attempt
                    if (existingStudent) {
                        // Check password (mock check)
                        // In a real app we would check hash, here we just check if it matches what they typed
                        // For this demo, we assume if account exists and they are whitelisted, let them in if password is not empty
                        // Ideally we would store password in UserProfile but we don't for security in this demo
                        login(email, existingStudent.name);
                        navigate('/dashboard');
                    } else {
                        // Whitelisted but no account -> Prompt to register
                        setSuccessMessage("¡Alumno autorizado encontrado! Por favor completa tu registro.");
                        setIsRegistering(true);
                    }
                }

            } else {
                // Teacher/Admin Logic (Legacy/Mock)
                // Validate input using schema
                const validatedData = loginSchema.parse({
                    email: sanitizeInput(email),
                    password: password,
                    name: isRegistering ? sanitizeInput(name) : undefined
                });

                const userName = validatedData.name || validatedData.email.split('@')[0];
                login(validatedData.email, userName);
                navigate('/admin');
            }

        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors: Record<string, string> = {};
                const zodError = error;
                if (zodError.errors && Array.isArray(zodError.errors)) {
                    zodError.errors.forEach(err => {
                        if (err.path[0]) {
                            errors[err.path[0] as string] = err.message;
                        }
                    });
                }
                setFormErrors(errors);
                setGeneralError("Por favor corrige los errores en el formulario.");
            } else {
                console.error("Login error:", error);
                setGeneralError("Ocurrió un error inesperado.");
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
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {isRegistering ? 'Completar Registro' : 'Bienvenido'}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                            {isRegistering ? 'Configura tu cuenta de estudiante' : 'Ingresa tus credenciales para continuar'}
                        </p>
                    </div>

                    {generalError && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start">
                            <div className="flex-shrink-0">
                                <ion-icon name="alert-circle" class="text-red-500 text-xl"></ion-icon>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                                <div className="mt-1 text-sm text-red-700 dark:text-red-300">
                                    {generalError}
                                </div>
                            </div>
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-start">
                            <div className="flex-shrink-0">
                                <ion-icon name="checkmark-circle" class="text-green-500 text-xl"></ion-icon>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">¡Éxito!</h3>
                                <div className="mt-1 text-sm text-green-700 dark:text-green-300">
                                    {successMessage}
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {isRegistering && (
                            <>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Completo</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${formErrors.name ? 'border-red-500 ring-2 ring-red-500/20' : 'border-gray-200 dark:border-gray-600'}`}
                                        placeholder="Tu nombre"
                                    />
                                    {formErrors.name && (
                                        <p className="text-red-500 text-xs mt-1 font-medium flex items-center">
                                            <span className="mr-1">•</span> {formErrors.name}
                                        </p>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cuatrimestre</label>
                                        <select
                                            value={cuatrimestre}
                                            onChange={e => setCuatrimestre(Number(e.target.value))}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(q => (
                                                <option key={q} value={q}>{q}º</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grupo</label>
                                        <select
                                            value={group}
                                            onChange={e => setGroup(e.target.value as 'A' | 'B' | 'C' | 'D')}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                            <option value="C">C</option>
                                            <option value="D">D</option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Institucional</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${formErrors.email ? 'border-red-500 ring-2 ring-red-500/20' : 'border-gray-200 dark:border-gray-600'}`}
                                placeholder="ej. 0000123@alumno.iaev.mx"
                                disabled={isRegistering} // Lock email during registration completion
                            />
                            {formErrors.email && (
                                <p className="text-red-500 text-xs mt-1 font-medium flex items-center">
                                    <span className="mr-1">•</span> {formErrors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${formErrors.password ? 'border-red-500 ring-2 ring-red-500/20' : 'border-gray-200 dark:border-gray-600'}`}
                                placeholder="••••••••"
                            />
                            {formErrors.password && (
                                <p className="text-red-500 text-xs mt-1 font-medium flex items-center">
                                    <span className="mr-1">•</span> {formErrors.password}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all"
                        >
                            {isRegistering ? 'Finalizar Registro' : 'Continuar'}
                        </button>
                    </form>

                    {!isRegistering && (
                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                ¿Eres nuevo? Ingresa tu correo institucional autorizado arriba.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;