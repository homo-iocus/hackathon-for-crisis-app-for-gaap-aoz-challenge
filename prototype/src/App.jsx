import * as React from "react";
import { useMemo } from "react";
import { Routes, Route, NavLink, useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

import Dashboard from "./screens/dashboard.jsx";
import CategoryPage from "./screens/categoryPage.jsx";
import ItemDetailPage from "./screens/itemDetailPage.jsx";
import RequestList from "./components/request-list.jsx";
import { EditableRequestPage } from "./screens/EditableRequestPage.jsx";
import { RequestProvider } from "./context/RequestsContext.jsx";
import CentralStorage from "./pages/CentralStorage.jsx";
import OrgMaintenance from "./pages/OrgMaintenance.jsx";
import StartMenu from "./screens/StartMenu.jsx";

function getRoleMainPath(role) {
  switch (role) {
    case "Krisenstab":
      return "/stab";
    case "Autorisation":
      return "/requests";
    case "Gemeinde/Organisation":
      return "/org";
    default:
      return "/"; // Startmenü
  }
}

function NavLinkChip({ to, label }) {
  return (
    <Typography
      component={NavLink}
      to={to}
      style={{ textDecoration: "none", marginLeft: 8 }}
      className={({ isActive }) => (isActive ? "active" : "")}
    >
      <Box
        sx={{
          px: 1.25,
          py: 0.5,
          borderRadius: 1,
          color: "common.white",                  // erbt Weiß aus AppBar
          border: "1px solid transparent",
          transition: "background-color .15s ease,border-color .15s ease",
          "&:hover": { bgcolor: "rgba(255,255,255,0.12)" }, // dezentes Hover auf Blau
          "&.active": {
            bgcolor: "rgba(255,255,255,0.16)",             // leicht heller
            borderColor: (t) => t.palette.common.white,    // weißer Rand
            ccolor: "common.white",          // Text bleibt weiß
          },
        }}
      >
        {label}
      </Box>
    </Typography>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = useMemo(() => sessionStorage.getItem("role") || "Gast", [location.key]);

  const rolePath = getRoleMainPath(role);
  const roleLabel =
    role === "Krisenstab"
      ? "Rollenstart: Stab"
      : role === "Autorisation"
      ? "Rollenstart: Autorisation"
      : role === "Gemeinde/Organisation"
      ? "Rollenstart: Organisation"
      : "Rolle wählen";

  return (
    <RequestProvider>
      <Box sx={{ width: "100vw", height: "100vh", overflowX: "hidden" }}>
        <AppBar
          position="static"
          color="primary"
          enableColorOnDark
          sx={{
            bgcolor: "primary.main",
            color: "common.white",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                AOZ – Krisenmanagement
              </Typography>
              <NavLinkChip to={rolePath} label={roleLabel} />
              <NavLinkChip to="/central" label="Zentrale Übersicht" />
              <NavLinkChip to="/" label="Rolle ändern" />
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Rolle: {role}
            </Typography>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/" element={<StartMenu />} />

          <Route path="/stab" element={<Dashboard />} />
          <Route path="/requests" element={<RequestList />} />
          <Route path="/org" element={<OrgMaintenance />} />

          <Route path="/central" element={<CentralStorage />} />

          <Route path="/request/:id" element={<EditableRequestPage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/item/:itemId" element={<ItemDetailPage />} />

          <Route path="*" element={<Typography sx={{ p: 2 }}>Seite nicht gefunden.</Typography>} />
        </Routes>
      </Box>
    </RequestProvider>
  );
}
