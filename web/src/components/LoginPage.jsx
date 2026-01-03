```
import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Container, TextField, Alert } from '@mui/material';
import logo from '../assets/logo.png';

export default function LoginPage({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', upi: '' });
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // For this demo, "Login" is just enter phone number to find user
    // In real app, this would be OTP
    if (!formData.phone) return;
    
    try {
        // Search by phone (simulated by fetching all or specific - backend needs search)
        // Since we don't have search API, let's just attempt to GET by ID or sim loop
        // For MVP: "Login" just tries to register or warns. 
        // actually, let's just make it a "Create/Enter" flow.
        
        // Let's stick to "Register" for the user request of "creating a user".
        if (!isRegistering) {
            setIsRegistering(true); // Switch to register mode if trying to login (simplification)
            return;
        }

        const res = await fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: formData.name,
                phone_number: formData.phone,
                upi_id: formData.upi || 'test@upi',
                avatar_url: 'https://via.placeholder.com/150'
            })
        });
        
        const data = await res.json();
        if (res.ok) {
            onLogin(data);
        } else {
            setError(data.error || 'Login failed');
        }
    } catch (e) {
        setError(e.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
    }}>
      <Paper elevation={3} sx={{ 
          p: 5, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 4,
          borderTop: '6px solid #FF9933',
          width: '100%'
      }}>
        <Box sx={{ mb: 2 }}>
            <img src={logo} alt="EasySplit Logo" style={{ maxWidth: '80px' }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: '800', color: 'info.main', mb: 1 }}>
            EasySplit <span style={{ color: '#FF9933' }}>🇮🇳</span>
        </Typography>
        
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

        <Box sx={{ width: '100%', mt: 2 }}>
            {isRegistering && (
                <TextField 
                    label="Full Name" 
                    fullWidth 
                    margin="normal" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
            )}
            <TextField 
                label="Phone Number" 
                fullWidth 
                margin="normal" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
            {isRegistering && (
                <TextField 
                    label="UPI ID (Optional)" 
                    fullWidth 
                    margin="normal" 
                    value={formData.upi}
                    onChange={(e) => setFormData({...formData, upi: e.target.value})}
                />
            )}
            
            <Button 
                variant="contained" 
                fullWidth 
                size="large"
                onClick={handleLogin}
                sx={{ mt: 3, bgcolor: '#FF9933', '&:hover': { bgcolor: '#E68A00' } }}
            >
                {isRegistering ? 'Create Account' : 'Login / Register'}
            </Button>
            
            {!isRegistering && (
                <Button 
                    fullWidth 
                    sx={{ mt: 1 }} 
                    onClick={() => setIsRegistering(true)}
                >
                    New User? Create Account
                </Button>
            )}
            {isRegistering && (
                <Button 
                     fullWidth 
                     sx={{ mt: 1 }} 
                     onClick={() => setIsRegistering(false)}
                 >
                     Back to Login
                 </Button>
            )}
        </Box>
      </Paper>
    </Container>
  );
}
```
