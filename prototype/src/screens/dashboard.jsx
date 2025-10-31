import * as React from "react";
import {
  Box,
  Grid,
  Typography,
  Stack,
  Paper,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRequests } from "../context/RequestsContext";

import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import MasksIcon from "@mui/icons-material/Masks";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";

import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import RiceBowlIcon from "@mui/icons-material/RiceBowl";
import BakeryDiningIcon from "@mui/icons-material/BakeryDining";

import SoapIcon from "@mui/icons-material/Soap";
import SanitizerIcon from "@mui/icons-material/Sanitizer";
import ToiletIcon from "@mui/icons-material/Wc";
import ToothIcon from "@mui/icons-material/EmojiEmotions";
import FemaleIcon from "@mui/icons-material/Female";

import BedIcon from "@mui/icons-material/Bed";
import LayersIcon from "@mui/icons-material/Layers";
import NightShelterIcon from "@mui/icons-material/NightShelter";
import HotelIcon from "@mui/icons-material/Hotel";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";

import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

const ITEM_ICONS = {
  "MED-001": <MedicalServicesRoundedIcon sx={{ fontSize: 32, color: "primary.main" }} />,
  "MED-002": <LocalPharmacyIcon sx={{ fontSize: 32, color: "primary.main" }} />,
  "MED-003": <FavoriteIcon sx={{ fontSize: 32, color: "primary.main" }} />,
  "MED-004": <MasksIcon sx={{ fontSize: 32, color: "primary.main" }} />,
  "MED-005": <BloodtypeIcon sx={{ fontSize: 32, color: "primary.main" }} />,

  "FOOD-001": <LocalDrinkIcon sx={{ fontSize: 32, color: "secondary.main" }} />,
  "FOOD-002": <LunchDiningIcon sx={{ fontSize: 32, color: "secondary.main" }} />,
  "FOOD-003": <Inventory2Icon sx={{ fontSize: 32, color: "secondary.main" }} />,
  "FOOD-004": <RiceBowlIcon sx={{ fontSize: 32, color: "secondary.main" }} />,
  "FOOD-005": <BakeryDiningIcon sx={{ fontSize: 32, color: "secondary.main" }} />,
  "FOOD-006": <LocalDrinkIcon sx={{ fontSize: 32, color: "secondary.main" }} />,

  "HYG-001": <SoapIcon sx={{ fontSize: 32, color: "warning.main" }} />,
  "HYG-002": <SanitizerIcon sx={{ fontSize: 32, color: "warning.main" }} />,
  "HYG-003": <ToiletIcon sx={{ fontSize: 32, color: "warning.main" }} />,
  "HYG-004": <ToothIcon sx={{ fontSize: 32, color: "warning.main" }} />,
  "HYG-005": <FemaleIcon sx={{ fontSize: 32, color: "warning.main" }} />,

  "BED-001": <BedIcon sx={{ fontSize: 32, color: "success.main" }} />,
  "BLK-010": <BeachAccessIcon sx={{ fontSize: 32, color: "success.main" }} />,
  "BED-002": <LayersIcon sx={{ fontSize: 32, color: "success.main" }} />,
  "BED-003": <HotelIcon sx={{ fontSize: 32, color: "success.main" }} />,
  "BED-004": <NightShelterIcon sx={{ fontSize: 32, color: "success.main" }} />,
};

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
    icon: <LunchDiningIcon fontSize="medium" />,
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
    icon: <HotelIcon fontSize="medium" />,
    color: "success",
    hint: "Betten, Matratzen, Decken, Kissen",
  },
];

const STATUS_LABELS = {
  pending: "Ausstehend",
  approved: "Genehmigt",
  rejected: "Abgelehnt",
  default: "Unbekannt",
};

function RequestCard({ req }) {
  const firstItem = req.requested_items?.[0];
  const itemId = firstItem?.item_id || firstItem?.id || "";
  const normalizedId = itemId.toUpperCase();
  const itemName = firstItem?.item_name?.toLowerCase() || "";

  let itemIcon = ITEM_ICONS[normalizedId];

  if (!itemIcon && itemName.includes("wasser")) {
    itemIcon = ITEM_ICONS["FOOD-001"];
  }

  if (!itemIcon) {
    itemIcon = <LocalHospitalIcon sx={{ fontSize: 36, color: "grey.500" }} />;
  }

  const germanStatus = STATUS_LABELS[req.status] || STATUS_LABELS.default;

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
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            bgcolor: "action.hover",
          }}
        >
          {itemIcon}
        </Box>

        <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={600}>
              {firstItem?.item_name || "Unbekannter Artikel"}
            </Typography>
            <Chip
              label={germanStatus}
              color={
                req.status === "approved"
                  ? "success"
                  : req.status === "pending"
                  ? "warning"
                  : req.status === "rejected"
                  ? "error"
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
      </Stack>
    </Paper>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { requests } = useRequests();

  const [filterStatus, setFilterStatus] = React.useState("alle");
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredRequests = requests
    ?.filter((r) => (filterStatus === "alle" ? true : r.status === filterStatus))
    ?.filter((r) => {
      const firstItem = r.requested_items?.[0];
      const searchableText = [
        firstItem?.item_name,
        r.delivery_location?.facility_name,
        r.delivery_location?.address,
        r.request_id,
      ]
        .join(" ")
        .toLowerCase();
      return searchableText.includes(searchTerm.toLowerCase());
    });

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
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Übersicht
        </Typography>
      </Stack>

      {/* Areas */}
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}>
        Was können wir tun? (Handlungsbereiche)
      </Typography>

      <Grid container spacing={2} sx={{ mb: 5 }}>
        {AREAS.map((a) => (
          <Grid key={a.id} item xs={12} sm={6} md={4} lg={3}>
            <Paper
              variant="outlined"
              onClick={() => navigate(`/category/${a.id}`)}
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
                    color: `${a.color}.main`,
                  }}
                >
                  {a.icon}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography fontWeight={700}>{a.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {a.hint}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Request list */}
      <Divider sx={{ my: 3 }} />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        sx={{ mb: 2 }}
        spacing={2}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
          Verlauf Ihrer Anfragen
        </Typography>

        <Stack direction="row" spacing={2} sx={{ width: "100%", maxWidth: 500 }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status filtern</InputLabel>
            <Select
              value={filterStatus}
              label="Status filtern"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="alle">Alle</MenuItem>
              <MenuItem value="pending">Ausstehend</MenuItem>
              <MenuItem value="approved">Genehmigt</MenuItem>
              <MenuItem value="rejected">Abgelehnt</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            variant="outlined"
            label="Suche in Anfragen"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
        </Stack>
      </Stack>

      {filteredRequests && filteredRequests.length > 0 ? (
        filteredRequests.map((req) => <RequestCard key={req.request_id} req={req} />)
      ) : (
        <Typography variant="body2" color="text.secondary">
          Keine passenden Anfragen gefunden.
        </Typography>
      )}
    </Box>
  );
}
