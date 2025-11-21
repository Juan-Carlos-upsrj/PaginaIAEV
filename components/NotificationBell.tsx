import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Notification } from '../types';

const NotificationBell: React.FC<{ notifications: Notification[]; onMarkAsRead: (id: number) => void; onMarkAllAsRead: () => void; }> = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="relative p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-iaev-blue transition-colors duration-200"
                aria-label="Ver notificaciones"
            >
                <ion-icon name="notifications-outline" class="w-6 h-6"></ion-icon>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full iaev-red text-xs font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200" role="menu" aria-orientation="vertical">
                    <div className="py-1">
                        <div className="px-4 py-2 flex justify-between items-center border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-800">Notificaciones</h3>
                            <button onClick={onMarkAllAsRead} className="text-xs text-iaev-blue hover:underline">Marcar todas como leídas</button>
                        </div>
                        <ul className="max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map(notification => (
                                    <li key={notification.id}>
                                        <button
                                            className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 flex items-start gap-3 transition-colors duration-150"
                                            onClick={() => onMarkAsRead(notification.id)}
                                        >
                                            {!notification.read && <div className="w-2 h-2 rounded-full iaev-blue mt-1.5 flex-shrink-0"></div>}
                                            <span className={notification.read ? 'opacity-60 ml-5' : ''}>{notification.message}</span>
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-8 text-center text-sm text-gray-500">
                                    No tienes notificaciones.
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;