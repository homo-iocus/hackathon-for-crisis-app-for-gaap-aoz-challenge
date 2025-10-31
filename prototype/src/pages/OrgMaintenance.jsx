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

// Shared kit
import { PageHeader, Section, KPI, StatusPill, Donut, ToolbarHint, ActionBar } from '../ui/Kit.jsx'

// ==== Kleine Hilfs-Komponenten für konsistente Tooltips ====
const InfoLabel = ({ children, title }) => (
  <Stack direction="row" spacing={0.5} alignItems="center" component="span">
    <span>{children}</span>
    <Tooltip arrow title={title}>
      <InfoOutlinedIcon fontSize="small" sx={{ opacity: 0.65 }} />
    </Tooltip>
  </Stack>
)

const withTip = (title, node) => (
  <Tooltip arrow title={title}>
    <span>{node}</span>
  </Tooltip>
)

// RBAC
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

// Data
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

// Chips (mit Erklär-Tooltips)
const readinessChip = (qty, min) => {
  const pct = Math.round((qty/Math.max(min,1))*100)
  const text = pct >= 100 ? 'Erfüllt' : pct >= 70 ? 'Engpass' : 'Kritisch'
  const tip = `Deckung: ${pct}% (Menge vs. Mindestbestand) – ${text}.`
  if (pct >= 100) return withTip(tip, <StatusPill level="ok"   label="Erfüllt" />)
  if (pct >= 70)  return withTip(tip, <StatusPill level="warn" label="Engpass" />)
  return withTip(tip, <StatusPill level="krit" label="Kritisch" />)
}
const perishableChip = (it) => {
  if (!it.perishable) return withTip('Nicht verderblich.', <Chip size="small" label="—" />)
  const d = daysLeft(it.expiry)
  if (d===null) return withTip('MHD unbekannt.', <Chip size="small" color="warning" label="MHD: n/a" />)
  if (d<=0)     return withTip('MHD überschritten – nicht mehr einsetzen.', <Chip size="small" color="error"   label="MHD abgelaufen" />)
  if (d<=14)    return withTip('≤14 Resttage – hohe FIFO-Priorität.', <Chip size="small" color="warning" label={`≤${d} T`} />)
  return withTip(`${d} Resttage bis MHD.`, <Chip size="small" color="success" label={`${d} T`} />)
}

