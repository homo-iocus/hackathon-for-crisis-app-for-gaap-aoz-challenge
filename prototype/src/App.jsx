import * as React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Box } from '@mui/material'
import Dashboard from './screens/dashboard.jsx'
import CategoryPage from './screens/categorypage.jsx'
import ItemDetailPage from './screens/ItemDetailPage.jsx'

export default function App() {
  return (
    <Router>
      <Box sx={{ width: '100%', height: '100vh', overflowX: 'hidden' }}>
        <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              AOZ – Krisenmanagement
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Rolle: Krisenstab
            </Typography>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/item/:itemId" element={<ItemDetailPage />} />
        </Routes>
      </Box>
    </Router>
  )
}
