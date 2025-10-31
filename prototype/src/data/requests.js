// src/data/requests.js
export const initialRequests = [
  {
    request_id: "REQ-2025-1031-001",
    timestamp: "2025-10-31T10:45:00Z",
    request_type: "inventory_request",
    requested_by: {
      organization_name: "Deutsches Rotes Kreuz",
      contact_person: "Anna Müller",
      email: "anna.mueller@drk.de",
      phone: "+49-30-1234567",
    },
    delivery_location: {
      facility_name: "Notunterkunft Berlin-Mitte",
      address: "Leipziger Str. 45, 10117 Berlin, Germany",
    },
    requested_items: [
      {
        item_id: "BED-001",
        item_name: "Feldbett",
        category: "Schlafausrüstung",
        quantity_requested: 150,
        unit: "Stück",
        priority: "hoch",
      },
      {
        item_id: "BLK-010",
        item_name: "Decke",
        category: "Textilien",
        quantity_requested: 300,
        unit: "Stück",
        priority: "mittel",
      },
    ],
    requested_delivery_date: "2025-11-02",
    notes: "Bitte Lieferung bis Sonntagmittag.",
    status: "pending",
  },
  {
    request_id: "REQ-2025-1031-002",
    timestamp: "2025-10-31T11:00:00Z",
    request_type: "inventory_request",
    requested_by: {
      organization_name: "THW München",
      contact_person: "Lukas Schneider",
      email: "lukas.schneider@thw.de",
      phone: "+49-89-9876543",
    },
    delivery_location: {
      facility_name: "Hilfslager München Ost",
      address: "Rosenheimer Str. 200, 81669 München, Germany",
    },
    requested_items: [
      {
        item_id: "WTR-020",
        item_name: "Trinkwasserkanister (10L)",
        category: "Versorgung",
        quantity_requested: 100,
        unit: "Kanister",
        priority: "hoch",
      },
    ],
    requested_delivery_date: "2025-11-03",
    notes: "Für Einsatzgebiet Süd.",
    status: "approved",
  },
]
