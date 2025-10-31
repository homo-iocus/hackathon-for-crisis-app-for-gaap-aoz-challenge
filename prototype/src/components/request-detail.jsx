import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Select,
  MenuItem,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  Business as BusinessIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useRequests } from "../context/RequestsContext";
import { STATUS_LABELS } from "../screens/dashboard";

const RequestDetail = ({ request }) => {
  const { updateRequest } = useRequests();

  const [editing, setEditing] = useState(false);
  const [editedItems, setEditedItems] = useState(request.requested_items);
  const [status, setStatus] = useState(request.status);

  const handleQuantityChange = (index, value) => {
    const updated = [...editedItems];
    updated[index].quantity_requested = parseInt(value) || 0;
    setEditedItems(updated);
  };

  const handleSave = () => {
    updateRequest(request.request_id, {
      requested_items: editedItems,
      status,
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditedItems(request.requested_items);
    setStatus(request.status);
    setEditing(false);
  };

  return (
    <Card sx={{ maxWidth: 1000, mx: "auto", my: 4, p: 2, boxShadow: 5 }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Anfrage: {request.request_id}
          </Typography>

          {!editing ? (
            <Tooltip title="Bearbeiten">
              <IconButton onClick={() => setEditing(true)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Stack direction="row" spacing={1}>
              <Tooltip title="Speichern">
                <IconButton color="success" onClick={handleSave}>
                  <SaveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Abbrechen">
                <IconButton color="error" onClick={handleCancel}>
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Chip
            label={STATUS_LABELS[status].toUpperCase()}
            color={
              status === "pending"
                ? "warning"
                : status === "approved"
                  ? "success"
                  : status === "fulfilled"
                    ? "info"
                    : "default"
            }
          />
          <Stack direction="row" spacing={1} alignItems="center">
            <AccessTimeIcon fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {new Date(request.timestamp).toLocaleString()}
            </Typography>
          </Stack>
          {editing && (
            <Select
              size="small"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              sx={{ ml: 2 }}
            >
              <MenuItem value="pending">{STATUS_LABELS["pending"]}</MenuItem>
              <MenuItem value="approved">{STATUS_LABELS["approved"]}</MenuItem>
              <MenuItem value="default">{STATUS_LABELS["default"]}</MenuItem>
              <MenuItem value="rejected">{STATUS_LABELS["rejected"]}</MenuItem>
            </Select>
          )}
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* Requester Info */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Stack direction="row" spacing={1} alignItems="center">
              <BusinessIcon color="primary" />
              <Typography variant="h6">Angefordert von</Typography>
            </Stack>
            <Typography>{request.requested_by.organization_name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {request.requested_by.contact_person}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {request.requested_by.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {request.requested_by.phone}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Stack direction="row" spacing={1} alignItems="center">
              <LocationOnIcon color="primary" />
              <Typography variant="h6">Lieferort</Typography>
            </Stack>
            <Typography>{request.delivery_location.facility_name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {request.delivery_location.address}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Items Table */}
        <Typography variant="h6" gutterBottom>
          Angeforderte Artikel
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Artikel-ID</TableCell>
              <TableCell>Bezeichnung</TableCell>
              <TableCell align="right">Menge</TableCell>
              <TableCell>Einheit</TableCell>
              <TableCell>Priorität</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {editedItems.map((item, index) => (
              <TableRow key={item.item_id}>
                <TableCell>{item.item_id}</TableCell>
                <TableCell>{item.item_name}</TableCell>
                <TableCell align="right">
                  {editing ? (
                    <TextField
                      type="number"
                      size="small"
                      value={item.quantity_requested}
                      onChange={(e) =>
                        handleQuantityChange(index, e.target.value)
                      }
                      sx={{ width: 90 }}
                    />
                  ) : (
                    item.quantity_requested.toLocaleString()
                  )}
                </TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>
                  <Chip
                    label={item.priority}
                    color={
                      item.priority === "hoch"
                        ? "error"
                        : item.priority === "mittel"
                          ? "warning"
                          : "default"
                    }
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Divider sx={{ my: 3 }} />
        <Box>
          <Typography variant="body1">
            <strong>Gewünschtes Lieferdatum:</strong>{" "}
            {new Date(request.requested_delivery_date).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            <strong>Bemerkungen:</strong> {request.notes}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RequestDetail;
