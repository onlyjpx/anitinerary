import { useState, useEffect } from 'react';
import { scheduleNotification } from '../hooks/scheduleNotification';

export const useMarkedItems = () => {
    const [markedItems, setMarkedItems] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('markedItems')) || {};
        } catch {
            return {};
        }
    });

    const markItem = async (item) => {
        const user = localStorage.getItem('user');
        const userEmail = user ? JSON.parse(user).email : null;
        if (!userEmail) {
            alert('Faça login para ativar notificações');
            return false;
        }

        try {
            const isMarked = !markedItems[item.mal_id];
            const newState = { ...markedItems };

            if (isMarked) {
                await scheduleNotification(item, userEmail);
                console.log('Notificação agendada no email:', userEmail);
                newState[item.mal_id] = {
                    marked: true,
                    date: new Date().toISOString()
                };
            } else {
                delete newState[item.mal_id];
            }

            localStorage.setItem('markedItems', JSON.stringify(newState));
            setMarkedItems(newState);
            return true;
        } catch (error) {
            console.error('Erro ao marcar item:', error);
            return false;
        }
    };

    const clearMarkedItems = () => {
        localStorage.removeItem('markedItems');
        setMarkedItems({});
    }


    useEffect(() => {
        const handler = () => {
            setMarkedItems(JSON.parse(localStorage.getItem('markedItems')) || {});
        };
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, []);

    return { markedItems, markItem, clearMarkedItems };
};