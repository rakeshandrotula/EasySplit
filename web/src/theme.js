import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#FF9933', // Saffron
            light: '#ffca6c',
            dark: '#c76a00',
            contrastText: '#fff',
        },
        secondary: {
            main: '#138808', // India Green
            light: '#4cba3d',
            dark: '#005a00',
            contrastText: '#fff',
        },
        info: {
            main: '#000080', // Navy Blue (Ashoka Chakra)
        },
        error: {
            main: '#d32f2f',
        },
        background: {
            default: '#f8f9fa',
            paper: '#ffffff', // White
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h5: {
            fontWeight: 600,
            color: '#000080', // Blue headers
        },
        h6: {
            fontWeight: 700,
        },
        button: {
            textTransform: 'none',
            fontWeight: 700,
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    color: '#000080', // Blue text on white appbar
                    borderBottom: '4px solid #FF9933', // Saffron border
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: 'none',
                },
                containedPrimary: {
                    color: '#fff',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    borderTop: '4px solid #138808', // Green border top hint
                },
            },
        },
    },
});

export default theme;
