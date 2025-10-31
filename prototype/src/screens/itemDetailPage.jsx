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
import { useRequests } from "../context/RequestsContext";

const ITEM_LOOKUP = {
  "MED-001": {
    item_id: "MED-001",
    item_name: "Erste-Hilfe-Set",
    category: "Medizin",
    unit: "Stück",
    total_available: 120,
    in_use: 30,
    reserved: 10,
    damaged: 5,
    last_inspection: "2025-07-10",
    inspection_frequency: "6 Monate",
    responsible_person: "Dr. Markus Weber",
    size: "25 x 15 x 10 cm",
    weight: "1.2 kg",
    volume: "3.75 L",
    stackable: "Ja",
    storage_address: "Zentrallager München, Raum M1",
    gps: "48.1351, 11.5820",
    photo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Erste-Hilfe-Set.jpg",
    manual: "Erste_Hilfe_Set_Manual.pdf",
    safety_sheet: "Safety_Data_Sheet.pdf",
    transport_vehicle: "PKW",
    manpower: "1 Person",
    assembly_time: "<15 Minuten",
    deploy_time: "<2h",
    readiness: "Einsatzbereit",
    supplier: "MedSupply GmbH",
    purchase_date: "2023-09-15",
    warranty: "2026-09-15",
    notes: "Regelmässig steril überprüfen.",
    
    packaging_type: "Karton (Kiste)",
    units_per_package: 10,
    package_size: "60 x 40 x 30 cm",
    package_weight: "13 kg",
    package_volume: "72 L",
    oversize: false,
    min_vehicle: "PKW",
    access: {
      anytime: true,
      location_type: "Ebenerdig",
      max_vehicle_height_m: null,
      security_notes: "Zutritt mit Zugangskarte.",
      access_hours: "24/7",
      contact_phone: "+49-89-111111",
    },
  },
  "MED-002": {
    item_id: "MED-002",
    item_name: "Verbandsmaterial",
    category: "Medizin",
    unit: "Stück",
    total_available: 800,
    in_use: 200,
    reserved: 50,
    damaged: 8,
    last_inspection: "2025-05-01",
    inspection_frequency: "6 Monate",
    responsible_person: "Laura Schneider",
    size: "20 x 10 x 5 cm",
    weight: "0.5 kg",
    volume: "1 L",
    stackable: "Ja",
    storage_address: "Lager Hamburg, Regal M5",
    gps: "53.5511, 9.9937",
    photo: "https://upload.wikimedia.org/wikipedia/commons/6/65/Bandages.jpg",
    manual: "Verbandsmaterial_Info.pdf",
    safety_sheet: "Material_Safety.pdf",
    transport_vehicle: "PKW",
    manpower: "1 Person",
    assembly_time: "Keine",
    deploy_time: "<2h",
    readiness: "Einsatzbereit",
    supplier: "MediCare Supplies",
    purchase_date: "2024-04-22",
    warranty: "2027-04-22",
    notes: "Steril lagern, nicht öffnen vor Gebrauch.",
    
    packaging_type: "Karton (Umkarton)",
    units_per_package: 20,
    package_size: "60 x 40 x 40 cm",
    package_weight: "11 kg",
    package_volume: "96 L",
    oversize: false,
    min_vehicle: "PKW",
    access: {
      anytime: false,
      location_type: "Tiefgarage",
      max_vehicle_height_m: 1.9,
      security_notes: "Pförtner meldet Ankunft, Schlüssel erforderlich.",
      access_hours: "06:00–22:00",
      contact_phone: "+49-40-222222",
    },
  },
  "MED-003": {
    item_id: "MED-003",
    item_name: "Schmerzmittel",
    category: "Medizin",
    unit: "Packung",
    total_available: 400,
    in_use: 80,
    reserved: 30,
    damaged: 4,
    last_inspection: "2025-08-10",
    inspection_frequency: "Monatlich",
    responsible_person: "Dr. Nina Köhler",
    size: "10 x 5 x 3 cm",
    weight: "200 g",
    volume: "0.15 L",
    stackable: "Ja",
    storage_address: "Apothekenlager Zürich, Regal A3",
    gps: "50.1109, 8.6821",
    photo: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Pills.jpg",
    manual: "Painkiller_Info.pdf",
    safety_sheet: "Drug_Safety_Sheet.pdf",
    transport_vehicle: "PKW",
    manpower: "1 Person",
    assembly_time: "Keine",
    deploy_time: "<2h",
    readiness: "Einsatzbereit",
    supplier: "PharmaDirect GmbH",
    purchase_date: "2023-10-10",
    warranty: "2026-10-10",
    notes: "Nur für medizinisches Personal freigegeben.",
    
    packaging_type: "Pharmakarton (Tray)",
    units_per_package: 50,
    package_size: "40 x 30 x 25 cm",
    package_weight: "12 kg",
    package_volume: "30 L",
    oversize: false,
    min_vehicle: "PKW",
    access: {
      anytime: false,
      location_type: "Ebenerdig",
      max_vehicle_height_m: null,
      security_notes: "Betreute Abholung; Rezept/Freigabe erforderlich.",
      access_hours: "08:00–18:00",
      contact_phone: "+41-43-3333333",
    },
  },
  "MED-004": {
    item_id: "MED-004",
    item_name: "Beatmungsmaske",
    category: "Medizin",
    unit: "Stück",
    total_available: 150,
    in_use: 60,
    reserved: 10,
    damaged: 5,
    last_inspection: "2025-07-01",
    inspection_frequency: "Jährlich",
    responsible_person: "Jonas Weber",
    size: "25 x 20 x 10 cm",
    weight: "0.4 kg",
    volume: "0.5 L",
    stackable: "Nein",
    storage_address: "Lager Berlin, Medizinabteilung B2",
    gps: "52.5200, 13.4050",
    photo: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Medical_mask.jpg",
    manual: "Beatmungsmaske_Manual.pdf",
    safety_sheet: "AirSafety.pdf",
    transport_vehicle: "PKW",
    manpower: "1 Person",
    assembly_time: "<10 Minuten",
    deploy_time: "<2h",
    readiness: "Einsatzbereit",
    supplier: "SafeBreath Systems",
    purchase_date: "2023-12-01",
    warranty: "2026-12-01",
    notes: "Regelmäßig auf Dichtigkeit prüfen.",
    
    packaging_type: "Karton, einzeln verpackt",
    units_per_package: 12,
    package_size: "60 x 40 x 35 cm",
    package_weight: "7 kg",
    package_volume: "84 L",
    oversize: false,
    min_vehicle: "PKW",
    access: {
      anytime: true,
      location_type: "Ebenerdig",
      max_vehicle_height_m: null,
      security_notes: "Zutritt via PIN-Freisicherung.",
      access_hours: "24/7",
      contact_phone: "+49-30-444444",
    },
  },
  "MED-005": {
    item_id: "MED-005",
    item_name: "Blutdruckmessgerät",
    category: "Medizin",
    unit: "Stück",
    total_available: 100,
    in_use: 40,
    reserved: 20,
    damaged: 2,
    last_inspection: "2025-06-05",
    inspection_frequency: "Jährlich",
    responsible_person: "Dr. Thomas Krüger",
    size: "15 x 10 x 8 cm",
    weight: "0.8 kg",
    volume: "1.2 L",
    stackable: "Nein",
    storage_address: "Lager München, Regal C1",
    gps: "48.1351, 11.5820",
    photo: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Blood_pressure_monitor.jpg",
    manual: "Blutdruckmessgeraet_Manual.pdf",
    safety_sheet: "Safety_Info.pdf",
    transport_vehicle: "PKW",
    manpower: "1 Person",
    assembly_time: "Keine",
    deploy_time: "<3h",
    readiness: "Einsatzbereit",
    supplier: "MediTech AG",
    purchase_date: "2022-08-08",
    warranty: "2026-08-08",
    notes: "Kalibrierung alle 12 Monate erforderlich.",
    
    packaging_type: "Karton (Schaumstoffeinlage)",
    units_per_package: 8,
    package_size: "50 x 40 x 35 cm",
    package_weight: "9 kg",
    package_volume: "70 L",
    oversize: false,
    min_vehicle: "PKW",
    access: {
      anytime: false,
      location_type: "Tiefgarage",
      max_vehicle_height_m: 2.0,
      security_notes: "Zugang über Seiteneingang; Schlüssel beim Pförtner.",
      access_hours: "07:00–20:00",
      contact_phone: "+49-89-555555",
    },
  },

  "FOOD-001": {
    item_id: "FOOD-001",
    item_name: "Wasserflaschen (1L)",
    category: "Verpflegung",
    unit: "Flaschen",
    total_available: 5000,
    in_use: 200,
    reserved: 300,
    damaged: 20,
    last_inspection: "2025-08-15",
    inspection_frequency: "Monatlich",
    responsible_person: "Julia Fischer",
    size: "10 x 10 x 30 cm",
    weight: "1 kg",
    volume: "1 L",
    stackable: "Ja (Kistenweise)",
    storage_address: "Lager Berlin, Zone C3",
    gps: "52.5200, 13.4050",
    photo: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Water_bottles.jpg",
    manual: "Wasserflaschen_Info.pdf",
    safety_sheet: "Nicht erforderlich",
    transport_vehicle: "LKW",
    manpower: "2 Personen",
    assembly_time: "Keine",
    deploy_time: "<4h",
    readiness: "Einsatzbereit",
    supplier: "AquaSource AG",
    purchase_date: "2024-02-01",
    warranty: "2028-02-01",
    notes: "Vor Hitze schützen, Lagerung <25°C.",
    
    packaging_type: "Kiste / Palette (EU)",
    units_per_package: 12, 
    package_size: "80 x 120 x 150 cm (Palette, gestapelt)",
    package_weight: "300 kg (Palette)",
    package_volume: "1.44 m³",
    oversize: false,
    min_vehicle: "Transporter",
    access: {
      anytime: false,
      location_type: "Rampe",
      max_vehicle_height_m: null,
      security_notes: "Warenausgabe über Tor 3.",
      access_hours: "08:00–18:00",
      contact_phone: "+49-30-666666",
    },
  },
  "FOOD-002": {
    item_id: "FOOD-002",
    item_name: "MRE-Paket",
    category: "Verpflegung",
    unit: "Pakete",
    total_available: 1000,
    in_use: 50,
    reserved: 200,
    damaged: 15,
    last_inspection: "2025-06-01",
    inspection_frequency: "Halbjährlich",
    responsible_person: "Maximilian Hoffmann",
    size: "25 x 15 x 10 cm",
    weight: "2.5 kg",
    volume: "3 L",
    stackable: "Ja",
    storage_address: "Lager Leipzig, Zone F1",
    gps: "51.3397, 12.3731",
    photo: "https://upload.wikimedia.org/wikipedia/commons/5/54/MRE_Menu_23.jpg",
    manual: "MRE_Info.pdf",
    safety_sheet: "Food_Safety.pdf",
    transport_vehicle: "LKW",
    manpower: "2 Personen",
    assembly_time: "Keine",
    deploy_time: "1 Tag",
    readiness: "Einsatzbereit",
    supplier: "NutriAid GmbH",
    purchase_date: "2024-01-10",
    warranty: "2029-01-10",
    notes: "Kühl und trocken lagern.",
    
    packaging_type: "Karton / Palette (EU)",
    units_per_package: 24,
    package_size: "80 x 120 x 140 cm (Palette)",
    package_weight: "600 kg (Palette)",
    package_volume: "1.34 m³",
    oversize: false,
    min_vehicle: "Transporter",
    access: {
      anytime: true,
      location_type: "Ebenerdig",
      max_vehicle_height_m: null,
      security_notes: "Torcode wird telefonisch mitgeteilt.",
      access_hours: "24/7",
      contact_phone: "+49-341-777777",
    },
  },
  "FOOD-003": {
    item_id: "FOOD-003",
    item_name: "Konservendosen",
    category: "Verpflegung",
    unit: "Dosen",
    total_available: 2000,
    in_use: 400,
    reserved: 300,
    damaged: 25,
    last_inspection: "2025-09-05",
    inspection_frequency: "Monatlich",
    responsible_person: "Elena Meyer",
    size: "10 x 10 x 15 cm",
    weight: "0.5 kg",
    volume: "0.5 L",
    stackable: "Ja",
    storage_address: "Lager Hannover, Raum G3",
    gps: "52.3759, 9.7320",
    photo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Canned_food.jpg",
    manual: "Konserven_Info.pdf",
    safety_sheet: "Food_Storage.pdf",
    transport_vehicle: "LKW",
    manpower: "3 Personen",
    assembly_time: "Keine",
    deploy_time: "1 Tag",
    readiness: "Einsatzbereit",
    supplier: "FoodTech GmbH",
    purchase_date: "2024-04-05",
    warranty: "2028-04-05",
    notes: "Vor Rost schützen.",
    
    packaging_type: "Karton / Palette (EU)",
    units_per_package: 24,
    package_size: "80 x 120 x 150 cm (Palette)",
    package_weight: "750 kg (Palette)",
    package_volume: "1.44 m³",
    oversize: false,
    min_vehicle: "Transporter",
    access: {
      anytime: false,
      location_type: "Rampe",
      max_vehicle_height_m: null,
      security_notes: "Sicherheitsweste Pflicht.",
      access_hours: "07:00–17:00",
      contact_phone: "+49-511-888888",
    },
  },
  "FOOD-004": {
    item_id: "FOOD-004",
    item_name: "Reis & Nudeln",
    category: "Verpflegung",
    unit: "Kilogramm",
    total_available: 4000,
    in_use: 300,
    reserved: 200,
    damaged: 30,
    last_inspection: "2025-07-25",
    inspection_frequency: "Halbjährlich",
    responsible_person: "David König",
    size: "30 x 20 x 10 cm",
    weight: "1 kg",
    volume: "1.5 L",
    stackable: "Ja",
    storage_address: "Lager Stuttgart, Regal R5",
    gps: "48.7758, 9.1829",
    photo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Rice_and_pasta.jpg",
    manual: "Reis_Nudeln_Info.pdf",
    safety_sheet: "Nicht erforderlich",
    transport_vehicle: "LKW",
    manpower: "2 Personen",
    assembly_time: "Keine",
    deploy_time: "<1 Tag",
    readiness: "Einsatzbereit",
    supplier: "GrainCorp AG",
    purchase_date: "2024-03-05",
    warranty: "2028-03-05",
    notes: "Trocken lagern.",
    
    packaging_type: "Sack / Palette (EU)",
    units_per_package: 50, 
    package_size: "80 x 120 x 140 cm (Palette)",
    package_weight: "1.0 t (Palette, max)",
    package_volume: "1.34 m³",
    oversize: false,
    min_vehicle: "Transporter",
    access: {
      anytime: false,
      location_type: "Tiefgarage",
      max_vehicle_height_m: 2.1,
      security_notes: "Zugang via Schranke; Transponder nötig.",
      access_hours: "06:00–22:00",
      contact_phone: "+49-711-999999",
    },
  },
  "FOOD-005": {
    item_id: "FOOD-005",
    item_name: "Brot & Cracker",
    category: "Verpflegung",
    unit: "Pakete",
    total_available: 1500,
    in_use: 200,
    reserved: 100,
    damaged: 12,
    last_inspection: "2025-05-20",
    inspection_frequency: "Monatlich",
    responsible_person: "Hannah Vogt",
    size: "30 x 15 x 8 cm",
    weight: "0.8 kg",
    volume: "0.9 L",
    stackable: "Ja",
    storage_address: "Lager Bremen, Regal B4",
    gps: "53.0793, 8.8017",
    photo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Bread_and_crackers.jpg",
    manual: "Brot_Cracker_Info.pdf",
    safety_sheet: "Nicht erforderlich",
    transport_vehicle: "LKW",
    manpower: "2 Personen",
    assembly_time: "Keine",
    deploy_time: "<1 Tag",
    readiness: "Einsatzbereit",
    supplier: "BakeSafe GmbH",
    purchase_date: "2024-05-15",
    warranty: "2027-05-15",
    notes: "Frischware regelmäßig prüfen.",
    
    packaging_type: "Karton / Palette (EU)",
    units_per_package: 36,
    package_size: "80 x 120 x 160 cm (Palette)",
    package_weight: "350 kg (Palette)",
    package_volume: "1.54 m³",
    oversize: false,
    min_vehicle: "Transporter",
    access: {
      anytime: true,
      location_type: "Ebenerdig",
      max_vehicle_height_m: null,
      security_notes: "Anlieferung über Hofseite.",
      access_hours: "24/7",
      contact_phone: "+49-421-123123",
    },
  },

  "HYG-001": { 
    item_id: "HYG-001",
    item_name: "Seife (antibakteriell)",
    category: "Hygiene",
    unit: "Stück",
    total_available: 800,
    in_use: 150,
    reserved: 60,
    damaged: 10,
    last_inspection: "2025-09-05",
    inspection_frequency: "Monatlich",
    responsible_person: "Sabine Meier",
    size: "8 x 6 x 3 cm",
    weight: "150 g",
    volume: "0.15 L",
    stackable: "Ja",
    storage_address: "Lager Zürich, Regalfach H2",
    gps: "50.1109, 8.6821",
    photo: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Bar_of_Soap.jpg",
    manual: "Seife_Info.pdf",
    safety_sheet: "Hygiene_Safety.pdf",
    transport_vehicle: "PKW",
    manpower: "1 Person",
    assembly_time: "Keine",
    deploy_time: "<4h",
    readiness: "Einsatzbereit",
    supplier: "CleanPro AG",
    purchase_date: "2024-03-01",
    warranty: "2026-03-01",
    notes: "Vor Feuchtigkeit schützen.",
    
    packaging_type: "Karton / Tray",
    units_per_package: 48,
    package_size: "60 x 40 x 30 cm",
    package_weight: "9 kg",
    package_volume: "72 L",
    oversize: false,
    min_vehicle: "PKW",
    access: {
      anytime: false,
      location_type: "Ebenerdig",
      max_vehicle_height_m: null,
      security_notes: "Zugang über Seitentür; Klingel.",
      access_hours: "08:00–18:00",
      contact_phone: "+41-44-121212",
    },
  },
  "HYG-002": {
    item_id: "HYG-002",
    item_name: "Desinfektionsmittel (500ml)",
    category: "Hygiene",
    unit: "Flaschen",
    total_available: 600,
    in_use: 100,
    reserved: 40,
    damaged: 5,
    last_inspection: "2025-08-01",
    inspection_frequency: "Monatlich",
    responsible_person: "Lisa Brandt",
    size: "6 x 6 x 20 cm",
    weight: "0.6 kg",
    volume: "0.5 L",
    stackable: "Ja",
    storage_address: "Lager Stuttgart, Regal D4",
    gps: "48.7758, 9.1829",
    photo: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Hand_sanitizer.jpg",
    manual: "Desinfektion_Info.pdf",
    safety_sheet: "Safety_Chemical.pdf",
    transport_vehicle: "PKW",
    manpower: "1 Person",
    assembly_time: "Keine",
    deploy_time: "<3h",
    readiness: "Einsatzbereit",
    supplier: "SanitizePlus GmbH",
    purchase_date: "2023-09-20",
    warranty: "2026-09-20",
    notes: "Nicht über 30°C lagern.",
    
    packaging_type: "Gefahrgut-Karton / Palette (EU)",
    units_per_package: 24,
    package_size: "80 x 120 x 140 cm (Palette)",
    package_weight: "500 kg (Palette)",
    package_volume: "1.34 m³",
    oversize: false,
    min_vehicle: "Transporter",
    access: {
      anytime: false,
      location_type: "Tiefgarage",
      max_vehicle_height_m: 2.0,
      security_notes: "Gefahrstoffbereich – Anmeldung erforderlich.",
      access_hours: "07:00–17:00",
      contact_phone: "+49-711-232323",
    },
  },
  "HYG-003": {
    item_id: "HYG-003",
    item_name: "Toilettenpapier",
    category: "Hygiene",
    unit: "Rollen",
    total_available: 2000,
    in_use: 300,
    reserved: 100,
    damaged: 8,
    last_inspection: "2025-07-10",
    inspection_frequency: "Monatlich",
    responsible_person: "Jonas Becker",
    size: "10 x 10 x 12 cm",
    weight: "100 g",
    volume: "0.1 L",
    stackable: "Ja (Pakete)",
    storage_address: "Lager München, Zone TP",
    gps: "48.1351, 11.5820",
    photo: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Toilet_paper.jpg",
    manual: "Toilettenpapier_Info.pdf",
    safety_sheet: "Nicht erforderlich",
    transport_vehicle: "LKW",
    manpower: "2 Personen",
    assembly_time: "Keine",
    deploy_time: "<1 Tag",
    readiness: "Einsatzbereit",
    supplier: "PaperGoods AG",
    purchase_date: "2024-02-05",
    warranty: "2027-02-05",
    notes: "Trocken lagern, Verpackung geschlossen halten.",
    
    packaging_type: "Folie/Pakete / Palette (EU)",
    units_per_package: 48,
    package_size: "80 x 120 x 200 cm (Palette, leicht)",
    package_weight: "120 kg (Palette)",
    package_volume: "1.92 m³",
    oversize: false,
    min_vehicle: "Transporter",
    access: {
      anytime: true,
      location_type: "Ebenerdig",
      max_vehicle_height_m: null,
      security_notes: "Anmeldung nicht erforderlich.",
      access_hours: "24/7",
      contact_phone: "+49-89-454545",
    },
  },
  "HYG-004": {
    item_id: "HYG-004",
    item_name: "Zahnpasta & Bürste",
    category: "Hygiene",
    unit: "Sets",
    total_available: 1000,
    in_use: 150,
    reserved: 70,
    damaged: 5,
    last_inspection: "2025-08-15",
    inspection_frequency: "Halbjährlich",
    responsible_person: "Clara Hofmann",
    size: "20 x 5 x 4 cm",
    weight: "200 g",
    volume: "0.2 L",
    stackable: "Ja",
    storage_address: "Lager Berlin, Regal Z1",
    gps: "52.5200, 13.4050",
    photo: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Toothbrush_and_toothpaste.jpg",
    manual: "Zahnpflege_Info.pdf",
    safety_sheet: "Nicht erforderlich",
    transport_vehicle: "PKW",
    manpower: "1 Person",
    assembly_time: "Keine",
    deploy_time: "<4h",
    readiness: "Einsatzbereit",
    supplier: "DentalCare Solutions",
    purchase_date: "2024-04-20",
    warranty: "2027-04-20",
    notes: "In trockener Umgebung lagern.",
    
    packaging_type: "Karton",
    units_per_package: 40,
    package_size: "60 x 40 x 40 cm",
    package_weight: "12 kg",
    package_volume: "96 L",
    oversize: false,
    min_vehicle: "PKW",
    access: {
      anytime: false,
      location_type: "Ebenerdig",
      max_vehicle_height_m: null,
      security_notes: "Klingel an Tor 2.",
      access_hours: "08:00–18:00",
      contact_phone: "+49-30-898989",
    },
  },
  "HYG-005": {
    item_id: "HYG-005",
    item_name: "Damenhygieneprodukte",
    category: "Hygiene",
    unit: "Pakete",
    total_available: 1200,
    in_use: 300,
    reserved: 100,
    damaged: 10,
    last_inspection: "2025-06-01",
    inspection_frequency: "Halbjährlich",
    responsible_person: "Verena Keller",
    size: "25 x 20 x 10 cm",
    weight: "0.5 kg",
    volume: "1 L",
    stackable: "Ja",
    storage_address: "Lager Hannover, Raum F3",
    gps: "52.3759, 9.7320",
    photo: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Sanitary_products.jpg",
    manual: "Damenhygiene_Info.pdf",
    safety_sheet: "Nicht erforderlich",
    transport_vehicle: "PKW",
    manpower: "1 Person",
    assembly_time: "Keine",
    deploy_time: "<6h",
    readiness: "Einsatzbereit",
    supplier: "CareLine GmbH",
    purchase_date: "2023-11-10",
    warranty: "2026-11-10",
    notes: "Kühl und trocken lagern.",
    
    packaging_type: "Karton / Palette (EU)",
    units_per_package: 30,
    package_size: "80 x 120 x 140 cm (Palette)",
    package_weight: "220 kg (Palette)",
    package_volume: "1.34 m³",
    oversize: false,
    min_vehicle: "Transporter",
    access: {
      anytime: false,
      location_type: "Tiefgarage",
      max_vehicle_height_m: 1.9,
      security_notes: "Schlüssel im Schlüsseltresor (Code).",
      access_hours: "06:00–22:00",
      contact_phone: "+49-511-787878",
    },
  },

  "BED-001": {
    item_id: "BED-001",
    item_name: "Feldbett",
    category: "Unterkunft",
    unit: "Stück",
    total_available: 200,
    in_use: 80,
    reserved: 40,
    damaged: 10,
    last_inspection: "2025-07-05",
    inspection_frequency: "Jährlich",
    responsible_person: "Stefan Richter",
    size: "200 x 70 x 45 cm",
    weight: "8 kg",
    volume: "0.63 m³",
    stackable: "Ja (zusammengeklappt)",
    storage_address: "Lager Hamburg, Zone A2",
    gps: "53.5511, 9.9937",
    photo: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Camp_bed.jpg",
    manual: "Feldbett_Manual.pdf",
    safety_sheet: "Nicht erforderlich",
    transport_vehicle: "LKW",
    manpower: "2 Personen",
    assembly_time: "10 Minuten",
    deploy_time: "<1 Tag",
    readiness: "Einsatzbereit",
    supplier: "SleepWell GmbH",
    purchase_date: "2023-05-15",
    warranty: "2027-05-15",
    notes: "Gelenke regelmäßig ölen.",
    
    packaging_type: "Bündel / Palette (EU)",
    units_per_package: 5, 
    package_size: "220 x 100 x 120 cm (Palette)",
    package_weight: "55 kg",
    package_volume: "2.64 m³",
    oversize: true,
    min_vehicle: "LKW",
    access: {
      anytime: false,
      location_type: "Tiefgarage",
      max_vehicle_height_m: 2.0,
      security_notes: "Höhenlimit beachten; Zufahrt über Tor B.",
      access_hours: "07:00–20:00",
      contact_phone: "+49-40-161616",
    },
  },
  "BLK-010": {
    item_id: "BLK-010",
    item_name: "Decke",
    category: "Unterkunft",
    unit: "Stück",
    total_available: 500,
    in_use: 100,
    reserved: 50,
    damaged: 5,
    last_inspection: "2025-08-01",
    inspection_frequency: "Jährlich",
    responsible_person: "Monika Lenz",
    size: "200 x 150 cm",
    weight: "1.5 kg",
    volume: "0.02 m³",
    stackable: "Ja",
    storage_address: "Lager Köln, Regal B1",
    gps: "50.9375, 6.9603",
    photo: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Blanket.jpg",
    manual: "Decke_Info.pdf",
    safety_sheet: "Nicht erforderlich",
    transport_vehicle: "LKW",
    manpower: "2 Personen",
    assembly_time: "Keine",
    deploy_time: "<8h",
    readiness: "Einsatzbereit",
    supplier: "WarmTex GmbH",
    purchase_date: "2023-11-11",
    warranty: "2028-11-11",
    notes: "Nach jedem Einsatz reinigen.",
    
    packaging_type: "Ballensack / Palette (EU)",
    units_per_package: 30,
    package_size: "80 x 120 x 180 cm (Palette, komprimiert)",
    package_weight: "90 kg",
    package_volume: "1.73 m³",
    oversize: false,
    min_vehicle: "Transporter",
    access: {
      anytime: true,
      location_type: "Ebenerdig",
      max_vehicle_height_m: null,
      security_notes: "Zugang frei, Tor mit PIN.",
      access_hours: "24/7",
      contact_phone: "+49-221-343434",
    },
  },
  "BED-002": {
    item_id: "BED-002",
    item_name: "Isomatte",
    category: "Unterkunft",
    unit: "Stück",
    total_available: 300,
    in_use: 50,
    reserved: 20,
    damaged: 5,
    last_inspection: "2025-09-01",
    inspection_frequency: "Jährlich",
    responsible_person: "Katrin Neumann",
    size: "190 x 60 x 3 cm",
    weight: "1.2 kg",
    volume: "0.03 m³",
    stackable: "Ja (gerollt)",
    storage_address: "Lager Zürich, Raum B5",
    gps: "50.1109, 8.6821",
    photo: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Sleeping_pad.jpg",
    manual: "Isomatte_Info.pdf",
    safety_sheet: "Nicht erforderlich",
    transport_vehicle: "PKW",
    manpower: "1 Person",
    assembly_time: "Keine",
    deploy_time: "<6h",
    readiness: "Einsatzbereit",
    supplier: "OutdoorComfort AG",
    purchase_date: "2023-06-30",
    warranty: "2027-06-30",
    notes: "Nach Gebrauch trocken aufrollen.",
    
    packaging_type: "Ballen / Palette (EU)",
    units_per_package: 20,
    package_size: "80 x 120 x 160 cm (Palette)",
    package_weight: "30 kg",
    package_volume: "1.54 m³",
    oversize: false,
    min_vehicle: "Transporter",
    access: {
      anytime: false,
      location_type: "Ebenerdig",
      max_vehicle_height_m: null,
      security_notes: "Zugang über Tor 1.",
      access_hours: "08:00–18:00",
      contact_phone: "+41-44-565656",
    },
  },
  "BED-003": {
    item_id: "BED-003",
    item_name: "Kopfkissen",
    category: "Unterkunft",
    unit: "Stück",
    total_available: 400,
    in_use: 100,
    reserved: 60,
    damaged: 4,
    last_inspection: "2025-07-12",
    inspection_frequency: "Jährlich",
    responsible_person: "Laura Becker",
    size: "60 x 40 cm",
    weight: "800 g",
    volume: "0.04 m³",
    stackable: "Ja",
    storage_address: "Lager Berlin, Regal K2",
    gps: "52.5200, 13.4050",
    photo: "https://upload.wikimedia.org/wikipedia/commons/9/92/Pillow.jpg",
    manual: "Kopfkissen_Info.pdf",
    safety_sheet: "Nicht erforderlich",
    transport_vehicle: "PKW",
    manpower: "1 Person",
    assembly_time: "Keine",
    deploy_time: "<6h",
    readiness: "Einsatzbereit",
    supplier: "SoftRest GmbH",
    purchase_date: "2024-01-12",
    warranty: "2027-01-12",
    notes: "Regelmäßig lüften und waschen.",
    
    packaging_type: "Sack / Palette (EU)",
    units_per_package: 25,
    package_size: "80 x 120 x 200 cm (Palette, leicht)",
    package_weight: "60 kg",
    package_volume: "1.92 m³",
    oversize: false,
    min_vehicle: "Transporter",
    access: {
      anytime: true,
      location_type: "Ebenerdig",
      max_vehicle_height_m: null,
      security_notes: "Zugang frei.",
      access_hours: "24/7",
      contact_phone: "+49-30-252525",
    },
  },
  "BED-004": {
    item_id: "BED-004",
    item_name: "Zelt (6 Personen)",
    category: "Unterkunft",
    unit: "Stück",
    total_available: 80,
    in_use: 25,
    reserved: 10,
    damaged: 3,
    last_inspection: "2025-06-20",
    inspection_frequency: "Jährlich",
    responsible_person: "Thomas Berger",
    size: "400 x 300 x 220 cm",
    weight: "15 kg",
    volume: "2.6 m³",
    stackable: "Nein",
    storage_address: "Lager Köln, Raum A7",
    gps: "50.9375, 6.9603",
    photo: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Camping_tent_example.jpg",
    manual: "Zelt_Aufbauanleitung.pdf",
    safety_sheet: "Nicht erforderlich",
    transport_vehicle: "LKW",
    manpower: "3 Personen",
    assembly_time: "45 Minuten",
    deploy_time: "1 Tag",
    readiness: "Bereit zur Ausgabe",
    supplier: "CampTech Solutions",
    purchase_date: "2022-05-05",
    warranty: "2027-05-05",
    notes: "Regelmäßig auf Dichtigkeit prüfen.",
    
    packaging_type: "Einzeltasche / Palette (Sondermaß)",
    units_per_package: 2,
    package_size: "240 x 120 x 120 cm (Palette)",
    package_weight: "40 kg",
    package_volume: "3.46 m³",
    oversize: true,
    min_vehicle: "LKW",
    access: {
      anytime: false,
      location_type: "Rampe",
      max_vehicle_height_m: null,
      security_notes: "Sperrige Ware – Stapler notwendig.",
      access_hours: "07:00–17:00",
      contact_phone: "+49-221-121212",
    },
  },
};

