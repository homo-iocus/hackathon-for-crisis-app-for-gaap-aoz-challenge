import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  MenuItem,
  Alert,
  Divider,
} from "@mui/material";
import { initialRequests } from "../data/requests";

const ITEM_LOOKUP = {
  "MED-001": { item_id: "MED-001", item_name: "Erste-Hilfe-Set", category: "Medizin", unit: "Stück" },
  "MED-002": { item_id: "MED-002", item_name: "Verbandsmaterial", category: "Medizin", unit: "Stück" },
  "MED-003": { item_id: "MED-003", item_name: "Schmerzmittel", category: "Medizin", unit: "Packung" },
  "MED-004": { item_id: "MED-004", item_name: "Beatmungsmaske", category: "Medizin", unit: "Stück" },
  "MED-005": { item_id: "MED-005", item_name: "Blutdruckmessgerät", category: "Medizin", unit: "Stück" },

  "FOOD-001": { item_id: "FOOD-001", item_name: "Wasserflaschen (1L)", category: "Verpflegung", unit: "Flaschen" },
  "FOOD-002": { item_id: "FOOD-002", item_name: "MRE-Paket", category: "Verpflegung", unit: "Pakete" },
  "FOOD-003": { item_id: "FOOD-003", item_name: "Konservendosen", category: "Verpflegung", unit: "Dosen" },
  "FOOD-004": { item_id: "FOOD-004", item_name: "Reis & Nudeln", category: "Verpflegung", unit: "Kilogramm" },
  "FOOD-005": { item_id: "FOOD-005", item_name: "Brot & Cracker", category: "Verpflegung", unit: "Pakete" },

  "HYG-001": { item_id: "HYG-001", item_name: "Seife", category: "Hygiene", unit: "Stück" },
  "HYG-002": { item_id: "HYG-002", item_name: "Desinfektionsmittel (500ml)", category: "Hygiene", unit: "Flaschen" },
  "HYG-003": { item_id: "HYG-003", item_name: "Toilettenpapier", category: "Hygiene", unit: "Rollen" },
  "HYG-004": { item_id: "HYG-004", item_name: "Zahnpasta & Bürste", category: "Hygiene", unit: "Sets" },
  "HYG-005": { item_id: "HYG-005", item_name: "Damenhygieneprodukte", category: "Hygiene", unit: "Packungen" },

  "BED-001": { item_id: "BED-001", item_name: "Feldbett", category: "Unterkunft", unit: "Stück" },
  "BLK-010": { item_id: "BLK-010", item_name: "Decke", category: "Unterkunft", unit: "Stück" },
  "BED-002": { item_id: "BED-002", item_name: "Isomatte", category: "Unterkunft", unit: "Stück" },
  "BED-003": { item_id: "BED-003", item_name: "Kopfkissen", category: "Unterkunft", unit: "Stück" },
  "BED-004": { item_id: "BED-004", item_name: "Zelt", category: "Unterkunft", unit: "Stück" },

  "WTR-020": { item_id: "WTR-020", item_name: "Trinkwasserkanister (10L)", category: "Versorgung", unit: "Kanister" },
};

const PRIORITIES = [
  { label: "hoch", value: "hoch" },
  { label: "mittel", value: "mittel" },
  { label: "niedrig", value: "niedrig" },
];

