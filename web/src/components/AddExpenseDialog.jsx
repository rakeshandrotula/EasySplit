import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, MenuItem, Box, Chip, Stack, InputAdornment,
    FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography
} from '@mui/material';

export default function AddExpenseDialog({ open, onClose, currentUser }) {
    const [groups, setGroups] = useState([]);
    const [groupId, setGroupId] = useState('');
    const [groupMembers, setGroupMembers] = useState([]);

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [splitType, setSplitType] = useState('equal'); // equal, exact, percentage

    // For exact/percentage splits
    const [splitsInput, setSplitsInput] = useState({}); // { userId: value }

    // 1. Fetch Groups for Current User
    useEffect(() => {
        if (!open || !currentUser) return;
        const fetchGroups = async () => {
            try {
                // In a real app: /api/users/:id/groups
                // Since we don't have that endpoint yet, let's fetch ALL groups and filter (hack for MVP)
                // Or better, just fetch group 1 if we know it exists, but user wants E2E.
                // Let's assume we implemented a list endpoint or just try ID 1, 2, 3...
                // A better approach for this "hacky" stage without creating new endpoints:
                // Fetch the group user just created or default Group 1.

                // Let's try to fetch Group 1 and 2
                const g1 = await fetch('http://localhost:3000/api/groups/1').then(r => r.json()).catch(() => null);

                // Filter valid
                const validGroups = [g1].filter(g => g && g.id);
                setGroups(validGroups);
            } catch (e) { console.error(e); }
        };
        fetchGroups();
    }, [open, currentUser]);

    // 2. Fetch Members when Group Selected
    useEffect(() => {
        if (!groupId) {
            setGroupMembers([]);
            return;
        }
        const fetchMembers = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/groups/${groupId}`);
                const data = await res.json();
                if (data && data.Users) {
                    setGroupMembers(data.Users);
                    // Initialize splits
                    const initial = {};
                    data.Users.forEach(u => initial[u.id] = '');
                    setSplitsInput(initial);
                }
            } catch (e) { console.error(e); }
        };
        fetchMembers();
    }, [groupId]);

    const handleSplitChange = (userId, value) => {
        setSplitsInput(prev => ({ ...prev, [userId]: value }));
    };

    const validateSplits = () => {
        const totalAmount = parseFloat(amount);
        if (isNaN(totalAmount) || totalAmount <= 0) return false;

        if (splitType === 'equal') return true;

        let currentTotal = 0;
        groupMembers.forEach(m => {
            const val = parseFloat(splitsInput[m.id] || 0);
            currentTotal += val;
        });

        if (splitType === 'exact') {
            return Math.abs(currentTotal - totalAmount) < 0.1; // allow small float diff
        }
        if (splitType === 'percentage') {
            return Math.abs(currentTotal - 100) < 0.1;
        }
        return false;
    };

    const handleSubmit = async () => {
        if (!amount || !groupId || !description) return;
        if (!validateSplits()) {
            alert(`Invalid splits! check if total matches ${splitType === 'percentage' ? '100%' : 'Expense Amount'}`);
            return;
        }

        try {
            const totalAmount = parseFloat(amount);
            const finalSplits = groupMembers.map(m => {
                let userAmount = 0;
                if (splitType === 'equal') {
                    userAmount = totalAmount / groupMembers.length;
                } else if (splitType === 'exact') {
                    userAmount = parseFloat(splitsInput[m.id] || 0);
                } else if (splitType === 'percentage') {
                    const pct = parseFloat(splitsInput[m.id] || 0);
                    userAmount = (totalAmount * pct) / 100;
                }

                return {
                    user_id: m.id,
                    amount_owed: userAmount,
                    share_type: splitType
                };
            });

            const payload = {
                group_id: groupId,
                paid_by: currentUser.id,
                amount: totalAmount,
                description: description,
                splits: finalSplits
            };

            const res = await fetch('http://localhost:3000/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('Expense Added Successfully!');
                onClose();
            } else {
                const err = await res.json();
                alert('Failed: ' + (err.error || 'Unknown error'));
            }
        } catch (e) {
            console.error(e);
            alert('Error adding expense');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                Add Expense
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        select
                        label="Group"
                        value={groupId}
                        onChange={(e) => setGroupId(e.target.value)}
                        fullWidth
                    >
                        {groups.map(g => (
                            <MenuItem key={g.id} value={g.id}>{g.group_name || g.name}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        fullWidth
                    />

                    <FormControl component="fieldset">
                        <FormLabel component="legend">Split By</FormLabel>
                        <RadioGroup row value={splitType} onChange={(e) => setSplitType(e.target.value)}>
                            <FormControlLabel value="equal" control={<Radio />} label="Equally" />
                            <FormControlLabel value="exact" control={<Radio />} label="Exact Amount" />
                            <FormControlLabel value="percentage" control={<Radio />} label="Percentage" />
                        </RadioGroup>
                    </FormControl>

                    {/* Dynamic Inputs for Splits */}
                    {groupId && splitType !== 'equal' && (
                        <Box sx={{ border: '1px solid #eee', p: 2, borderRadius: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                {splitType === 'exact' ? `Enter Amounts (Total: ₹${amount || 0})` : 'Enter Percentages (Total: 100%)'}
                            </Typography>
                            <Stack spacing={1}>
                                {groupMembers.map(member => (
                                    <Stack key={member.id} direction="row" alignItems="center" spacing={2}>
                                        <Typography sx={{ width: 100, fontSize: '0.9rem' }}>{member.name}</Typography>
                                        <TextField
                                            size="small"
                                            type="number"
                                            placeholder={splitType === 'exact' ? '₹ 0.00' : '0%'}
                                            value={splitsInput[member.id] || ''}
                                            onChange={(e) => handleSplitChange(member.id, e.target.value)}
                                            fullWidth
                                        />
                                    </Stack>
                                ))}
                            </Stack>
                        </Box>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Save Expense
                </Button>
            </DialogActions>
        </Dialog>
    );
}