const PRIORITIES = [
  { label: "hoch", value: "hoch" },
  { label: "mittel", value: "mittel" },
  { label: "niedrig", value: "niedrig" },
];

export default function ItemDetailPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { addRequest } = useRequests();

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
    if (!form.organization_name?.trim())
      return "Organisation ist erforderlich.";
    if (!form.facility_name?.trim()) return "Einrichtung ist erforderlich.";
    if (!form.address?.trim()) return "Adresse ist erforderlich.";
    if (!form.email?.includes("@")) return "Bitte eine gültige E-Mail angeben.";
    if (Number(form.quantity_requested) <= 0)
      return "Menge muss größer als 0 sein.";
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
    addRequest(newRequest);
    const storeKey = "aoz_requests";
    const existing = JSON.parse(localStorage.getItem(storeKey) || "[]");
    localStorage.setItem(storeKey, JSON.stringify([newRequest, ...existing]));
    setSent(true);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 8 } }}>
      <Grid container spacing={3}>
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

              <Grid
  item
  xs={12}
  sm={4}
  sx={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  }}
>
  <TextField
    select
    fullWidth
    label="Lieferung in Tiefgarage"
    value={form.delivery_in_tiefgarage || "nein"}
    onChange={(e) =>
      setForm((f) => ({ ...f, delivery_in_tiefgarage: e.target.value }))
    }
    InputLabelProps={{
      shrink: true,
      style: { whiteSpace: "normal", overflow: "visible" }, 
    }}
    sx={{
      minWidth: 195, 
      "& .MuiInputLabel-root": {
        whiteSpace: "normal",
        width: "100%",
      },
    }}
  >
    <MenuItem value="ja">Ja</MenuItem>
    <MenuItem value="nein">Nein</MenuItem>
  </TextField>
