import React, { useMemo, useState } from 'react'
import {
  Box, Container, Grid, Card, CardContent, Stack, Typography, Button, Chip,
  TextField, MenuItem, Table, TableHead, TableRow, TableCell, TableBody, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider, Alert, IconButton
} from '@mui/material'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined'
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined'
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined'
import SwapVertOutlinedIcon from '@mui/icons-material/SwapVertOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

// 👉 single, correct import of your UI kit:
import {
  PageHeader, Section, KPI, StatusPill, ReadinessBar, Donut, ToolbarHint, ActionBar, DividerMuted
} from '../ui/Kit.jsx'

// -----------------------------------------------------
// Rollen & Berechtigungen (RBAC – Prototyp, clientseitig)
// -----------------------------------------------------
const ROLES = [
  { key: 'sysadmin',      label: 'System Admin (Stadt IT)' },
  { key: 'krisenstab',    label: 'Krisenstab' },
  { key: 'priority',      label: 'Priority Manager' },
  { key: 'invmanager',    label: 'Inventory Manager (Org-Ebene)' },
  { key: 'logistics',     label: 'Logistics Coordinator' },
  { key: 'viewer',        label: 'Viewer (Read-only)' },
]

const PERMISSIONS = {
  sysadmin:   ['view','import','export','add','edit','delete','schedule','fifo','downloadTemplates','rbac'],
  krisenstab: ['view','export','schedule','fifo'],
  priority:   ['view','export','schedule'],
  invmanager: ['view','import','export','add','edit','delete','schedule','fifo','downloadTemplates'],
  logistics:  ['view','export','schedule'],
  viewer:     ['view'],
}

const has = (role, perm) => PERMISSIONS[role]?.includes(perm)

// ---------------------------------------
// Mockdaten – Organisation & Lagerobjekte
// ---------------------------------------
const myOrgName = 'Zivilschutz Stadt Zürich – Halle Nord'
const NOW = new Date()
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate()+n); return x }
const daysLeft = (iso) => iso ? Math.ceil((new Date(iso) - NOW)/(1000*3600*24)) : null

const INITIAL_ITEMS = [
  { id:'it1', name:'Bett Single', cat:'Unterkunft', qty:180, reserved:20, min:200,
    last:'2025-07-12', freqDays:180, next:'2026-01-08',
    size:'200x90x50cm', weight:'24kg', volume:'0.4m³', stack:'Ja',
    location:'Halle Nord – Reihe A – Fach 3', gps:null,
    perishable:false, transport:{veh:'LKW', ppl:2, assembly:'10min/Stk'},
    supplier:'SwissBeds AG', purchase:'2024-05-15', warranty:'2027-05-15',
    photo:true, doc:'Bett-Aufbau.pdf', deployH:6, statusNote:'OK'
  },
  { id:'it2', name:'Hygiene-Set A', cat:'Hygiene', qty:520, reserved:0, min:400,
    last:'2025-10-01', freqDays:90,  next:'2025-12-30',
    size:'35x25x15cm', weight:'1.2kg', volume:'0.01m³', stack:'Ja',
    location:'Halle Nord – Reihe B – Palette 12', gps:null,
    perishable:true, batch:'HS-2025-10-A', expiry:addDays(NOW, 30).toISOString().slice(0,10),
    transport:{veh:'PKW', ppl:1, assembly:'—'},
    supplier:'Helvetia Hygiene GmbH', purchase:'2025-10-01', warranty:null,
    photo:false, doc:'Hygiene-Set-Inhalt.pdf', deployH:2, statusNote:'Priorität: FIFO'
  },
  { id:'it3', name:'Schrank abschließbar', cat:'Möbel', qty:40, reserved:5, min:60,
    last:'2025-05-10', freqDays:365, next:'2026-05-10',
    size:'120x60x200cm', weight:'45kg', volume:'0.9m³', stack:'Nein',
    location:'Halle Nord – Reihe C – Boden', gps:null,
    perishable:false, transport:{veh:'LKW', ppl:2, assembly:'20min/Stk'},
    supplier:'SecureStorage AG', purchase:'2024-09-20', warranty:'2029-09-20',
    photo:false, doc:null, deployH:24, statusNote:'Langsam transportierbar'
  },
]

