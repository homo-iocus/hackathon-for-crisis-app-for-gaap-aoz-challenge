import * as React from "react";
import {
  Box,
  Grid,
  Typography,
  Stack,
  Button,
  Paper,
  Tooltip,
  Chip,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRequests } from "../context/RequestsContext";

import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import SanitizerIcon from "@mui/icons-material/Sanitizer";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";

const AREAS = [
  {
    id: "medical",
    title: "Erstversorgung (medizinisch)",
    icon: <MedicalServicesRoundedIcon fontSize="medium" />,
    color: "primary",
    hint: "Verbandmaterial, Erste-Hilfe, einfache Medikation",
  },
  {
    id: "food",
    title: "Verpflegung",
    icon: <RestaurantRoundedIcon fontSize="medium" />,
    color: "secondary",
    hint: "Lebensmittel, warme/kalte Mahlzeiten, Wasser",
  },
  {
    id: "hygiene",
    title: "Hygiene-Artikel",
    icon: <SanitizerIcon fontSize="medium" />,
    color: "warning",
    hint: "Seife, Desinfektion, Windeln, Damenhygiene",
  },
  {
    id: "accommodation",
    title: "Unterkunft",
    icon: <HotelRoundedIcon fontSize="medium" />,
    color: "success",
    hint: "Betten, Matratzen, Decken, Kissen",
  },
];

function AreaCard({ area, onClick }) {
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
            width: 50,
            height: 50,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            bgcolor: "action.hover",
            color: `${area.color}.main`,
          }}
        >
          {area.icon}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography fontWeight={700}>{area.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {area.hint}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

function RequestCard({ req }) {
  const firstItem = req.requested_items?.[0];
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 3,
        mb: 2,
        transition: "all .15s ease",
        "&:hover": { boxShadow: (t) => t.shadows[2] },
      }}
    >
      <Stack spacing={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography fontWeight={600}>
            {firstItem?.item_name || "Unbekannter Artikel"}
          </Typography>
          <Chip
            label={req.status || "pending"}
            color={
              req.status === "approved"
                ? "success"
                : req.status === "pending"
                ? "warning"
                : "default"
            }
            size="small"
          />
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Menge: {firstItem?.quantity_requested} {firstItem?.unit}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lieferung an: {req.delivery_location?.facility_name},{" "}
          {req.delivery_location?.address}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Angefordert am:{" "}
          {new Date(req.timestamp).toLocaleString("de-DE", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { requests } = useRequests();

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "background.default",
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 4 },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Übersicht
        </Typography>
      </Stack>

      <Typography
        variant="subtitle1"
        sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}
      >
        Was können wir tun? (Handlungsbereiche)
      </Typography>

      <Grid container spacing={2} sx={{ mb: 5 }}>
        {AREAS.map((a) => (
          <Grid key={a.id} item xs={12} sm={6} md={4} lg={3}>
            <AreaCard area={a} onClick={() => navigate(`/category/${a.id}`)} />
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 3 }} />
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 700, color: "text.primary" }}
      >
        Verlauf Ihrer Anfragen
      </Typography>

      {requests && requests.length > 0 ? (
        requests.map((req) => <RequestCard key={req.request_id} req={req} />)
      ) : (
        <Typography variant="body2" color="text.secondary">
          Noch keine Anfragen vorhanden.
        </Typography>
      )}
    </Box>
  );
}
