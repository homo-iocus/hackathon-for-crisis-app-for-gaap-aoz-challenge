import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRequests } from "../context/RequestsContext";
import { STATUS_LABELS } from "../screens/dashboard";

const RequestList = () => {
  const navigate = useNavigate();
  const { requests } = useRequests();

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "fulfilled":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Grid container spacing={3} sx={{ p: 2, mt: 2 }}>
      {requests.map((req) => (
        <Grid item xs={12} md={6} sx={{ display: "flex" }} key={req.request_id}>
          <Card
            sx={{
              p: 2,
              boxShadow: 3,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              {/* Header: Organization + Status */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Typography variant="h6">
                  {req.requested_by.organization_name}
                </Typography>
                <Chip
                  label={STATUS_LABELS[req.status].toUpperCase()}
                  color={getStatusColor(req.status)}
                />
              </Stack>

              {/* Facility */}
              <Typography variant="body1" color="text.secondary">
                {req.delivery_location.facility_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {req.delivery_location.address}
              </Typography>

              {/* Request ID (de-emphasized) */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 1 }}
              >
                Anfrage-ID: {req.request_id}
              </Typography>

              <Divider sx={{ my: 1.5 }} />

              {/* Items List */}
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Angeforderte Artikel:
              </Typography>
              <List dense disablePadding>
                {req.requested_items.map((item, index) => (
                  <ListItem key={index} disableGutters sx={{ py: 0.3 }}>
                    <ListItemText
                      primary={`${item.item_name} (${item.quantity_requested} ${item.unit})`}
                      secondary={`Priorität: ${item.priority}`}
                      primaryTypographyProps={{ variant: "body2" }}
                      secondaryTypographyProps={{
                        variant: "caption",
                        color: "text.secondary",
                      }}
                    />
                  </ListItem>
                ))}
              </List>

              <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                Lieferung bis:{" "}
                <strong>
                  {new Date(req.requested_delivery_date).toLocaleDateString(
                    "de",
                  )}
                </strong>
              </Typography>

              {/* Notes */}
              {req.notes && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5, fontStyle: "italic" }}
                >
                  „{req.notes}“
                </Typography>
              )}

              <Button
                variant="contained"
                sx={{ mt: "auto" }}
                onClick={() => navigate(`/request/${req.request_id}`)}
              >
                Details anzeigen
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default RequestList;
