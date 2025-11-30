import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface CalendarEvent {
    id: number;
    title: string;
    date: Date;
    type: 'assignment' | 'quiz' | 'class';
    course: string;
}

const CalendarPage: React.FC = () => {
    const { user } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());

    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const API_URL = import.meta.env.BASE_URL + 'api';

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch(`${API_URL}/student.php?action=get_calendar_events`);
            const data = await res.json();
            if (data.success) {
                const formattedEvents = data.events.map((e: any) => ({
                    ...e,
                    date: new Date(e.date)
                }));
                setEvents(formattedEvents);
            }
        } catch (error) {
            console.error("Failed to fetch events", error);
        }
    };

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getEventsForDay = (day: number) => {
        return events.filter(e => e.date.getDate() === day && e.date.getMonth() === currentDate.getMonth() && e.date.getFullYear() === currentDate.getFullYear());
    };

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    if (!user) return null;

    return (
        <div className="min-h-screen bg-transparent pb-20">
            <header className="sticky top-4 z-50 mx-4 mb-8 rounded-2xl glass shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-4">
                            <a href="/dashboard" className="p-2 rounded-xl hover:bg-blue-50 text-blue-600 transition-colors">
                                <ion-icon name="arrow-back-outline" class="w-6 h-6"></ion-icon>
                            </a>
                            <h1 className="text-2xl font-bold text-gray-800">Calendario Académico</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <ion-icon name="chevron-back-outline"></ion-icon>
                            </button>
                            <h2 className="text-xl font-bold text-gray-800 w-40 text-center">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h2>
                            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <ion-icon name="chevron-forward-outline"></ion-icon>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="glass rounded-2xl p-6">
                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 mb-4">
                        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                            <div key={day} className="text-center font-bold text-gray-500 text-sm uppercase tracking-wider py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2 sm:gap-4">
                        {/* Empty slots for previous month */}
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} className="h-24 sm:h-32 bg-gray-50/50 rounded-xl"></div>
                        ))}

                        {/* Days */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dayEvents = getEventsForDay(day);
                            const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();

                            return (
                                <div key={day} className={`h-24 sm:h-32 bg-white/60 border border-white/50 rounded-xl p-2 transition-all hover:shadow-md overflow-y-auto custom-scrollbar ${isToday ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-500 text-white' : 'text-gray-700'}`}>
                                            {day}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        {dayEvents.map(event => (
                                            <div key={event.id} className={`text-[10px] sm:text-xs p-1.5 rounded-lg border truncate ${event.type === 'assignment' ? 'bg-red-50 text-red-700 border-red-100' :
                                                event.type === 'quiz' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                    'bg-blue-50 text-blue-700 border-blue-100'
                                                }`} title={event.title}>
                                                {event.title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-6 flex gap-6 justify-center">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm text-gray-600">Entregas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm text-gray-600">Exámenes</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-gray-600">Clases en Vivo</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CalendarPage;