// Vorlagen (vereinheitlichte Pflege)
const TEMPLATES = [
  { id:'tpl-bed',  name:'Vorlage: Bett (Unterkunft)', fields:['name','cat','qty','min','freqDays','transport','doc'] },
  { id:'tpl-hyg',  name:'Vorlage: Hygiene-Set',       fields:['name','cat','qty','min','perishable','batch','expiry','doc'] },
  { id:'tpl-lock', name:'Vorlage: Schrank (Möbel)',   fields:['name','cat','qty','min','freqDays','transport'] },
]

// Chips
const readinessChip = (qty, min) => {
  const pct = Math.round((qty/Math.max(min,1))*100)
  if (pct >= 100) return <StatusPill level="ok"   label="Erfüllt" />
  if (pct >= 70)  return <StatusPill level="warn" label="Engpass" />
  return <StatusPill level="krit" label="Kritisch" />
}
const perishableChip = (it) => {
  if (!it.perishable) return <Chip size="small" label="—" />
  const d = daysLeft(it.expiry)
  if (d===null) return <Chip size="small" color="warning" label="MHD: n/a" />
  if (d<=0)     return <Chip size="small" color="error"   label="MHD abgelaufen" />
  if (d<=14)    return <Chip size="small" color="warning" label={`≤${d} T`} />
  return <Chip size="small" color="success" label={`${d} T`} />
}

