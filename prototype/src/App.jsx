import * as React from "react";
import {
  CssBaseline,
  ThemeProvider,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Dashboard from "./screens/dashboard.jsx";

// Simple built-in theme (no separate file)
import { createTheme } from "@mui/material/styles";
import RequestList from "./components/request-list";
import { EditableRequestPage } from "./screens/EditableRequestPage";
import { RequestProvider } from "./context/RequestsContext";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
const theme = createTheme({
  palette: {
    primary: { main: "#0062a3" },
    secondary: { main: "#00a39a" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily:
      "'Inter', system-ui, -apple-system, Segoe UI, Roboto, Arial, 'Noto Sans', 'Helvetica Neue', sans-serif",
    h5: { fontWeight: 700 },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RequestProvider>
        {/* Top Navigation Bar */}
        <AppBar position="sticky" color="primary" enableColorOnDark>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              AOZ – Krisenmanagement
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Rolle: Krisenstab
            </Typography>
          </Toolbar>
        </AppBar>
        <Router>
          <Box component="main" sx={{ py: 3 }}>
            <Container sx={{ pt: 4, minHeight: "100vh", minWidth: "100vw" }}>
              <Routes>
                <Route path="/" element={<></>} />
                <Route path="/stab" element={<Dashboard />} />
                <Route path="/requests" element={<RequestList />} />
                <Route path="/request/:id" element={<EditableRequestPage />} />
              </Routes>
            </Container>
          </Box>
        </Router>
      </RequestProvider>
    </ThemeProvider>
  );
}