</Grid>



              {form.delivery_in_tiefgarage === "ja" && item.access?.max_vehicle_height_m && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Max. Fahrzeughöhe (m)"
                    value={`${item.access.max_vehicle_height_m} m`}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              )}
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
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Artikel
            </Typography>

            <Stack spacing={1.2}>
              <Row label="Bezeichnung" value={item.item_name} />
              <Row label="Kategorie" value={item.category} />
              <Row label="Einheit" value={item.unit} />
            </Stack>
            <Divider sx={{ my: 2 }} />

            <Stack spacing={1.2}>
              <Row label="Verfügbar" value={item.total_available ?? "–"} />
              <Row label="In Verwendung" value={item.in_use ?? "–"} />
              <Row label="Reserviert" value={item.reserved ?? "–"} />
              <Row label="Beschädigt" value={item.damaged ?? "–"} />
            </Stack>
            <Divider sx={{ my: 2 }} />

            <Stack spacing={1.2}>
              <Row label="Letzte Prüfung" value={item.last_inspection ?? "–"} />
              <Row label="Prüfintervall" value={item.inspection_frequency ?? "–"} />
              <Row label="Verantwortlich" value={item.responsible_person ?? "–"} />
            </Stack>
            <Divider sx={{ my: 2 }} />

            <Stack spacing={1.2}>
              <Row label="Größe (L/B/H)" value={item.size ?? "–"} />
              <Row label="Gewicht" value={item.weight ?? "–"} />
              <Row label="Volumen" value={item.volume ?? "–"} />
              <Row label="Stapelfähig" value={item.stackable ?? "–"} />
            </Stack>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Verpackung
            </Typography>
            <Stack spacing={1.2}>
              <Row label="Art" value={item.packaging_type ?? "–"} />
              <Row label="Einheiten pro Verpackung" value={item.units_per_package ?? "–"} />
              <Row label="Paketmaße" value={item.package_size ?? "–"} />
              <Row label="Paketgewicht" value={item.package_weight ?? "–"} />
              <Row label="Paketvolumen" value={item.package_volume ?? "–"} />
            </Stack>
            <Divider sx={{ my: 2 }} />

            <Stack spacing={1.2}>
              <Row label="Lagerort" value={item.storage_address ?? "–"} />
              <Row label="GPS" value={item.gps ?? "–"} />
            </Stack>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Zugang & Sicherheit (Lagerort)
            </Typography>
            <Stack spacing={1.2}>
              <Row label="Zugang jederzeit" value={item.access?.anytime ? "Ja" : "Nein"} />
              <Row label="Lagerort-Typ" value={item.access?.location_type ?? "–"} />
              <Row
                label="Max. Fahrzeughöhe"
                value={
                  item.access?.max_vehicle_height_m
                    ? `${item.access.max_vehicle_height_m} m`
                    : "–"
                }
              />
              <Row label="Öffnungszeiten" value={item.access?.access_hours ?? "–"} />
              <Row label="Sicherheit/Schlüssel" value={item.access?.security_notes ?? "–"} />
              <Row label="Kontakt (Telefon)" value={item.access?.contact_phone ?? "–"} />
            </Stack>
            <Divider sx={{ my: 2 }} />

            <Stack spacing={1.2}>
              <Typography variant="subtitle2">Fotos & Dokumente</Typography>
              {item.photo && (
                <img
                  src={item.photo}
                  alt={item.item_name}
                  style={{ width: "100%", borderRadius: 8 }}
                />
              )}
              <Row label="Handbuch" value={item.manual ?? "–"} />
              <Row label="Sicherheitsdatenblatt" value={item.safety_sheet ?? "–"} />
            </Stack>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Transport / Fahrzeug
            </Typography>
            <Stack spacing={1.2}>
              <Row label="Fahrzeugtyp (Standard)" value={item.transport_vehicle ?? "–"} />
              <Row label="Mindestfahrzeug" value={item.min_vehicle ?? "–"} />
              <Row label="Oversize / Übergröße" value={item.oversize ? "Ja" : "Nein"} />
              <Row label="Personalbedarf" value={item.manpower ?? "–"} />
              <Row label="Aufbauzeit" value={item.assembly_time ?? "–"} />
            </Stack>
            <Divider sx={{ my: 2 }} />

            <Stack spacing={1.2}>
              <Row label="Bereitstellungszeit" value={item.deploy_time ?? "–"} />
              <Row label="Status" value={item.readiness ?? "–"} />
            </Stack>
            <Divider sx={{ my: 2 }} />

            <Stack spacing={1.2}>
              <Row label="Lieferant" value={item.supplier ?? "–"} />
              <Row label="Kaufdatum" value={item.purchase_date ?? "–"} />
              <Row label="Garantie / Ablauf" value={item.warranty ?? "–"} />
            </Stack>
            <Divider sx={{ my: 2 }} />

            <Row label="Notizen" value={item.notes ?? "–"} />
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
      <Typography sx={{ minWidth: 180, color: "text.secondary" }}>
        {label}:
      </Typography>
      <Typography>{value}</Typography>
    </Stack>
  );
}
