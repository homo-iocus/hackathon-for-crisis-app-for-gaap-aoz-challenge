from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import json
from pathlib import Path

# ---------- CONFIG ----------

DATA_FILE = Path("requests_data.json")

app = FastAPI(title="Hilfsgüter Inventory API", version="1.1.0")

# ---------- MODELS ----------


class RequestedItem(BaseModel):
    item_id: str
    item_name: str
    category: str
    quantity_requested: int
    unit: str
    priority: str


class RequestedBy(BaseModel):
    organization_name: str
    contact_person: str
    email: str
    phone: str


class DeliveryLocation(BaseModel):
    facility_name: str
    address: str


class Request(BaseModel):
    request_id: str
    timestamp: datetime
    request_type: str
    requested_by: RequestedBy
    delivery_location: DeliveryLocation
    requested_items: List[RequestedItem]
    requested_delivery_date: datetime
    notes: Optional[str] = None
    status: str = Field(default="pending")


# ---------- PERSISTENCE HELPERS ----------


def load_requests() -> List[Request]:
    """Load requests from disk, or return default data if missing."""
    if not DATA_FILE.exists():
        save_requests(default_data())
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return [Request(**r) for r in data]


def save_requests(requests: List[Request]):
    """Save requests to disk (as JSON)."""
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump([r.dict() for r in requests], f, indent=2, default=str)


def default_data() -> List[Request]:
    """Default request list for first-time setup."""
    return [
        Request(
            request_id="REQ-2025-1031-001",
            timestamp=datetime(2025, 10, 31, 10, 45),
            request_type="inventory_request",
            requested_by=RequestedBy(
                organization_name="Deutsches Rotes Kreuz",
                contact_person="Anna Müller",
                email="anna.mueller@drk.de",
                phone="+49-30-1234567",
            ),
            delivery_location=DeliveryLocation(
                facility_name="Notunterkunft Berlin-Mitte",
                address="Leipziger Str. 45, 10117 Berlin, Germany",
            ),
            requested_items=[
                RequestedItem(
                    item_id="BED-001",
                    item_name="Feldbett",
                    category="Schlafausrüstung",
                    quantity_requested=150,
                    unit="Stück",
                    priority="hoch",
                ),
                RequestedItem(
                    item_id="BLK-010",
                    item_name="Decke",
                    category="Textilien",
                    quantity_requested=300,
                    unit="Stück",
                    priority="mittel",
                ),
            ],
            requested_delivery_date=datetime(2025, 11, 2),
            notes="Bitte Lieferung bis Sonntagmittag.",
            status="pending",
        )
    ]


# ---------- DATA INITIALIZATION ----------

requests_db: List[Request] = load_requests()

# ---------- ENDPOINTS ----------


@app.get("/requests", response_model=List[Request])
def get_all_requests():
    """Return all stored requests."""
    return requests_db


@app.get("/requests/{request_id}", response_model=Request)
def get_request(request_id: str):
    """Return a single request by ID."""
    for req in requests_db:
        if req.request_id == request_id:
            return req
    raise HTTPException(status_code=404, detail="Request not found")


@app.put("/requests/{request_id}", response_model=Request)
def update_request(request_id: str, updated_request: Request):
    """Update an existing request and persist to disk."""
    for i, req in enumerate(requests_db):
        if req.request_id == request_id:
            requests_db[i] = updated_request
            save_requests(requests_db)
            return updated_request
    raise HTTPException(status_code=404, detail="Request not found")


@app.post("/requests/reset")
def reset_data():
    """Reset data to default and save."""
    global requests_db
    requests_db = default_data()
    save_requests(requests_db)
    return {"status": "reset", "count": len(requests_db)}
