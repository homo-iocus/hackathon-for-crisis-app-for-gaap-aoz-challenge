import React, { useMemo, useState } from 'react'
import {
  AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, Stack, Chip,
  Button, LinearProgress, Box, TextField, Table, TableHead, TableRow, TableCell,
  TableBody, Dialog, DialogTitle, DialogContent, DialogActions, Slider, Alert,
  Tooltip, IconButton
} from '@mui/material'
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined'
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import WeekendOutlinedIcon from '@mui/icons-material/WeekendOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

// --- Kleine Hilfskomponenten -------------------------------------------------

const InfoLabel = ({ children, title }) => (
  <Stack direction="row" spacing={0.5} alignItems="center" component="span">
    <span>{children}</span>
    <Tooltip arrow title={title}>
      <InfoOutlinedIcon fontSize="small" sx={{ opacity: 0.65 }}/>
    </Tooltip>
  </Stack>
)

const withTip = (title, node) => (
  <Tooltip arrow title={title}>
    <span>{node}</span>
  </Tooltip>
)

// --- Kategorien (deutsch)
const CATS = [
  { key:'food',          label:'Verpflegung',   icon:<RestaurantOutlinedIcon/> },
  { key:'accommodation', label:'Unterkunft',    icon:<HotelOutlinedIcon/> },
  { key:'hygiene',       label:'Hygiene',       icon:<Inventory2OutlinedIcon/> },
  { key:'furniture',     label:'Möbel',         icon:<WeekendOutlinedIcon/> },
]

// --- Organisationen (deutsch)
const ORGS = ['Sozialdepartement', 'Zivilschutz Stadt Zürich', 'Tiefbauamt']

// --- Zentrales Register (einheitliche Wahrheit)
const registry = {
  demand: { food: 1200, accommodation: 900, hygiene: 1000, furniture: 150 }, // aus Planung
  min: {
    'Sozialdepartement':       { food: 900, accommodation: 400, hygiene: 500, furniture: 50 },
    'Zivilschutz Stadt Zürich':{ food: 600, accommodation: 350, hygiene: 400, furniture: 60 },
    'Tiefbauamt':              { food: 200, accommodation: 250, hygiene: 200, furniture: 80 },
  },
  stock: [
    { org:'Sozialdepartement',       storage:'Zentrallager',     cat:'food',          item:'Essenspaket A',   qty:800, perishable:true,  expiryDays:22, readinessH:2 },
    { org:'Sozialdepartement',       storage:'Zentrallager',     cat:'hygiene',       item:'Hygiene-Set A',   qty:600, perishable:true,  expiryDays:26, readinessH:2 },
    { org:'Zivilschutz Stadt Zürich',storage:'Halle Nord',       cat:'accommodation', item:'Bett Single',     qty:420, perishable:false, readinessH:4 },
    { org:'Zivilschutz Stadt Zürich',storage:'Halle Nord',       cat:'food',          item:'Essenspaket B',   qty:500, perishable:true,  expiryDays:18, readinessH:4 },
    { org:'Tiefbauamt',              storage:'Depot West',       cat:'furniture',     item:'Schrank',          qty:95,  perishable:false, readinessH:8 },
    { org:'Tiefbauamt',              storage:'Depot West',       cat:'accommodation', item:'Bett Single',     qty:180, perishable:false, readinessH:8 },
    { org:'Tiefbauamt',              storage:'Depot West',       cat:'hygiene',       item:'Hygiene-Set B',   qty:160, perishable:true,  expiryDays:34, readinessH:8 },
  ]
}

// --- Helpers
function sumBy(list, pred){ return list.filter(pred).reduce((a,b)=>a + b.qty, 0) }

function coverageTip(have, need){
  if (have >= need) return 'Deckung erfüllt: vorhandene Menge ≥ Bedarf.'
  if (have >= 0.7*need) return 'Engpass: 70–100% des Bedarfs vorhanden.'
  return 'Kritisch: weniger als 70% des Bedarfs.'
}
function chipByCoverage(have, need){
  if (have >= need) return withTip(coverageTip(have, need), <Chip size="small" color="success" label="OK" />)
  if (have >= 0.7*need) return withTip(coverageTip(have, need), <Chip size="small" color="warning" label="Eng" />)
  return withTip(coverageTip(have, need), <Chip size="small" color="error" label="Kritisch" />)
}

