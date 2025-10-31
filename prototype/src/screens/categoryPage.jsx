import * as React from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Stack,
  Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

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
  "MED-001": <MedicalServicesRoundedIcon sx={{ fontSize: 36, color: "primary.main" }} />,
  "MED-002": <LocalPharmacyIcon sx={{ fontSize: 36, color: "primary.main" }} />,
  "MED-003": <FavoriteIcon sx={{ fontSize: 36, color: "primary.main" }} />,
  "MED-004": <MasksIcon sx={{ fontSize: 36, color: "primary.main" }} />,
  "MED-005": <BloodtypeIcon sx={{ fontSize: 36, color: "primary.main" }} />,

  "FOOD-001": <LocalDrinkIcon sx={{ fontSize: 36, color: "secondary.main" }} />,
  "FOOD-002": <LunchDiningIcon sx={{ fontSize: 36, color: "secondary.main" }} />,
  "FOOD-003": <Inventory2Icon sx={{ fontSize: 36, color: "secondary.main" }} />,
  "FOOD-004": <RiceBowlIcon sx={{ fontSize: 36, color: "secondary.main" }} />,
  "FOOD-005": <BakeryDiningIcon sx={{ fontSize: 36, color: "secondary.main" }} />,

  "HYG-001": <SoapIcon sx={{ fontSize: 36, color: "warning.main" }} />,
  "HYG-002": <SanitizerIcon sx={{ fontSize: 36, color: "warning.main" }} />,
  "HYG-003": <ToiletIcon sx={{ fontSize: 36, color: "warning.main" }} />,
  "HYG-004": <ToothIcon sx={{ fontSize: 36, color: "warning.main" }} />,
  "HYG-005": <FemaleIcon sx={{ fontSize: 36, color: "warning.main" }} />,

  "BED-001": <BedIcon sx={{ fontSize: 36, color: "success.main" }} />,
  "BLK-010": <BeachAccessIcon sx={{ fontSize: 36, color: "success.main" }} />,
  "BED-002": <LayersIcon sx={{ fontSize: 36, color: "success.main" }} />,
  "BED-003": <HotelIcon sx={{ fontSize: 36, color: "success.main" }} />,
  "BED-004": <NightShelterIcon sx={{ fontSize: 36, color: "success.main" }} />,
};

const ITEMS = {
  medical: [
    { id: "MED-001", name: "Erste-Hilfe-Set", description: "Standard Erste-Hilfe-Set für Notfälle" },
    { id: "MED-002", name: "Verbandsmaterial", description: "Sterile Verbände und Pflaster" },
    { id: "MED-003", name: "Schmerzmittel", description: "Basismedikation (z. B. Ibuprofen, Paracetamol)" },
    { id: "MED-004", name: "Beatmungsmaske", description: "Einweg-Beatmungsmaske mit Filter" },
    { id: "MED-005", name: "Blutdruckmessgerät", description: "Digitales Messgerät zur Vitalwertüberwachung" },
  ],
  food: [
    { id: "FOOD-001", name: "Wasserflaschen (1L)", description: "Trinkwasser für 24h Versorgung" },
    { id: "FOOD-002", name: "MRE-Paket", description: "Fertiggerichte (Military Ready-to-Eat)" },
    { id: "FOOD-003", name: "Konservendosen", description: "Lang haltbare Lebensmittel" },
    { id: "FOOD-004", name: "Reis & Nudeln", description: "Grundnahrungsmittel für große Gruppen" },
    { id: "FOOD-005", name: "Brot & Cracker", description: "Trockenvorrat mit langer Haltbarkeit" },
  ],
  hygiene: [
    { id: "HYG-001", name: "Seife", description: "Hygieneseife antibakteriell" },
    { id: "HYG-002", name: "Desinfektionsmittel", description: "Händedesinfektion 500ml" },
    { id: "HYG-003", name: "Toilettenpapier", description: "Großpackungen für Notunterkünfte" },
    { id: "HYG-004", name: "Zahnpasta & Bürste", description: "Persönliche Hygieneartikel" },
    { id: "HYG-005", name: "Damenhygieneprodukte", description: "Tampons, Binden, Hygienebeutel" },
  ],
  accommodation: [
    { id: "BED-001", name: "Feldbett", description: "Klappbares Feldbett aus Aluminium" },
    { id: "BLK-010", name: "Decke", description: "Wärmende Decke für Notunterkünfte" },
    { id: "BED-002", name: "Isomatte", description: "Schlafunterlage für Boden oder Zelt" },
    { id: "BED-003", name: "Kopfkissen", description: "Standardkissen für Notbetten" },
    { id: "BED-004", name: "Zelt", description: "Notunterkunft für bis zu 6 Personen" },
  ],
};

export default function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const items = ITEMS[categoryId] || [];

  const categoryTitle = categoryId
    ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1)
    : "Unbekannt";

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.default", minHeight: "100vh" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        sx={{ mb: 4 }}
        spacing={2}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Kategorie: {categoryTitle}
          </Typography>
        </Stack>

        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate("/stab")}
          sx={{ borderRadius: 2 }}
        >
          ← Zurück zum Dashboard
        </Button>
      </Stack>

      {items.length > 0 ? (
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid key={item.id} item xs={12} sm={6} md={4} lg={3}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "action.hover",
                    transform: "translateY(-3px)",
                  },
                }}
                onClick={() => navigate(`/item/${item.id}`)}
              >
                <Stack spacing={1.5} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 2,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "action.hover",
                    }}
                  >
                    {ITEM_ICONS[item.id] || <LocalHospitalIcon sx={{ fontSize: 36, color: "grey.500" }} />}
                  </Box>

                  <Typography fontWeight={700}>{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography color="text.secondary" sx={{ mt: 3 }}>
          Keine Artikel in dieser Kategorie gefunden.
        </Typography>
      )}
    </Box>
  );
}