export default function ItemDetailPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const item = ITEM_LOOKUP[itemId] || {
    item_id: itemId,
    item_name: `Artikel ${itemId}`,
    category: "Unbekannt",
    unit: "Stück",
  };

  const [form, setForm] = React.useState({
    organization_name: "Deutsches Rotes Kreuz",
    contact_person: "Anna Müller",
    email: "anna.mueller@drk.de",
    phone: "+49-30-1234567",
    facility_name: "", 
    address: "", 
    quantity_requested: 1,
    unit: item.unit,
    priority: "mittel",
    requested_delivery_date: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleChange = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    if (!form.organization_name?.trim()) return "Organisation ist erforderlich.";
    if (!form.facility_name?.trim()) return "Einrichtung ist erforderlich.";
    if (!form.address?.trim()) return "Adresse ist erforderlich.";
    if (!form.email?.includes("@")) return "Bitte eine gültige E-Mail angeben.";
    if (Number(form.quantity_requested) <= 0) return "Menge muss größer als 0 sein.";
    return "";
  };

  const handleRequest = () => {
    const v = validate();
    if (v) {
      setError(v);
      setSent(false);
      return;
    }
    setError("");

    const newRequest = {
      request_id: `REQ-${new Date().toISOString().replace(/\D/g, "").slice(0, 12)}`,
      timestamp: new Date().toISOString(),
      request_type: "inventory_request",
      requested_by: {
        organization_name: form.organization_name,
        contact_person: form.contact_person,
        email: form.email,
        phone: form.phone,
      },
      delivery_location: {
        facility_name: form.facility_name,
        address: form.address,
      },
      requested_items: [
        {
          item_id: item.item_id, 
          item_name: item.item_name,
          category: item.category,
          quantity_requested: Number(form.quantity_requested),
          unit: form.unit,
          priority: form.priority,
        },
      ],
      requested_delivery_date: form.requested_delivery_date,
      notes: form.notes,
      status: "pending",
    };

    console.log("📦 Sende Anfrage:", newRequest);
    const storeKey = "aoz_requests";
    const existing = JSON.parse(localStorage.getItem(storeKey) || "[]");
    localStorage.setItem(storeKey, JSON.stringify([newRequest, ...existing]));

    setSent(true);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Artikel
            </Typography>
            <Stack spacing={1.2} sx={{ mb: 2 }}>
              <Row label="Bezeichnung" value={item.item_name} />
              <Row label="Kategorie" value={item.category} />
              <Row label="Einheit" value={item.unit} />
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Prüfen Sie die Angaben und füllen Sie rechts die Anforderungsdetails aus.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Artikel anfordern
            </Typography>

            <Section title="Anfordernde Organisation">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Organisation"
                    value={form.organization_name}
                    onChange={handleChange("organization_name")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ansprechperson"
                    value={form.contact_person}
                    onChange={handleChange("contact_person")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="E-Mail"
                    value={form.email}
                    onChange={handleChange("email")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Telefon"
                    value={form.phone}
                    onChange={handleChange("phone")}
                  />
                </Grid>
              </Grid>
            </Section>

            <Section title="Lieferort">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Einrichtung"
                    value={form.facility_name}
                    onChange={handleChange("facility_name")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Adresse"
                    value={form.address}
                    onChange={handleChange("address")}
                  />
                </Grid>
              </Grid>
            </Section>

            <Section title="Artikel & Menge">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bezeichnung"
                    value={item.item_name}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    type="number"
                    fullWidth
                    label="Menge"
                    value={form.quantity_requested}
                    onChange={handleChange("quantity_requested")}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Einheit"
                    value={form.unit}
                    onChange={handleChange("unit")}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Priorität"
                    select
                    value={form.priority}
                    onChange={handleChange("priority")}
                  >
                    {PRIORITIES.map((p) => (
                      <MenuItem key={p.value} value={p.value}>
                        {p.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Section>

            <Section title="Termin & Notizen">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Gewünschtes Lieferdatum"
                    value={form.requested_delivery_date}
                    onChange={handleChange("requested_delivery_date")}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="Notizen"
                    value={form.notes}
                    onChange={handleChange("notes")}
                  />
                </Grid>
              </Grid>
            </Section>

            {error && (
              <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
                {error}
              </Alert>
            )}

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button variant="contained" onClick={handleRequest}>
                Anfrage senden
              </Button>
              <Button variant="text" onClick={() => navigate(-1)}>
                Zurück zur Kategorie
              </Button>
            </Stack>

            {sent && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Anfrage erfolgreich erstellt und lokal gespeichert.
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

function Section({ title, children }) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function Row({ label, value }) {
  return (
    <Stack direction="row" spacing={1}>
      <Typography sx={{ minWidth: 140, color: "text.secondary" }}>{label}:</Typography>
      <Typography>{value}</Typography>
    </Stack>
  );
}
