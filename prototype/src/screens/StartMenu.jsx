// /src/screens/StartMenu.jsx
import * as React from "react";
import { Box, Grid, Typography, Stack, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

import CrisisAlertRoundedIcon from "@mui/icons-material/CrisisAlertRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import DomainRoundedIcon from "@mui/icons-material/DomainRounded";

function Kachel({ icon, title, hint, onClick }) {
  return (
    <Paper
      variant="outlined"
      onClick={onClick}
      sx={{
        p: 2.5,
        borderRadius: 3,
        borderColor: "divider",
        cursor: "pointer",
        boxShadow: (t) => t.shadows[1],
        transition: "all .15s ease",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            bgcolor: "action.hover",
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography fontWeight={700}>{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {hint}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export default function StartMenu() {
  const navigate = useNavigate();

  const choose = (role, path) => {
    // Rolle merken und weiterleiten
    sessionStorage.setItem("role", role);
    navigate(path);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 64px)",
        bgcolor: "background.default",
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 4 },
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Start – Bitte Rolle auswählen
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Kachel
            icon={<CrisisAlertRoundedIcon fontSize="large" color="primary" />}
            title="Krisenstab (Stab)"
            hint="Lageübersicht, Priorisierung, Freigaben"
            onClick={() => choose("Krisenstab", "/stab")}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Kachel
            icon={<TaskAltRoundedIcon fontSize="large" color="success" />}
            title="Autorisation – Anfragen"
            hint="Anfragen prüfen und freigeben"
            onClick={() => choose("Autorisation", "/requests")}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Kachel
            icon={<DomainRoundedIcon fontSize="large" color="warning" />}
            title="Gemeinde/Organisation"
            hint="Eigene Organisation verwalten (Wartung, FIFO, Inspektionen)"
            onClick={() => choose("Gemeinde/Organisation", "/org")}
          />
        </Grid>
      </Grid>

      <Typography variant="body2" sx={{ mt: 3, color: "text.secondary" }}>
        Hinweis: Die <b>Zentrale Übersicht</b> ist für alle sichtbar und oben in der Navigation erreichbar.
      </Typography>
    </Box>
  );
}
