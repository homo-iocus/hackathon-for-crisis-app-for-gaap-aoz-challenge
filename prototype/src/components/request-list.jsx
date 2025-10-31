import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRequests } from "../context/RequestsContext";

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
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {requests.map((req) => (
        <Grid item xs={12} md={6} key={req.request_id}>
          <Card sx={{ p: 2, boxShadow: 3 }}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">{req.request_id}</Typography>
                <Chip
                  label={req.status.toUpperCase()}
                  color={getStatusColor(req.status)}
                />
              </Stack>

              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Organisation:</strong>{" "}
                {req.requested_by.organization_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {req.delivery_location.facility_name}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {req.requested_items.length} Artikel ·{" "}
                {new Date(req.requested_delivery_date).toLocaleDateString()}
              </Typography>

              <Button
                variant="contained"
                sx={{ mt: 2 }}
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
