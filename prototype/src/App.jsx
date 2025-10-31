// App.jsx
import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

import Dashboard from "./screens/dashboard.jsx";
import CategoryPage from "./screens/categoryPage.jsx";
import ItemDetailPage from "./screens/itemDetailPage.jsx";
import RequestList from "./components/request-list.jsx";
import { EditableRequestPage } from "./screens/EditableRequestPage.jsx";
import { RequestProvider } from "./context/RequestsContext.jsx";
import CentralStorage from "./pages/CentralStorage.jsx";
import OrgMaintenance from "./pages/OrgMaintenance.jsx";

export default function App() {
  return (
    <RequestProvider>
        <Box sx={{ width: "100vw", height: "100vh", overflowX: "hidden" }}>
          <AppBar position="static" sx={{ bgcolor: "primary.main" }}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                AOZ – Krisenmanagement
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Rolle: Krisenstab
              </Typography>
            </Toolbar>
          </AppBar>

          <Routes>
            <Route path="/stab" element={<Dashboard />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/item/:itemId" element={<ItemDetailPage />} />
            <Route path="/requests" element={<RequestList />} />
            <Route path="/request/:id" element={<EditableRequestPage />} />
            <Route path="/central" element={<CentralStorage />} />
            <Route path="/org" element={<OrgMaintenance />} />
          </Routes>
        </Box>
    </RequestProvider>
  );
}
