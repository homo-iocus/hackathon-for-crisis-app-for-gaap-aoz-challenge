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

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Kategorie: {categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}
        </Typography>

        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate("/")}
        >
          ← Zurück zum Dashboard
        </Button>
      </Stack>

      {items.length > 0 ? (
        <Grid container spacing={2}>
          {items.map((item) => (
            <Grid key={item.id} item xs={12} sm={6} md={4} lg={3}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  cursor: "pointer",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.15s ease",
                  "&:hover": { bgcolor: "action.hover" },
                }}
                onClick={() => navigate(`/item/${item.id}`)}
              >
                <Stack spacing={1}>
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
