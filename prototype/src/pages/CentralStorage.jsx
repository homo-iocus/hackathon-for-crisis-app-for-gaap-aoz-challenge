import React, { useMemo, useState } from 'react'
import {
  AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, Stack, Chip,
  Button, LinearProgress, Box, TextField, Table, TableHead, TableRow, TableCell,
  TableBody, Dialog, DialogTitle, DialogContent, DialogActions, Slider, Alert
} from '@mui/material'
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined'
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import WeekendOutlinedIcon from '@mui/icons-material/WeekendOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

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
function chipByCoverage(have, need){
  if (have >= need) return <Chip size="small" color="success" label="OK" />
  if (have >= 0.7*need) return <Chip size="small" color="warning" label="Eng" />
  return <Chip size="small" color="error" label="Kritisch" />
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

          <Button variant="contained" onClick={()=>openPlan('accommodation')}>Schnell zuteilen</Button>
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
                      {c.icon}
                      <Typography variant="subtitle1" fontWeight={600}>{c.label}</Typography>
                      <Box sx={{ flex:1 }}/>
                      {chipByCoverage(have, need)}
                      <Chip size="small" label={`${have}/${need}`} sx={{ ml:1 }}/>
                      <Button size="small" variant="contained" sx={{ ml:1 }} onClick={()=>openPlan(c.key)}>Zuteilen</Button>
                      <Button size="small" variant="outlined">Nachbestellen</Button>
                    </Stack>
                    <LinearProgress color={color} variant="determinate" value={pct} sx={{ mt:1, height:10, borderRadius:1 }}/>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>

        <Stack direction={{xs:'column', sm:'row'}} spacing={2} sx={{ mt:3 }}>
          <TextField
            select size="small" label="Kategorie" value={catFilter} onChange={e=>setCatFilter(e.target.value)} sx={{ minWidth:220 }}
            SelectProps={{ native:true }}
          >
            <option value="all">Alle</option>
            {CATS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </TextField>
          <TextField size="small" label="Suche (Organisation/Storage/Artikel)" value={q} onChange={e=>setQ(e.target.value)} fullWidth />
        </Stack>

        <Card sx={{ mt:2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Bestände (vereinheitlicht)</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Organisation</TableCell>
                  <TableCell>Storage</TableCell>
                  <TableCell>Kategorie</TableCell>
                  <TableCell>Artikel</TableCell>
                  <TableCell>Menge</TableCell>
                  <TableCell>Readiness</TableCell>
                  <TableCell>Perishable</TableCell>
                  <TableCell align="right">Aktionen</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((r,i)=>(
                  <TableRow key={i}>
                    <TableCell>{r.org}</TableCell>
                    <TableCell>{r.storage}</TableCell>
                    <TableCell>{CATS.find(c=>c.key===r.cat)?.label}</TableCell>
                    <TableCell>{r.item}</TableCell>
                    <TableCell>{r.qty}</TableCell>
                    <TableCell>~{r.readinessH}h</TableCell>
                    <TableCell>
                      {r.perishable
                        ? <Chip size="small" color={(r.expiryDays<=14)?'error':'warning'} label={`MHD ${r.expiryDays}T`} />
                        : <Chip size="small" label="—" />}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button size="small" variant="outlined" onClick={()=>openPlan(r.cat)}>Zuteilen</Button>
                        {r.perishable && <Button size="small" variant="outlined" color="success">FIFO</Button>}
                        <Button size="small" variant="text" startIcon={<LocalShippingOutlinedIcon/>}>Transport</Button>
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
                              {c.icon}
                              <Typography sx={{ minWidth:140 }}>{c.label}</Typography>
                              {chipByCoverage(have, need)}
                              <Box sx={{ flex:1 }}/>
                              <Typography variant="body2" color="text.secondary">{have}/{need}</Typography>
                              <Button size="small" variant="text" onClick={()=>openPlan(c.key)}>Zuteilen</Button>
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

      <Dialog open={dlg.open} onClose={()=>setDlg({open:false})} fullWidth maxWidth="sm">
        <DialogTitle>Zuteilungsplan (zentral)</DialogTitle>
        <DialogContent dividers>
          {dlg.plan ? (
            <Stack spacing={2}>
              <Alert severity={dlg.plan.remaining>0?'warning':'success'}>
                Vorschlag: {dlg.plan.approved} zuweisen — Rest: {dlg.plan.remaining}
              </Alert>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Organisation</TableCell>
                    <TableCell>Storage</TableCell>
                    <TableCell>Readiness</TableCell>
                    <TableCell>Perishable</TableCell>
                    <TableCell>Teilmenge</TableCell>
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

              <Typography variant="body2">Genehmigte Menge: {dlg.approve}</Typography>
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
              />

              {dlg.plan.remaining>0 && (
                <Alert severity="info">
                  Restbedarf offen → <b>Nachbestellen</b> (lizenzierte Anbieter) oder <b>Anforderung</b> an andere Stellen.
                </Alert>
              )}
            </Stack>
          ) : 'Lade Plan…'}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setDlg({open:false})}>Abbrechen</Button>
          <Button variant="contained" onClick={()=>setDlg({open:false})} startIcon={<CheckCircleOutlineIcon/>}>Genehmigen</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
