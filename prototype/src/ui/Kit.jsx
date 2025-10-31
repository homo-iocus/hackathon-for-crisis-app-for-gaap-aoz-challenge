import React from 'react'
import { Box, Card, CardContent, Stack, Typography, Chip, LinearProgress, Divider, Toolbar } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

export function PageHeader({ icon, title, subtitle, right }) {
  return (
    <Box sx={{ position:'sticky', top:0, zIndex:1, bgcolor:'background.default', borderBottom:1, borderColor:'divider' }}>
      <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flex:1 }}>
          {icon}
          <Typography variant="h6" fontWeight={700}>{title}</Typography>
          {subtitle && <Typography variant="body2" color="text.secondary" sx={{ ml:1 }}>{subtitle}</Typography>}
        </Stack>
        <Stack direction="row" spacing={1}>
          {right}
        </Stack>
      </Toolbar>
    </Box>
  )
}

export function Section({ title, action, children }) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" sx={{ mb:1 }}>
          <Typography variant="h6" sx={{ flex:1 }}>{title}</Typography>
          {action}
        </Stack>
        {children}
      </CardContent>
    </Card>
  )
}

export function KPI({ title, value, hint, icon }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center">
          {icon}
          <Typography variant="body2" color="text.secondary">{title}</Typography>
        </Stack>
        <Typography variant="h5" fontWeight={800}>{value}</Typography>
        {hint && <Typography variant="caption" color="text.secondary">{hint}</Typography>}
      </CardContent>
    </Card>
  )
}

export function StatusPill({ level, label }) {
  const map = {
    ok:   { color:'success', icon:<CheckCircleOutlineIcon fontSize="small" /> },
    warn: { color:'warning', icon:<WarningAmberOutlinedIcon fontSize="small" /> },
    krit: { color:'error',   icon:<ErrorOutlineIcon fontSize="small" /> }
  }
  const { color, icon } = map[level] || map.ok
  return <Chip size="small" color={color} variant="filled" icon={icon} label={label} />
}

export function ReadinessBar({ value, need }) {
  const pct = Math.min(100, Math.round((value/Math.max(need,1))*100))
  const color = value>=need ? 'success' : (value>=0.7*need ? 'warning' : 'error')
  return (
    <Stack spacing={0.5}>
      <LinearProgress variant="determinate" value={pct} color={color} sx={{ height:10, borderRadius:1 }}/>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="caption" color="text.secondary">{pct}% Deckung</Typography>
        <Typography variant="caption" color="text.secondary">{value}/{need}</Typography>
      </Stack>
    </Stack>
  )
}

export function Donut({ value=0, size=56, thickness=6, label }) {
  const pct = Math.max(0, Math.min(100, value))
  const angle = (pct/100)*360
  return (
    <Box sx={{ position:'relative', width:size, height:size }}>
      <Box sx={{
        position:'absolute', inset:0, borderRadius:'50%',
        background: `conic-gradient(var(--mui-palette-primary-main) ${angle}deg, var(--mui-palette-action-hover) ${angle}deg)`
      }}/>
      <Box sx={{
        position:'absolute', inset:thickness, borderRadius:'50%', bgcolor:'background.paper',
        display:'flex', alignItems:'center', justifyContent:'center'
      }}>
        <Typography variant="caption" fontWeight={700}>{pct}%</Typography>
      </Box>
      {label && <Typography variant="caption" color="text.secondary" sx={{ display:'block', textAlign:'center', mt:0.5 }}>{label}</Typography>}
    </Box>
  )
}

export function ToolbarHint({ children }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ px:1, py:0.5, bgcolor:'warning.light', borderRadius:1, color:'warning.contrastText' }}>
      <WarningAmberOutlinedIcon fontSize="small" />
      <Typography variant="caption" sx={{ fontWeight:700 }}>{children}</Typography>
    </Stack>
  )
}

export function ActionBar({ children }) {
  return (
    <Stack direction={{ xs:'column', sm:'row' }} spacing={1} alignItems={{ xs:'stretch', sm:'center' }}>
      {children}
    </Stack>
  )
}

export function DividerMuted() {
  return <Divider sx={{ my:1.5, opacity:0.5 }} />
}
