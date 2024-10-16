// pages/api/socket/index.js
import { Server } from 'socket.io';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { storedb } from '@/config/config';

export default function handler(req, res) {
    if (res.socket.server.io) {
        console.log('Socket is already running');
        res.end();
        return;
    }

    const io = new Server(res.socket.server);

    io.on('connection', (socket) => {
        console.log('New client connected');

        // When a user connects
        socket.on('registerUser', async (userId) => {
            socket.join(userId); // Join a room based on user ID
            await updateDoc(doc(storedb, 'users', userId), {
                isOnline: true,
                lastLogin: serverTimestamp(),
            });
        });

        // When a user disconnects
        socket.on('disconnect', async () => {
            console.log('Client disconnected');
            // Update user's online status to false
            const userId = socket.id; // Assuming socket ID is the user ID; adjust as necessary
            await updateDoc(doc(storedb, 'users', userId), {
                isOnline: false,
            });
        });

        // Handle typing notifications
        socket.on('typing', (userId) => {
            socket.broadcast.emit('userTyping', userId); // Broadcast typing event to other users
        });
    });

    res.socket.server.io = io;
    res.end();
}
