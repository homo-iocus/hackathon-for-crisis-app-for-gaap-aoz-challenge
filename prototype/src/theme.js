import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: { main: '#0062a3' },
    secondary: { main: '#00a39a' }
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: `'Inter', system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans", "Helvetica Neue", sans-serif`,
    h5: { fontWeight: 700 }
  }
})

export default theme