export default function OrgMaintenance() {
  const [role, setRole] = useState('invmanager')
  const [items, setItems] = useState(INITIAL_ITEMS)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('Alle')

  const [dlgEdit, setDlgEdit] = useState({ open:false, draft:null, isNew:false })
  const [dlgMaint, setDlgMaint] = useState({ open:false, target:null })
  const [dlgAudit, setDlgAudit] = useState({ open:false })

  const cats = useMemo(() => ['Alle', ...Array.from(new Set(items.map(i=>i.cat)))], [items])

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
            {withTip('Rollen & Berechtigungen (clientseitiger Prototyp).', <ToolbarHint>Rollen & Berechtigungen</ToolbarHint>)}
            <SecurityOutlinedIcon sx={{ opacity:0.6 }} />
            <TextField
              size="small" select value={role} onChange={e=>setRole(e.target.value)}
              sx={{ minWidth: 260 }} aria-label="Rolle wählen"
              label={<InfoLabel title="Bestimmt, welche Aktionen Sie ausführen dürfen.">Rolle</InfoLabel>}
            >
              {ROLES.map(r => <MenuItem key={r.key} value={r.key}>{r.label}</MenuItem>)}
            </TextField>
          </Stack>
        }
      />

      <Container sx={{ py:3 }}>
        <Grid container spacing={2} sx={{ mb:1 }}>
          <Grid item xs={12} sm={6} md={3}>
            {withTip('Summe aller Stückzahlen über alle Artikel.', <KPI title="Gesamt verfügbar" value={totals.qty} />)}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {withTip('Summe der Mindestbestände – Zielwert zur Deckung.', <KPI title="Mindestbestand (Summe)" value={totals.min} />)}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {withTip('Anzahl Artikel mit fälligen Inspektionen in ≤ 30 Tagen.', <KPI title="Inspektionen ≤30T" value={totals.due} icon={<BuildOutlinedIcon/>} />)}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {withTip('Verderbliche Waren mit ≤ 30 Resttagen bis MHD.', <KPI title="Verderbliche Waren ≤30T" value={totals.perSoon} icon={<EventAvailableOutlinedIcon/>} />)}
          </Grid>
        </Grid>

        <Card sx={{ mb:2 }}>
          <CardContent>
            <Stack direction={{ xs:'column', md:'row' }} spacing={2} alignItems={{ xs:'stretch', md:'center' }}>
              {withTip(`Deckung gesamt = Gesamtmenge / Gesamt-Minimum (${totals.coveragePct}%).`, <Donut value={totals.coveragePct} label="Deckung gesamt" />)}
              <ActionBar>
                <TextField
                  size="small" fullWidth
                  label={<InfoLabel title="Sucht in Artikelname, Kategorie und Standort.">Suche (Artikel/Kategorie/Standort)</InfoLabel>}
                  value={q} onChange={e=>setQ(e.target.value)}
                />
                <TextField
                  size="small" select sx={{ minWidth:220 }}
                  label={<InfoLabel title="Filtert die Tabelle auf eine Kategorie.">Kategorie</InfoLabel>}
                  value={cat} onChange={e=>setCat(e.target.value)}
                >
                  {cats.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
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
              title={<InfoLabel title="Prüf- und Wartungstermine, die innerhalb der nächsten 30 Tage anstehen.">Inspektionen ≤ 30 Tage</InfoLabel>}
              action={
                <Tooltip title="Inspektionen planen">
                  <span>
                    <Button size="small" variant="contained" startIcon={<AssignmentTurnedInOutlinedIcon/>}
                      disabled={!hasPerm('schedule')} onClick={()=>setDlgMaint({ open:true, target:items[0] })} aria-label="Inspektionen planen">
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
                      <TableCell><InfoLabel title="Artikelbezeichnung.">Artikel</InfoLabel></TableCell>
                      <TableCell><InfoLabel title="Nächster geplanter Prüftermin.">Nächste Prüfung</InfoLabel></TableCell>
                      <TableCell><InfoLabel title="Inspektionsintervall in Tagen.">Intervall</InfoLabel></TableCell>
                      <TableCell><InfoLabel title="Aktion zur Terminplanung.">Aktion</InfoLabel></TableCell>
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
                              <span><Button size="small" variant="outlined" onClick={()=>planMaint(it)} disabled={!hasPerm('schedule')} aria-label="Termin planen">Planen</Button></span>
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
            <Section title={<InfoLabel title="Verderbliche Güter in FIFO-Reihenfolge (zuerst ausliefern, was zuerst abläuft).">Verderbliche Waren — FIFO</InfoLabel>}>
              {items.filter(it => it.perishable).length === 0 ? (
                <Alert severity="info">Keine verderbliche Waren vorhanden.</Alert>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><InfoLabel title="Artikelbezeichnung.">Artikel</InfoLabel></TableCell>
                      <TableCell><InfoLabel title="Chargen-/Batch-Nummer.">Batch</InfoLabel></TableCell>
                      <TableCell><InfoLabel title="Mindesthaltbarkeitsdatum.">MHD</InfoLabel></TableCell>
                      <TableCell><InfoLabel title="Resttage bis MHD (niedrig = hohe Priorität).">Resttage</InfoLabel></TableCell>
                      <TableCell><InfoLabel title="Aktion zur FIFO-Priorisierung.">Aktion</InfoLabel></TableCell>
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
                              <span><Button size="small" variant="outlined" color="success" onClick={()=>fifoAction(it)} disabled={!hasPerm('fifo')} aria-label="FIFO priorisieren">Zuerst ausliefern</Button></span>
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
          title={<InfoLabel title="Operative Übersicht Ihrer Bestände mit schnellen Aktionen.">{`Bestände & Aktionen — ${myOrgName}`}</InfoLabel>}
          action={
            <Stack direction="row" spacing={1}>
              <Tooltip title="Neuen Artikel hinzufügen">
                <span>
                  <Button variant="contained" startIcon={<AddOutlinedIcon/>} onClick={openNew} disabled={!hasPerm('add')} aria-label="Neuer Artikel">
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
                <TableCell><InfoLabel title="Artikelname und Standort.">Artikel</InfoLabel></TableCell>
                <TableCell><InfoLabel title="Kategorie des Artikels.">Kategorie</InfoLabel></TableCell>
                <TableCell><InfoLabel title="Frei verfügbare Menge / Gesamtbestand.">Lagerstand</InfoLabel></TableCell>
                <TableCell><InfoLabel title="Minimal erforderliche Menge.">Min</InfoLabel></TableCell>
                <TableCell><InfoLabel title="Deckungsstatus relativ zum Minimum.">Deckung</InfoLabel></TableCell>
                <TableCell><InfoLabel title="Transportmittel und erforderliche Personen.">Transport</InfoLabel></TableCell>
                <TableCell><InfoLabel title="Verderblichkeit / MHD-Status.">Verderbliche Waren</InfoLabel></TableCell>
                <TableCell><InfoLabel title="Zeit bis einsatzbereit (Stunden).">Bereit (h)</InfoLabel></TableCell>
                <TableCell align="right"><InfoLabel title="Bearbeiten, Termin planen, Transport, Löschen.">Aktionen</InfoLabel></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(it => (
                <TableRow key={it.id} hover>
                  <TableCell>
                    <Stack spacing={0.25}>
                      {withTip('Artikelbezeichnung.', <Typography fontWeight={700}>{it.name}</Typography>)}
                      {withTip('Lagerort / Regal / Palette.', <Typography variant="caption" color="text.secondary">{it.location}</Typography>)}
                    </Stack>
                  </TableCell>
                  <TableCell>{withTip('Artikelkategorie.', <span>{it.cat}</span>)}</TableCell>
                  <TableCell>{withTip('Frei verfügbar / Gesamtbestand.', <span>{`${it.qty - it.reserved} frei / ${it.qty} ges.`}</span>)}</TableCell>
                  <TableCell>{withTip('Minimal erforderliche Menge.', <span>{it.min}</span>)}</TableCell>
                  <TableCell>{readinessChip(it.qty, it.min)}</TableCell>
                  <TableCell>{withTip('Transportanforderung.', <span>{`${it.transport?.veh || '—'}, ${it.transport?.ppl || '—'} Pers.`}</span>)}</TableCell>
                  <TableCell>{perishableChip(it)}</TableCell>
                  <TableCell>{withTip('Bereitstellungszeit in Stunden.', <span>~{it.deployH}</span>)}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Bearbeiten">
                        <span><IconButton size="small" onClick={()=>openEdit(it)} disabled={!hasPerm('edit')} aria-label="Bearbeiten"><EditOutlinedIcon fontSize="small"/></IconButton></span>
                      </Tooltip>
                      <Tooltip title="Wartung planen">
                        <span><IconButton size="small" onClick={()=>planMaint(it)} disabled={!hasPerm('schedule')} aria-label="Wartung planen"><AssignmentTurnedInOutlinedIcon fontSize="small"/></IconButton></span>
                      </Tooltip>
                      <Tooltip title="Transportdetails">
                        <IconButton size="small" aria-label="Transportdetails"><LocalShippingOutlinedIcon fontSize="small"/></IconButton>
                      </Tooltip>
                      <Tooltip title="Löschen">
                        <span><IconButton size="small" color="error" onClick={()=>delItem(it.id)} disabled={!hasPerm('delete')} aria-label="Löschen"><DeleteOutlineOutlinedIcon fontSize="small"/></IconButton></span>
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
      <Dialog open={dlgEdit.open} onClose={()=>setDlgEdit({ open:false, draft:null, isNew:false })} fullWidth maxWidth="md" aria-labelledby="dlg-edit-title">
        <DialogTitle id="dlg-edit-title">{dlgEdit.isNew ? 'Neuer Artikel' : 'Artikel bearbeiten'}</DialogTitle>
        <DialogContent dividers>
          {dlgEdit.draft && (
            <Stack spacing={2}>
              <Stack direction={{ xs:'column', md:'row' }} spacing={2}>
                <TextField label={<InfoLabel title="Eindeutige Bezeichnung des Artikels.">Name</InfoLabel>} fullWidth value={dlgEdit.draft.name} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, name:e.target.value }}))}/>
                <TextField label={<InfoLabel title="Übergeordnete Warengruppe.">Kategorie</InfoLabel>} fullWidth value={dlgEdit.draft.cat} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, cat:e.target.value }}))}/>
              </Stack>
              <Stack direction={{ xs:'column', md:'row' }} spacing={2}>
                <TextField type="number" label={<InfoLabel title="Gesamte physische Menge im Bestand.">Menge gesamt</InfoLabel>} value={dlgEdit.draft.qty} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, qty: Number(e.target.value) }}))}/>
                <TextField type="number" label={<InfoLabel title="Davon bereits verplant/reserviert.">Reserviert</InfoLabel>} value={dlgEdit.draft.reserved} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, reserved: Number(e.target.value) }}))}/>
                <TextField type="number" label={<InfoLabel title="Sollbestand zur Deckung.">Mindestbestand</InfoLabel>} value={dlgEdit.draft.min} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, min: Number(e.target.value) }}))}/>
                <TextField type="number" label={<InfoLabel title="Zeit bis einsatzbereit bei Abruf (Stunden).">Bereit in (h)</InfoLabel>} value={dlgEdit.draft.deployH} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, deployH: Number(e.target.value) }}))}/>
              </Stack>
              <Divider />
              <Stack direction={{ xs:'column', md:'row' }} spacing={2}>
                <TextField label={<InfoLabel title="Adresse/Zone/Regal/Fach.">Standort</InfoLabel>} fullWidth value={dlgEdit.draft.location} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, location:e.target.value }}))}/>
                <TextField label={<InfoLabel title="Stapelbarkeit am Lagerort.">Stapelbar</InfoLabel>} fullWidth value={dlgEdit.draft.stack} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, stack:e.target.value }}))}/>
              </Stack>
              <Stack direction={{ xs:'column', md:'row' }} spacing={2}>
                <TextField label={<InfoLabel title="Außenmaße des Artikels.">Größe (L/B/H)</InfoLabel>} value={dlgEdit.draft.size} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, size:e.target.value }}))}/>
                <TextField label={<InfoLabel title="Gewicht (Einzelstück).">Gewicht</InfoLabel>} value={dlgEdit.draft.weight} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, weight:e.target.value }}))}/>
                <TextField label={<InfoLabel title="Volumen (Einzelstück).">Volumen</InfoLabel>} value={dlgEdit.draft.volume} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, volume:e.target.value }}))}/>
              </Stack>
              <Divider />
              <Stack direction={{ xs:'column', md:'row' }} spacing={2}>
                <TextField label={<InfoLabel title="Typisches Fahrzeug für Transport.">Fahrzeug</InfoLabel>} value={dlgEdit.draft.transport?.veh} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, transport:{ ...s.draft.transport, veh:e.target.value }}}))}/>
                <TextField type="number" label={<InfoLabel title="Benötigte Personen für Transport.">Personen</InfoLabel>} value={dlgEdit.draft.transport?.ppl} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, transport:{ ...s.draft.transport, ppl:Number(e.target.value) }}}))}/>
                <TextField label={<InfoLabel title="Zeitbedarf für Aufbau/Montage.">Aufbauzeit</InfoLabel>} value={dlgEdit.draft.transport?.assembly} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, transport:{ ...s.draft.transport, assembly:e.target.value }}}))}/>
              </Stack>
              <Divider />
              <Stack direction={{ xs:'column', md:'row' }} spacing={2}>
                <TextField label={<InfoLabel title="Hersteller/Lieferant.">Lieferant</InfoLabel>} value={dlgEdit.draft.supplier} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, supplier:e.target.value }}))}/>
                <TextField label={<InfoLabel title="Beschaffungsdatum (YYYY-MM-DD).">Kaufdatum</InfoLabel>} value={dlgEdit.draft.purchase || ''} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, purchase:e.target.value }}))}/>
                <TextField label={<InfoLabel title="Garantie bis (YYYY-MM-DD).">Garantie bis</InfoLabel>} value={dlgEdit.draft.warranty || ''} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, warranty:e.target.value }}))}/>
              </Stack>
              <Divider />
              <Stack direction={{ xs:'column', md:'row' }} spacing={2}>
                <TextField select label={<InfoLabel title="Ist der Artikel verderblich? Steuert MHD/FIFO.">Verderblich</InfoLabel>} value={dlgEdit.draft.perishable ? 'Ja':'Nein'} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, perishable: e.target.value==='Ja' }}))}>
                  <MenuItem value="Ja">Ja</MenuItem>
                  <MenuItem value="Nein">Nein</MenuItem>
                </TextField>
                <TextField label={<InfoLabel title="Chargenkennzeichnung falls vorhanden.">Batch</InfoLabel>} value={dlgEdit.draft.batch || ''} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, batch:e.target.value }}))}/>
                <TextField label={<InfoLabel title="Mindesthaltbarkeitsdatum (YYYY-MM-DD).">MHD</InfoLabel>} value={dlgEdit.draft.expiry || ''} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, expiry:e.target.value }}))}/>
              </Stack>
              <Divider />
              <Stack direction={{ xs:'column', md:'row' }} spacing={2}>
                <TextField label={<InfoLabel title="Verknüpftes PDF/Anleitung.">Dokument (PDF)</InfoLabel>} value={dlgEdit.draft.doc || ''} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, doc:e.target.value }}))}/>
                <TextField label={<InfoLabel title="Interner Hinweis/Statusnotiz.">Status/Hinweis</InfoLabel>} value={dlgEdit.draft.statusNote || ''} onChange={e=>setDlgEdit(s=>({ ...s, draft:{ ...s.draft, statusNote:e.target.value }}))}/>
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
          {withTip('Dialog schließen ohne zu speichern.', <Button onClick={()=>setDlgEdit({ open:false, draft:null, isNew:false })}>Abbrechen</Button>)}
          {withTip('Änderungen speichern (Berechtigung erforderlich).',
            <Button variant="contained" onClick={saveEdit} startIcon={<AssignmentTurnedInOutlinedIcon/>} disabled={!hasPerm(dlgEdit.isNew ? 'add' : 'edit')}>
              Speichern
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* DIALOG: Wartung planen */}
      <Dialog open={dlgMaint.open} onClose={()=>setDlgMaint({ open:false, target:null })} fullWidth maxWidth="sm" aria-labelledby="dlg-maint-title">
        <DialogTitle id="dlg-maint-title">Wartung planen</DialogTitle>
        <DialogContent dividers>
          {dlgMaint.target ? (
            <Stack spacing={2}>
              <Typography><b>Artikel:</b> {dlgMaint.target.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Intervall aktuell: {dlgMaint.target.freqDays} Tage • Nächste Prüfung: {dlgMaint.target.next || '—'}
              </Typography>
              {withTip('Termine gleichmäßig verteilen, um Überfälligkeiten zu vermeiden.',
                <Alert severity="info" icon={<SwapVertOutlinedIcon/>}>
                  Empfehlung: gleichmäßige Verteilung der Termine → Überfälligkeiten vermeiden.
                </Alert>
              )}
              <Stack direction="row" spacing={1}>
                {withTip('Nächsten Termin um 30 Tage verschieben.', <Button variant="outlined" onClick={()=>confirmMaint(30)}>+30 Tage</Button>)}
                {withTip('Nächsten Termin um 90 Tage verschieben.', <Button variant="outlined" onClick={()=>confirmMaint(90)}>+90 Tage</Button>)}
                {withTip('Nächsten Termin um 180 Tage verschieben.', <Button variant="outlined" onClick={()=>confirmMaint(180)}>+180 Tage</Button>)}
                {withTip('Standardintervall verwenden.', <Button variant="contained" onClick={()=>confirmMaint(dlgMaint.target.freqDays)}>Standardintervall</Button>)}
              </Stack>
            </Stack>
          ) : '—'}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setDlgMaint({ open:false, target:null })}>Schließen</Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG: Audit-Verlauf */}
      <Dialog open={dlgAudit.open} onClose={()=>setDlgAudit({ open:false })} fullWidth maxWidth="sm" aria-labelledby="dlg-audit-title">
        <DialogTitle id="dlg-audit-title">Verlauf & Änderungen</DialogTitle>
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
