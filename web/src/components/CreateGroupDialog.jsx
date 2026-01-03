import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Box, Chip
} from '@mui/material';

export default function CreateGroupDialog({ open, onClose, currentUser, onGroupCreated }) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = async () => {
        if (!name) return;

        try {
            const res = await fetch('http://localhost:3000/api/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    group_name: name,
                    category: category || 'General',
                    created_by: currentUser.id
                })
            });

            const data = await res.json();
            if (res.ok) {
                // Add creator as a member immediately
                await fetch(`http://localhost:3000/api/groups/${data.id}/members`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: currentUser.id })
                });

                if (onGroupCreated) onGroupCreated(data);
                onClose();
            } else {
                alert('Failed to create group');
            }
        } catch (e) {
            console.error(e);
            alert('Error creating group');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ color: 'info.main', fontWeight: 'bold' }}>
                Create New Group
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Group Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        autoFocus
                        placeholder="e.g., Goa Trip, Flat 101"
                    />
                    <TextField
                        label="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        fullWidth
                        placeholder="e.g., Trip, Rent, Food"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="secondary">
                    Create Group
                </Button>
            </DialogActions>
        </Dialog>
    );
}