// Greedy-Planung: Readiness zuerst, dann FIFO bei Verderblichem
function planAllocation(catKey, need){
  const pool = registry.stock
    .filter(x => x.cat===catKey && x.qty>0)
    .sort((a,b)=>{
      if (a.readinessH!==b.readinessH) return a.readinessH - b.readinessH
      if (a.perishable && b.perishable && a.expiryDays!==b.expiryDays) return a.expiryDays - b.expiryDays
      return b.qty - a.qty
    })
  let remain = need
  const alloc = []
  for (const s of pool){
    if (remain<=0) break
    const take = Math.min(s.qty, remain)
    alloc.push({...s, take})
    remain -= take
  }
  return { alloc, approved: need-remain, remaining: remain }
}

export default function CentralStorage(){
  const [catFilter, setCatFilter] = useState('all')
  const [q, setQ] = useState('')
  const [dlg, setDlg] = useState({ open:false, cat:null, plan:null, approve:0 })

  const totals = useMemo(()=>{
    const t = { food:0, accommodation:0, hygiene:0, furniture:0 }
    registry.stock.forEach(r => { t[r.cat] += r.qty })
    return t
  },[])

  const filtered = registry.stock.filter(r =>
    (catFilter==='all' || r.cat===catFilter) &&
    `${r.org} ${r.storage} ${r.item}`.toLowerCase().includes(q.toLowerCase())
  )

  const openPlan = (catKey)=>{
    const need = registry.demand[catKey] ?? 0
    const plan = planAllocation(catKey, need)
    setDlg({ open:true, cat:catKey, plan, approve: plan.approved })
  }

  return (
    <Box sx={{ bgcolor:'background.default', minHeight:'100vh' }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flex:1 }}>Zentrale Übersicht (Alle Organisationen)</Typography>

          {withTip(
            'Erstellt einen automatischen Zuteilungsplan (Readiness zuerst, dann FIFO).',
            <Button
              variant="contained"
              onClick={()=>openPlan('accommodation')}
              aria-label="Schnell zuteilen"
            >
              Schnell zuteilen
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ py:3 }}>
        <Typography variant="h6" sx={{ mb:1 }}>Gesamtübersicht</Typography>
        <Grid container spacing={2}>
          {CATS.map(c=>{
            const need = registry.demand[c.key] ?? 0
            const have = totals[c.key] ?? 0
            const pct  = Math.min(100, Math.round((have/Math.max(need,1))*100))
            const color = have>=need ? 'success' : (have>=0.7*need ? 'warning' : 'error')
            return (
              <Grid item xs={12} md={6} key={c.key}>
                <Card>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {withTip(`Kategorie: ${c.label}`, c.icon)}
                      <Typography variant="subtitle1" fontWeight={600}>{c.label}</Typography>
                      <Box sx={{ flex:1 }}/>
                      {chipByCoverage(have, need)}
                      {withTip(`Vorhanden/Gesamtbedarf in Stück.`, <Chip size="small" label={`${have}/${need}`} sx={{ ml:1 }}/>)}
                      {withTip(
                        `Zuteilung für „${c.label}“ planen.`,
                        <Button size="small" variant="contained" sx={{ ml:1 }} onClick={()=>openPlan(c.key)} aria-label={`Zuteilen ${c.label}`}>
                          Zuteilen
                        </Button>
                      )}
                      {withTip(
                        'Bestellung bei lizenzierten Anbietern vorbereiten.',
                        <Button size="small" variant="outlined" aria-label={`Nachbestellen ${c.label}`}>Nachbestellen</Button>
                      )}
                    </Stack>
                    {withTip(
                      `Deckungsgrad: ${pct}% (${have}/${need}). Grün ≥100%, Gelb ≥70%, Rot <70%.`,
                      <LinearProgress color={color} variant="determinate" value={pct} sx={{ mt:1, height:10, borderRadius:1 }}/>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>

        <Stack direction={{xs:'column', sm:'row'}} spacing={2} sx={{ mt:3 }}>
          <TextField
            select size="small"
            label={<InfoLabel title="Filtert die Tabelle nach einer Kategorie.">Kategorie</InfoLabel>}
            value={catFilter}
            onChange={e=>setCatFilter(e.target.value)}
            sx={{ minWidth:220 }}
            SelectProps={{ native:true }}
          >
            <option value="all">Alle</option>
            {CATS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </TextField>
          <TextField
            size="small"
            label={<InfoLabel title="Sucht in Organisation, Lagerort (Storage) und Artikelname.">Suche (Organisation/Storage/Artikel)</InfoLabel>}
            value={q}
            onChange={e=>setQ(e.target.value)}
            fullWidth
          />
        </Stack>

        <Card sx={{ mt:2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Bestände (vereinheitlicht)</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><InfoLabel title="Name der verantwortlichen Organisation.">Organisation</InfoLabel></TableCell>
                  <TableCell><InfoLabel title="Konkreter Lagerort (Halle/Depot/Regal).">Storage</InfoLabel></TableCell>
                  <TableCell><InfoLabel title="Übergeordnete Kategorie (Verpflegung, Unterkunft, …).">Kategorie</InfoLabel></TableCell>
                  <TableCell><InfoLabel title="Artikelbezeichnung laut Stammdaten.">Artikel</InfoLabel></TableCell>
                  <TableCell><InfoLabel title="Verfügbare Stückzahl am Lagerort.">Menge</InfoLabel></TableCell>
                  <TableCell><InfoLabel title="Zeit bis zur Einsatzbereitschaft (Stunden).">Readiness</InfoLabel></TableCell>
                  <TableCell><InfoLabel title="Verderblichkeit: Mindesthaltbarkeits-Tage (MHD).">Perishable</InfoLabel></TableCell>
                  <TableCell align="right"><InfoLabel title="Aktionen je Bestandseintrag.">Aktionen</InfoLabel></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((r,i)=>(
                  <TableRow key={i} hover>
                    <TableCell>{withTip('Verantwortliche Stelle.', <span>{r.org}</span>)}</TableCell>
                    <TableCell>{withTip('Physischer Lagerort.', <span>{r.storage}</span>)}</TableCell>
                    <TableCell>{withTip('Kategorie des Artikels.', <span>{CATS.find(c=>c.key===r.cat)?.label}</span>)}</TableCell>
                    <TableCell>{withTip('Artikelname.', <span>{r.item}</span>)}</TableCell>
                    <TableCell>{withTip('Aktuelle verfügbare Menge.', <span>{r.qty}</span>)}</TableCell>
                    <TableCell>{withTip('Zeit bis Bereitstellung in Stunden.', <span>~{r.readinessH}h</span>)}</TableCell>
                    <TableCell>
                      {r.perishable
                        ? withTip('Mindesthaltbarkeit in Tagen (FIFO beachten).', <Chip size="small" color={(r.expiryDays<=14)?'error':'warning'} label={`MHD ${r.expiryDays}T`} />)
                        : withTip('Nicht verderblich.', <Chip size="small" label="—" />)}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {withTip('Automatische Zuteilung für diese Kategorie planen.', 
                          <Button size="small" variant="outlined" onClick={()=>openPlan(r.cat)} aria-label="Zuteilen">Zuteilen</Button>
                        )}
                        {r.perishable && withTip('First-In-First-Out priorisieren (ältere Chargen zuerst).',
                          <Button size="small" variant="outlined" color="success" aria-label="FIFO">FIFO</Button>
                        )}
                        {withTip('Transportdetails und Disposition öffnen.',
                          <Button size="small" variant="text" startIcon={<LocalShippingOutlinedIcon/>} aria-label="Transport">Transport</Button>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Typography variant="subtitle1" sx={{ mt:3 }}>Deckung je Organisation</Typography>
            <Grid container spacing={2} sx={{ mt:0 }}>
              {ORGS.map(org=>{
                const mins = registry.min[org]
                const orgRows = registry.stock.filter(r=>r.org===org)
                const cov = Object.fromEntries(CATS.map(c => [c.key, sumBy(orgRows, r=>r.cat===c.key)]))
                return (
                  <Grid item xs={12} md={4} key={org}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography fontWeight={700} sx={{ mb:1 }}>{org}</Typography>
                        {CATS.map(c=>{
                          const have = cov[c.key]||0
                          const need = mins[c.key]||0
                          return (
                            <Stack key={c.key} direction="row" spacing={1} alignItems="center" sx={{ py:0.25 }}>
                              {withTip(`Kategorie: ${c.label}`, c.icon)}
                              <Typography sx={{ minWidth:140 }}>{c.label}</Typography>
                              {chipByCoverage(have, need)}
                              <Box sx={{ flex:1 }}/>
                              {withTip('Vorhanden / Minimalbedarf dieser Organisation.',
                                <Typography variant="body2" color="text.secondary">{have}/{need}</Typography>
                              )}
                              {withTip('Zuteilung aus zentralem Bestand planen.',
                                <Button size="small" variant="text" onClick={()=>openPlan(c.key)} aria-label={`Zuteilen ${c.label}`}>Zuteilen</Button>
                              )}
                            </Stack>
                          )
                        })}
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          </CardContent>
        </Card>
      </Container>

      <Dialog open={dlg.open} onClose={()=>setDlg({open:false})} fullWidth maxWidth="sm" aria-labelledby="dlg-zuteilung-title">
        <DialogTitle id="dlg-zuteilung-title">Zuteilungsplan (zentral)</DialogTitle>
        <DialogContent dividers>
          {dlg.plan ? (
            <Stack spacing={2}>
              <Alert severity={dlg.plan.remaining>0?'warning':'success'}>
                Vorschlag: {dlg.plan.approved} zuweisen — Rest: {dlg.plan.remaining}
              </Alert>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><InfoLabel title="Empfangende Organisation.">Organisation</InfoLabel></TableCell>
                    <TableCell><InfoLabel title="Ausgangslager/Depot.">Storage</InfoLabel></TableCell>
                    <TableCell><InfoLabel title="Bereitstellungszeit in Stunden.">Readiness</InfoLabel></TableCell>
                    <TableCell><InfoLabel title="FIFO-Reihenfolge bei verderblichen Gütern.">Perishable</InfoLabel></TableCell>
                    <TableCell><InfoLabel title="Vorgeschlagene Teilmenge aus diesem Lager.">Teilmenge</InfoLabel></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dlg.plan.alloc.map((a,i)=>(
                    <TableRow key={i}>
                      <TableCell>{a.org}</TableCell>
                      <TableCell>{a.storage}</TableCell>
                      <TableCell>~{a.readinessH}h</TableCell>
                      <TableCell>{a.perishable ? `MHD ${a.expiryDays}T` : '—'}</TableCell>
                      <TableCell>{a.take}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Typography variant="body2" component="div">
                <InfoLabel title="Angepasste Genehmigungsmenge – überschreibt den Vorschlag falls nötig.">
                  Genehmigte Menge: {dlg.approve}
                </InfoLabel>
              </Typography>

              <Tooltip
                arrow
                title={`Schieberegler für die endgültige Zuteilungsmenge (0 bis Bedarf: ${registry.demand[dlg.cat]||0}).`}
              >
                <Slider
                  min={0}
                  max={(registry.demand[dlg.cat]||0)}
                  value={dlg.approve}
                  onChange={(_,v)=>setDlg(prev=>({ ...prev, approve:v }))}
                  marks={[
                    { value: 0, label:'0' },
                    { value: dlg.plan.approved, label:'Vorschlag' },
                    { value: (registry.demand[dlg.cat]||0), label:'100%' }
                  ]}
                  aria-label="Genehmigungsmenge"
                />
              </Tooltip>

              {dlg.plan.remaining>0 && (
                <Alert severity="info">
                  Restbedarf offen → <b>Nachbestellen</b> (lizenzierte Anbieter) oder <b>Anforderung</b> an andere Stellen.
                </Alert>
              )}
            </Stack>
          ) : 'Lade Plan…'}
        </DialogContent>
        <DialogActions>
          {withTip('Dialog schließen, ohne Änderungen zu speichern.',
            <Button onClick={()=>setDlg({open:false})} aria-label="Abbrechen">Abbrechen</Button>
          )}
          {withTip('Zuteilungsplan genehmigen und übernehmen.',
            <Button variant="contained" onClick={()=>setDlg({open:false})} startIcon={<CheckCircleOutlineIcon/>} aria-label="Genehmigen">
              Genehmigen
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}