// =============================================
// Seite: Meine Organisation & Wartung (Voll)
// =============================================
export default function OrgMaintenance() {
  const [role, setRole] = useState('invmanager')
  const [items, setItems] = useState(INITIAL_ITEMS)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('Alle')
  const cats = useMemo(() => ['Alle', ...Array.from(new Set(items.map(i=>i.cat)))], [items])

  const [dlgEdit, setDlgEdit] = useState({ open:false, draft:null, isNew:false })
  const [dlgMaint, setDlgMaint] = useState({ open:false, target:null })
  const [dlgAudit, setDlgAudit] = useState({ open:false })

  const totals = useMemo(() => {
    const qty = items.reduce((a,b)=>a + b.qty, 0)
    const min = items.reduce((a,b)=>a + b.min, 0)
    const due = items.filter(it => {
      const next = it.next ? new Date(it.next) : addDays(new Date(it.last), it.freqDays)
      return next <= addDays(NOW, 30)
    }).length
    const perSoon = items.filter(it => it.perishable && it.expiry && daysLeft(it.expiry) <= 30).length
    const coveragePct = Math.min(100, Math.round((qty / Math.max(min,1))*100))
    return { qty, min, due, perSoon, coveragePct }
  }, [items])

  const filtered = items.filter(it => {
    const matchesCat = (cat==='Alle' || it.cat===cat)
    const hay = `${it.name} ${it.cat} ${it.location}`.toLowerCase()
    return matchesCat && hay.includes(q.toLowerCase())
  })

  const hasPerm = (p) => has(role, p)

  const openNew = () => {
    if (!hasPerm('add')) return
    setDlgEdit({
      open: true,
      isNew: true,
      draft: {
        id:`it-${Math.random().toString(36).slice(2,7)}`,
        name:'', cat:'', qty:0, reserved:0, min:0,
        last:null, freqDays:90, next:null,
        size:'', weight:'', volume:'', stack:'Ja',
        location:'', gps:null,
        perishable:false, batch:'', expiry:null,
        transport:{veh:'PKW', ppl:1, assembly:'—'},
        supplier:'', purchase:null, warranty:null,
        photo:false, doc:null, deployH:4, statusNote:''
      }
    })
  }
  const openEdit = (it) => { if (hasPerm('edit')) setDlgEdit({ open:true, isNew:false, draft: JSON.parse(JSON.stringify(it)) }) }
  const saveEdit = () => {
    const d = dlgEdit.draft
    if (!d.name || !d.cat) { alert('Bitte Name & Kategorie ausfüllen.'); return }
    if (d.qty < 0 || d.min < 0) { alert('Mengen müssen ≥ 0 sein.'); return }
    setItems(prev => {
      const idx = prev.findIndex(x=>x.id===d.id)
      if (idx>=0) { const next=[...prev]; next[idx]=d; return next }
      return [d, ...prev]
    })
    setDlgEdit({ open:false, draft:null, isNew:false })
  }
  const delItem = (id) => { if (hasPerm('delete')) setItems(prev => prev.filter(i=>i.id!==id)) }
  const planMaint = (it) => { if (hasPerm('schedule')) setDlgMaint({ open:true, target:it }) }
  const confirmMaint = (days=180) => {
    const it = dlgMaint.target
    const nextDate = addDays(new Date(), days).toISOString().slice(0,10)
    setItems(prev => prev.map(x => x.id===it.id ? { ...x, last:new Date().toISOString().slice(0,10), next: nextDate } : x))
    setDlgMaint({ open:false, target:null })
  }
  const fifoAction = (it) => { if (hasPerm('fifo')) alert(`FIFO priorisiert: ${it.name} (Batch: ${it.batch || 'n/a'})`) }
  const importCSV = () => { if (hasPerm('import')) alert('Import (Excel/CSV) – Prototyp.') }
  const exportPDF = () => { if (hasPerm('export')) alert('Export PDF – Prototyp.') }
  const downloadTemplate = () => { if (hasPerm('downloadTemplates')) alert('Vorlagen-CSV heruntergeladen (Demo).') }

  const AUDIT = [
    '2025-10-31 10:12 – it2 expiry gesetzt (2025-11-30) – K.K./InvManager',
    '2025-10-30 17:05 – it1 qty 175 → 180 – M.H./InvManager',
    '2025-10-30 09:22 – Neuer Artikel it3 angelegt – S.B./InvManager',
  ]

  return (
    <Box sx={{ bgcolor:'background.default', minHeight:'100vh' }}>
      <PageHeader
        icon={<Inventory2OutlinedIcon/>}
        title="Meine Organisation & Wartung"
        subtitle="Proaktive Einsatzbereitschaft • Datenpflege • Rotation"
        right={
          <Stack direction="row" spacing={1} alignItems="center">
            <SecurityOutlinedIcon sx={{ opacity:0.6 }} />
            <TextField
              size="small" select value={role} onChange={e=>setRole(e.target.value)}
              sx={{ minWidth: 260 }} aria-label="Rolle wählen"
            >
              {ROLES.map(r => <MenuItem key={r.key} value={r.key}>{r.label}</MenuItem>)}
            </TextField>
          </Stack>
        }
      />

      <Container sx={{ py:3 }}>
        <Grid container spacing={2} sx={{ mb:1 }}>
          <Grid item xs={12} sm={6} md={3}><KPI title="Gesamt verfügbar" value={totals.qty} /></Grid>
          <Grid item xs={12} sm={6} md={3}><KPI title="Mindestbestand (Summe)" value={totals.min} /></Grid>
          <Grid item xs={12} sm={6} md={3}><KPI title="Inspektionen ≤30T" value={totals.due} icon={<BuildOutlinedIcon/>} /></Grid>
          <Grid item xs={12} sm={6} md={3}><KPI title="Perishables ≤30T" value={totals.perSoon} icon={<EventAvailableOutlinedIcon/>} /></Grid>
        </Grid>

        <Card sx={{ mb:2 }}>
          <CardContent>
            <Stack direction={{ xs:'column', md:'row' }} spacing={2} alignItems={{ xs:'stretch', md:'center' }}>
              <Donut value={totals.coveragePct} label="Deckung gesamt" />
              <ActionBar>
                <TextField size="small" fullWidth label="Suche (Artikel, Kategorie, Standort)" value={q} onChange={e=>setQ(e.target.value)} />
                <TextField size="small" select label="Kategorie" value={cat} onChange={e=>setCat(e.target.value)} sx={{ minWidth:220 }}>
                  {['Alle', ...Array.from(new Set(items.map(i=>i.cat)))].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
                <Tooltip title="Import (Excel/CSV)">
                  <span><Button variant="outlined" startIcon={<UploadFileOutlinedIcon/>} onClick={importCSV} disabled={!hasPerm('import')}>Import</Button></span>
                </Tooltip>
                <Tooltip title="Vorlagen (CSV) herunterladen">
                  <span><Button variant="outlined" startIcon={<DownloadOutlinedIcon/>} onClick={downloadTemplate} disabled={!hasPerm('downloadTemplates')}>Vorlagen</Button></span>
                </Tooltip>
                <Tooltip title="PDF-Export">
                  <span><Button variant="contained" color="primary" startIcon={<PictureAsPdfOutlinedIcon/>} onClick={exportPDF} disabled={!hasPerm('export')}>Export</Button></span>
                </Tooltip>
              </ActionBar>
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={2} sx={{ mb:2 }}>
          <Grid item xs={12} md={6}>
            <Section
              title="Inspektionen ≤ 30 Tage"
              action={
                <Tooltip title="Inspektionen planen">
                  <span>
                    <Button size="small" variant="contained" startIcon={<AssignmentTurnedInOutlinedIcon/>}
                      disabled={!hasPerm('schedule')} onClick={()=>setDlgMaint({ open:true, target:items[0] })}>
                      Planen
                    </Button>
                  </span>
                </Tooltip>
              }
            >
              {items.filter(it => {
                const next = it.next ? new Date(it.next) : addDays(new Date(it.last), it.freqDays)
                return next <= addDays(NOW,30)
              }).length === 0 ? (
                <Alert severity="success">Keine Inspektionen in den nächsten 30 Tagen.</Alert>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Artikel</TableCell>
                      <TableCell>Nächste Prüfung</TableCell>
                      <TableCell>Intervall</TableCell>
                      <TableCell>Aktion</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items
                      .map(it => ({ it, next: it.next || addDays(new Date(it.last), it.freqDays).toISOString().slice(0,10) }))
                      .filter(x => new Date(x.next) <= addDays(NOW,30))
                      .sort((a,b)=> new Date(a.next) - new Date(b.next))
                      .map(({it, next}) => (
                        <TableRow key={it.id}>
                          <TableCell>{it.name}</TableCell>
                          <TableCell>{next}</TableCell>
                          <TableCell>{it.freqDays} T</TableCell>
                          <TableCell>
                            <Tooltip title="Termin planen">
                              <span><Button size="small" variant="outlined" onClick={()=>planMaint(it)} disabled={!hasPerm('schedule')}>Planen</Button></span>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </Section>
          </Grid>

          <Grid item xs={12} md={6}>
            <Section title="Perishables — FIFO">
              {items.filter(it => it.perishable).length === 0 ? (
                <Alert severity="info">Keine Perishables vorhanden.</Alert>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Artikel</TableCell>
                      <TableCell>Batch</TableCell>
                      <TableCell>MHD</TableCell>
                      <TableCell>Resttage</TableCell>
                      <TableCell>Aktion</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items
                      .filter(it => it.perishable)
                      .sort((a,b)=> (daysLeft(a.expiry)??9999) - (daysLeft(b.expiry)??9999))
                      .map(it => (
                        <TableRow key={it.id}>
                          <TableCell>{it.name}</TableCell>
                          <TableCell>{it.batch || '—'}</TableCell>
                          <TableCell>{it.expiry || '—'}</TableCell>
                          <TableCell>{daysLeft(it.expiry) ?? '—'}</TableCell>
                          <TableCell>
                            <Tooltip title="Diese Charge zuerst einsetzen (FIFO)">
                              <span><Button size="small" variant="outlined" color="success" onClick={()=>fifoAction(it)} disabled={!hasPerm('fifo')}>Zuerst ausliefern</Button></span>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </Section>
          </Grid>
        </Grid>

        <Section
          title={`Bestände & Aktionen — ${myOrgName}`}
          action={
            <Stack direction="row" spacing={1}>
              <Tooltip title="Neuen Artikel hinzufügen">
                <span>
                  <Button variant="contained" startIcon={<AddOutlinedIcon/>} onClick={openNew} disabled={!hasPerm('add')}>
                    Neuer Artikel
                  </Button>
                </span>
              </Tooltip>
            </Stack>
          }
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Artikel</TableCell>
                <TableCell>Kategorie</TableCell>
                <TableCell>Lagerstand</TableCell>
                <TableCell>Min</TableCell>
                <TableCell>Readiness</TableCell>
                <TableCell>Transport</TableCell>
                <TableCell>Perishable</TableCell>
                <TableCell>Bereit (h)</TableCell>
                <TableCell align="right">Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(it => (
                <TableRow key={it.id} hover>
                  <TableCell>
                    <Stack spacing={0.25}>
                      <Typography fontWeight={700}>{it.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{it.location}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{it.cat}</TableCell>
                  <TableCell>{`${it.qty - it.reserved} frei / ${it.qty} ges.`}</TableCell>
                  <TableCell>{it.min}</TableCell>
                  <TableCell>{readinessChip(it.qty, it.min)}</TableCell>
                  <TableCell>{`${it.transport?.veh || '—'}, ${it.transport?.ppl || '—'} Pers.`}</TableCell>
                  <TableCell>{perishableChip(it)}</TableCell>
                  <TableCell>~{it.deployH}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Bearbeiten">
                        <span><IconButton size="small" onClick={()=>openEdit(it)} disabled={!hasPerm('edit')}><EditOutlinedIcon fontSize="small"/></IconButton></span>
                      </Tooltip>
                      <Tooltip title="Wartung planen">
                        <span><IconButton size="small" onClick={()=>planMaint(it)} disabled={!hasPerm('schedule')}><AssignmentTurnedInOutlinedIcon fontSize="small"/></IconButton></span>
                      </Tooltip>
                      <Tooltip title="Transportdetails">
                        <IconButton size="small"><LocalShippingOutlinedIcon fontSize="small"/></IconButton>
                      </Tooltip>
                      <Tooltip title="Löschen">
                        <span><IconButton size="small" color="error" onClick={()=>delItem(it.id)} disabled={!hasPerm('delete')}><DeleteOutlineOutlinedIcon fontSize="small"/></IconButton></span>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>
      </Container>

      {/* DIALOG: Artikel anlegen/bearbeiten */}
      <Dialog open={dlgEdit.open} onClose={()=>setDlgEdit({ open:false, draft:null, isNew:false })} fullWidth maxWidth="md">
        <DialogTitle>{dlgEdit.isNew ? 'Neuer Artikel' : 'Artikel bearbeiten'}</DialogTitle>
        <DialogContent dividers>
          {dlgEdit.draft && (
            <Stack spacing={2}>
              <Stack direction={{ xs:'column', md:'row' }} spacing={2}>
                <TextField label="Name" fullWidth value={dlgEdit.draft.name} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, name:e.target.value }}))}/>
                <TextField label="Kategorie" fullWidth value={dlgEdit.draft.cat} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, cat:e.target.value }}))}/>
              </Stack>
              <Stack direction={{ xs:'column', md:'row' }} spacing={2}>
                <TextField type="number" label="Menge gesamt" value={dlgEdit.draft.qty} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, qty: Number(e.target.value) }}))}/>
                <TextField type="number" label="Reserviert" value={dlgEdit.draft.reserved} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, reserved: Number(e.target.value) }}))}/>
                <TextField type="number" label="Mindestbestand" value={dlgEdit.draft.min} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, min: Number(e.target.value) }}))}/>
                <TextField type="number" label="Bereit in (h)" value={dlgEdit.draft.deployH} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, deployH: Number(e.target.value) }}))}/>
              </Stack>
              <Divider />
              <Stack direction={{ xs:'column', md:'row' }} spacing={2}>
                <TextField label="Standort (Adresse/Zone/Fach)" fullWidth value={dlgEdit.draft.location} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, location:e.target.value }}))}/>
                <TextField label="Stapelbar" fullWidth value={dlgEdit.draft.stack} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, stack:e.target.value }}))}/>
              </Stack>
              <Stack direction={{ xs:'column', md:'row' }} spacing={2}>
                <TextField label="Größe (L/B/H)" value={dlgEdit.draft.size} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, size:e.target.value }}))}/>
                <TextField label="Gewicht" value={dlgEdit.draft.weight} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, weight:e.target.value }}))}/>
                <TextField label="Volumen" value={dlgEdit.draft.volume} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, volume:e.target.value }}))}/>
              </Stack>
              <Divider />
              <Stack direction={{ xs:'column', md:'row' }} spacing={2}>
                <TextField label="Fahrzeug" value={dlgEdit.draft.transport?.veh} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, transport:{ ...s.draft.transport, veh:e.target.value }}}))}/>
                <TextField type="number" label="Personen" value={dlgEdit.draft.transport?.ppl} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, transport:{ ...s.draft.transport, ppl:Number(e.target.value) }}}))}/>
                <TextField label="Aufbauzeit" value={dlgEdit.draft.transport?.assembly} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, transport:{ ...s.draft.transport, assembly:e.target.value }}}))}/>
              </Stack>
              <Divider />
              <Stack direction={{ xs:'column', md:'row' }} spacing={2}>
                <TextField label="Lieferant" value={dlgEdit.draft.supplier} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, supplier:e.target.value }}))}/>
                <TextField label="Kaufdatum" value={dlgEdit.draft.purchase || ''} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, purchase:e.target.value }}))}/>
                <TextField label="Garantie bis" value={dlgEdit.draft.warranty || ''} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, warranty:e.target.value }}))}/>
              </Stack>
              <Divider />
              <Stack direction={{ xs:'column', md:'row' }} spacing={2}>
                <TextField type="number" label="Inspektionsintervall (Tage)" value={dlgEdit.draft.freqDays} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, freqDays:Number(e.target.value) }}))}/>
                <TextField label="Letzte Prüfung (YYYY-MM-DD)" value={dlgEdit.draft.last || ''} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, last:e.target.value }}))}/>
                <TextField label="Nächste Prüfung (YYYY-MM-DD)" value={dlgEdit.draft.next || ''} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, next:e.target.value }}))}/>
              </Stack>
              <Divider />
              <Stack direction={{ xs:'column', md:'row' }} spacing={2}>
                <TextField select label="Verderblich" value={dlgEdit.draft.perishable ? 'Ja':'Nein'} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, perishable: e.target.value==='Ja' }}))}>
                  <MenuItem value="Ja">Ja</MenuItem>
                  <MenuItem value="Nein">Nein</MenuItem>
                </TextField>
                <TextField label="Batch" value={dlgEdit.draft.batch || ''} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, batch:e.target.value }}))}/>
                <TextField label="MHD (YYYY-MM-DD)" value={dlgEdit.draft.expiry || ''} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, expiry:e.target.value }}))}/>
              </Stack>
              <Divider />
              <Stack direction={{ xs:'column', md:'row' }} spacing={2}>
                <TextField label="Dokument (PDF)" value={dlgEdit.draft.doc || ''} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, doc:e.target.value }}))}/>
                <TextField label="Status/Hinweis" value={dlgEdit.draft.statusNote || ''} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, statusNote:e.target.value }}))}/>
              </Stack>

              {!dlgEdit.isNew && (
                <Alert severity="info" icon={<InfoOutlinedIcon/>}>
                  Änderungen werden im Verlauf protokolliert (wer/was/wann).
                </Alert>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setDlgEdit({ open:false, draft:null, isNew:false })}>Abbrechen</Button>
          <Button variant="contained" onClick={saveEdit} startIcon={<AssignmentTurnedInOutlinedIcon/>} disabled={!hasPerm(dlgEdit.isNew ? 'add' : 'edit')}>
            Speichern
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG: Wartung planen */}
      <Dialog open={dlgMaint.open} onClose={()=>setDlgMaint({ open:false, target:null })} fullWidth maxWidth="sm">
        <DialogTitle>Wartung planen</DialogTitle>
        <DialogContent dividers>
          {dlgMaint.target ? (
            <Stack spacing={2}>
              <Typography><b>Artikel:</b> {dlgMaint.target.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Intervall aktuell: {dlgMaint.target.freqDays} Tage • Nächste Prüfung: {dlgMaint.target.next || '—'}
              </Typography>
              <Alert severity="info" icon={<SwapVertOutlinedIcon/>}>
                Empfehlung: gleichmäßige Verteilung der Termine → Überfälligkeiten vermeiden.
              </Alert>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={()=>confirmMaint(30)}>+30 Tage</Button>
                <Button variant="outlined" onClick={()=>confirmMaint(90)}>+90 Tage</Button>
                <Button variant="outlined" onClick={()=>confirmMaint(180)}>+180 Tage</Button>
                <Button variant="contained" onClick={()=>confirmMaint(dlgMaint.target.freqDays)}>Standardintervall</Button>
              </Stack>
            </Stack>
          ) : '—'}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setDlgMaint({ open:false, target:null })}>Schließen</Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG: Audit-Verlauf */}
      <Dialog open={dlgAudit.open} onClose={()=>setDlgAudit({ open:false })} fullWidth maxWidth="sm">
        <DialogTitle>Verlauf & Änderungen</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.5}>
            {AUDIT.map((line, i)=>(
              <Stack key={i} direction="row" spacing={1} alignItems="center">
                <HistoryOutlinedIcon fontSize="small" sx={{ opacity:0.6 }}/>
                <Typography variant="body2">{line}</Typography>
              </Stack>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setDlgAudit({ open:false })}>Schließen</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export { OrgMaintenance }
