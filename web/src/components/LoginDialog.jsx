import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, MenuItem, TextField, Box, Typography
} from '@mui/material';

export default function LoginDialog({ open, onLogin }) {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');

    useEffect(() => {
        // Fetch real users for simulation
        const fetchUsers = async () => {
            try {
                // Quick hack: fetch individual users we know exist
                const u1 = await fetch('http://localhost:3000/api/users/1').then(r => r.json());
                const u2 = await fetch('http://localhost:3000/api/users/2').then(r => r.json());
                const u3 = await fetch('http://localhost:3000/api/users/3').then(r => r.json());
                const list = [u1, u2, u3].filter(u => u && u.id);
                setUsers(list);
            } catch (e) {
                console.error(e);
            }
        };
        fetchUsers();
    }, []);

    const handleLogin = () => {
        const user = users.find(u => u.id === selectedUser);
        if (user) onLogin(user);
    };

    return (
        <Dialog open={open} disableEscapeKeyDown>
            <DialogTitle sx={{ color: 'info.main', fontWeight: 'bold' }}>
                Login to EasySplit 🇮🇳
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 1, minWidth: 300 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Simulate login by selecting a user:
                    </Typography>
                    <TextField
                        select
                        fullWidth
                        label="Select User"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                    >
                        {users.map((user) => (
                            <MenuItem key={user.id} value={user.id}>
                                {user.name} ({user.phone_number})
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleLogin} variant="contained" disabled={!selectedUser}>
                    Login
                </Button>
            </DialogActions>
        </Dialog>
    );
}
