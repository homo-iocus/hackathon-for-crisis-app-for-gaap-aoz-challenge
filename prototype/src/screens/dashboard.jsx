import * as React from 'react'
import { Box, Grid, Typography, Stack, Button, Paper, Tooltip } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded'
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded'
import SanitizerIcon from '@mui/icons-material/Sanitizer'
import HotelRoundedIcon from '@mui/icons-material/HotelRounded'

const AREAS = [
  {
    id: 'medical',
    title: 'Erstversorgung (medizinisch)',
    icon: <MedicalServicesRoundedIcon fontSize="medium" />,
    color: 'primary',
    hint: 'Verbandmaterial, Erste-Hilfe, einfache Medikation',
  },
  {
    id: 'food',
    title: 'Verpflegung',
    icon: <RestaurantRoundedIcon fontSize="medium" />,
    color: 'secondary',
    hint: 'Lebensmittel, warme/kalte Mahlzeiten, Wasser',
  },
  {
    id: 'hygiene',
    title: 'Hygiene-Artikel',
    icon: <SanitizerIcon fontSize="medium" />,
    color: 'warning',
    hint: 'Seife, Desinfektion, Windeln, Damenhygiene',
  },
  {
    id: 'accommodation',
    title: 'Unterkunft',
    icon: <HotelRoundedIcon fontSize="medium" />,
    color: 'success',
    hint: 'Betten, Matratzen, Decken, Kissen',
  },
]

function AreaCard({ area, onClick }) {
  return (
    <Paper
      variant="outlined"
      onClick={onClick}
      sx={{
        p: 2.5,
        borderRadius: 3,
        borderColor: 'divider',
        cursor: 'pointer',
        boxShadow: (t) => t.shadows[1],
        transition: 'all .15s ease',
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{
            width: 50,
            height: 50,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            bgcolor: 'action.hover',
            color: `${area.color}.main`,
          }}
        >
          {area.icon}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography fontWeight={700}>{area.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {area.hint}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        bgcolor: 'background.default',
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 4 },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Übersicht
        </Typography>
      </Stack>

      <Typography
        variant="subtitle1"
        sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}
      >
        Was können wir tun? (Handlungsbereiche)
      </Typography>

      <Grid container spacing={2}>
        {AREAS.map((a) => (
          <Grid key={a.id} item xs={12} sm={6} md={4} lg={3}>
            <AreaCard area={a} onClick={() => navigate(`/category/${a.id}`)} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
