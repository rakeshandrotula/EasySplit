import { useState, useEffect } from 'react'
import { AppBar, Toolbar, Typography, Container, Box, Button, Paper, Grid, Stack, Tabs, Tab, Avatar, IconButton } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout';
import AdminDashboard from './components/AdminDashboard';
import LoginDialog from './components/LoginDialog';
import AddExpenseDialog from './components/AddExpenseDialog';
import CreateGroupDialog from './components/CreateGroupDialog';
import LoginPage from './components/LoginPage';

function App() {
  const [tab, setTab] = useState(0);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Dashboard Metrics
  const [toPay, setToPay] = useState(0);
  const [toReceive, setToReceive] = useState(0);

  // Fetch balances when user changes or tab refreshes
  useEffect(() => {
    if (!currentUser) return;

    const fetchBalances = async () => {
      try {
        // Hack: Fetch settlements for Group 1 and filter for current user
        const res = await fetch('http://localhost:3000/api/groups/1/settlements');
        const settlements = await res.json();

        let pay = 0;
        let receive = 0;

        settlements.forEach(s => {
          if (s.from === String(currentUser.id)) pay += parseFloat(s.amount);
          if (s.to === String(currentUser.id)) receive += parseFloat(s.amount);
        });

        setToPay(pay);
        setToReceive(receive);

      } catch (e) {
        console.error(e);
      }
    };
    fetchBalances();
  }, [currentUser, tab]);


  if (!currentUser) {
    return <LoginPage onLogin={setCurrentUser} />;
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'background.default',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center' // Horizontally center the main content column
    }}>
      {/* AppBar spans full width */}
      <AppBar position="static" elevation={1} sx={{ width: '100%' }}>
        <Container maxWidth="md" disableGutters>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 800, color: 'info.main' }}>
              EasySplit <span style={{ color: '#FF9933' }}>🇮🇳</span>
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body1" sx={{ color: 'info.main', fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}>
                Hi, {currentUser.name.split(' ')[0]}
              </Typography>
              <IconButton onClick={() => setCurrentUser(null)} color="info">
                <LogoutIcon />
              </IconButton>
            </Stack>
          </Toolbar>
          <Box sx={{ bgcolor: 'white' }}>
            <Tabs value={tab} onChange={(e, v) => setTab(v)} centered textColor="primary" indicatorColor="primary">
              <Tab label="My Expenses" />
              <Tab label="Admin View" />
            </Tabs>
          </Box>
        </Container>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, flexGrow: 1, pb: 4 }}>
        {tab === 0 ? (
          <>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ color: 'info.main', fontWeight: 'bold' }}>
                My Dashboard
              </Typography>
            </Box>

            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, borderTop: '6px solid #FF9933', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" color="primary" gutterBottom>
                      To Pay (Debit)
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      ₹ {toPay.toFixed(2)}
                    </Typography>
                  </Box>
                  <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Settle Up (Saffron)
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, borderTop: '6px solid #138808', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" color="secondary" gutterBottom>
                      To Receive (Credit)
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                      ₹ {toReceive.toFixed(2)}
                    </Typography>
                  </Box>
                  <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }}>
                    Request Money (Green)
                  </Button>
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ mt: 6, p: 3, bgcolor: 'white', borderRadius: 2, textAlign: 'center', border: '1px solid #e0e0e0', mx: { xs: 0, sm: 4 } }}>
              <Typography variant="h6" sx={{ color: 'info.main', mb: 2 }}>
                Quick Actions
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  sx={{ bgcolor: 'info.main' }}
                  onClick={() => setAddExpenseOpen(true)}
                  fullWidth
                >
                  Add Expense (Blue)
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setCreateGroupOpen(true)}
                  fullWidth
                >
                  Create Group
                </Button>
              </Stack>
            </Box>
          </>
        ) : (
          <AdminDashboard />
        )}
      </Container>

      {currentUser && (
        <AddExpenseDialog
          open={addExpenseOpen}
          onClose={() => setAddExpenseOpen(false)}
          currentUser={currentUser}
        />
      )}

      {currentUser && (
        <CreateGroupDialog
          open={createGroupOpen}
          onClose={() => setCreateGroupOpen(false)}
          currentUser={currentUser}
          onGroupCreated={(group) => {
            alert(`Group "${group.group_name}" created!`);
          }}
        />
      )}
    </Box>
  )
}

export default App
