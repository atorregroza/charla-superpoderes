import { lazy, Suspense } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const CharlaSuperpoderesPage = lazy(() => import('./pages/CharlaSuperpoderes').then(m => ({ default: m.CharlaSuperpoderes })))
const DataLabPage = lazy(() => import('./pages/DataLab').then(m => ({ default: m.DataLab })))
const PreferenciasDigitalesPage = lazy(() => import('./pages/PreferenciasDigitales').then(m => ({ default: m.PreferenciasDigitales })))
const DecisionesOptimizacionPage = lazy(() => import('./pages/DecisionesOptimizacion').then(m => ({ default: m.DecisionesOptimizacion })))

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Cargando...</div>}>
          <Routes>
            <Route path="/" element={<CharlaSuperpoderesPage />} />
            <Route path="/las-matematicas-y-la-esperanza" element={<CharlaSuperpoderesPage />} />
            <Route path="/laboratorio-datos" element={<DataLabPage />} />
            <Route path="/preferencias-digitales" element={<PreferenciasDigitalesPage />} />
            <Route path="/decisiones-optimizacion" element={<DecisionesOptimizacionPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  )
}
