import React from 'react'
import { Stack, Typography, Divider } from '@mui/material'

// Central source of truth for packaging/transport/access metadata
export const ITEM_META = {
  // ---- CentralStorage items ----
  'Essenspaket A': {
    packaging_type: 'Kiste / Palette (EU)',
    units_per_package: 12,
    package_size: '80 x 120 x 150 cm (Palette)',
    package_weight: '300 kg',
    package_volume: '1.44 m³',
    oversize: false,
    min_vehicle: 'Transporter',
    access: {
      anytime: false, location_type: 'Rampe', max_vehicle_height_m: null,
      security_notes: 'Warenausgabe Tor 3', access_hours: '08:00–18:00', contact_phone: '+41 44 000 00 00'
    }
  },
  'Essenspaket B': {
    packaging_type: 'Kiste / Palette (EU)',
    units_per_package: 12,
    package_size: '80 x 120 x 150 cm (Palette)',
    package_weight: '300 kg',
    package_volume: '1.44 m³',
    oversize: false,
    min_vehicle: 'Transporter',
    access: {
      anytime: false, location_type: 'Tiefgarage', max_vehicle_height_m: 2.0,
      security_notes: 'Schranke, Transponder', access_hours: '06:00–22:00', contact_phone: '+41 44 000 00 02'
    }
  },
  'Hygiene-Set A': {
    packaging_type: 'Karton / Palette',
    units_per_package: 24,
    package_size: '80 x 120 x 140 cm (Palette)',
    package_weight: '480–500 kg',
    package_volume: '1.34 m³',
    oversize: false,
    min_vehicle: 'Transporter',
    access: {
      anytime: true, location_type: 'Ebenerdig', max_vehicle_height_m: null,
      security_notes: 'Code an der Tür', access_hours: '24/7', contact_phone: '+41 44 000 00 01'
    }
  },
  'Hygiene-Set B': {
    packaging_type: 'Karton / Palette',
    units_per_package: 24,
    package_size: '80 x 120 x 140 cm (Palette)',
    package_weight: '480 kg',
    package_volume: '1.34 m³',
    oversize: false,
    min_vehicle: 'Transporter',
    access: {
      anytime: true, location_type: 'Ebenerdig', max_vehicle_height_m: null,
      security_notes: 'Torcode telefonisch', access_hours: '24/7', contact_phone: '+41 44 000 00 05'
    }
  },
  'Bett Single': {
    packaging_type: 'Bündel / Palette (EU)',
    units_per_package: 5,
    package_size: '220 x 100 x 120 cm (Palette)',
    package_weight: '55 kg',
    package_volume: '2.64 m³',
    oversize: true,
    min_vehicle: 'LKW',
    access: {
      anytime: false, location_type: 'Tiefgarage', max_vehicle_height_m: 2.0,
      security_notes: 'Zufahrt Tor B', access_hours: '07:00–20:00', contact_phone: '+41 44 000 00 03'
    }
  },
  Schrank: {
    packaging_type: 'Kiste',
    units_per_package: 1,
    package_size: '120 x 60 x 200 cm',
    package_weight: '45 kg',
    package_volume: '0.9 m³',
    oversize: true,
    min_vehicle: 'LKW',
    access: {
      anytime: false, location_type: 'Rampe', max_vehicle_height_m: null,
      security_notes: 'Stapler benötigt', access_hours: '07:00–17:00', contact_phone: '+41 44 000 00 04'
    }
  },

  // ---- OrgMaintenance items ----
  'Schrank abschließbar': {
    packaging_type: 'Kiste',
    units_per_package: 1,
    package_size: '120 x 60 x 200 cm',
    package_weight: '45 kg',
    package_volume: '0.9 m³',
    oversize: true,
    min_vehicle: 'LKW',
    access: {
      anytime: false, location_type: 'Rampe', max_vehicle_height_m: null,
      security_notes: 'Stapler notwendig', access_hours: '07:00–17:00', contact_phone: '+41 44 000 10 02'
    }
  },
}

// Safe getter
export const getItemMeta = (name) => ITEM_META[name] || null

// Compact details block used inside a Tooltip
export const UnifiedDetails = ({ meta }) => {
  if (!meta) return <Typography variant="body2">Keine Detaildaten hinterlegt.</Typography>
  const a = meta.access || {}
  return (
    <Stack spacing={0.5} sx={{ minWidth: 280 }}>
      <Typography variant="subtitle2">Verpackung</Typography>
      <Typography variant="body2">Art: {meta.packaging_type || '—'}</Typography>
      <Typography variant="body2">Einheiten/Verpackung: {meta.units_per_package ?? '—'}</Typography>
      <Typography variant="body2">Paketmaße: {meta.package_size || '—'}</Typography>
      <Typography variant="body2">Paketgewicht: {meta.package_weight || '—'}</Typography>
      <Typography variant="body2">Paketvolumen: {meta.package_volume || '—'}</Typography>
      <Divider sx={{ my: 0.5 }} />
      <Typography variant="subtitle2">Transport</Typography>
      <Typography variant="body2">Mindestfahrzeug: {meta.min_vehicle || '—'}</Typography>
      <Typography variant="body2">Übergröße: {meta.oversize ? 'Ja' : 'Nein'}</Typography>
      <Divider sx={{ my: 0.5 }} />
      <Typography variant="subtitle2">Zugang & Sicherheit</Typography>
      <Typography variant="body2">Typ: {a.location_type || '—'}</Typography>
      <Typography variant="body2">24/7: {a.anytime ? 'Ja' : 'Nein'}</Typography>
      <Typography variant="body2">Max. Höhe: {a.max_vehicle_height_m ? `${a.max_vehicle_height_m} m` : '—'}</Typography>
      <Typography variant="body2">Öffnungszeiten: {a.access_hours || '—'}</Typography>
      <Typography variant="body2">Sicherheit: {a.security_notes || '—'}</Typography>
      <Typography variant="body2">Kontakt: {a.contact_phone || '—'}</Typography>
    </Stack>
  )
}

// (Optional) locale helpers if you want them here, too
export const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('de-CH') : '—'
export const fmtDateTime = (iso) => iso ? new Date(iso).toLocaleString('de-CH', { hour12:false }) : '—'