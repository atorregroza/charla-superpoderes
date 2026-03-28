import { useMemo, useState } from 'react'
import { FaArrowDown, FaChartLine, FaShuffle, FaSliders, FaTableCellsLarge } from 'react-icons/fa6'
import { SlideInView } from '../components/animations/SlideInView'
import { Container } from '../components/ui/Container'
import { datasaurusSets } from '../data/datasaurusSets'
import { seoConfig } from '../data/seoConfig'
import { usePageMeta } from '../hooks/usePageMeta'
import {
  anscombeSets,
  buildDistributionSummary,
  buildScatterSummary,
  exportScatterCsv,
  exportSeriesCsv,
  generateTukeySeries,
  tukeyPatterns,
} from '../utils/dataLab'

const panelClass = 'rounded-[1.8rem] border border-black/8 bg-white/80 p-5 shadow-[0_24px_60px_rgba(37,33,34,0.08)] backdrop-blur'

const metricCardClass = 'rounded-[1.4rem] border border-black/8 bg-[#fffdfa] p-4 shadow-[0_12px_30px_rgba(37,33,34,0.06)]'

const buttonClass = 'rounded-full px-4 py-2 text-base font-semibold transition duration-200 focus-visible-ring'

const downloadFile = (filename, content) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

const StatCard = ({ label, value, hint }) => (
  <div className={metricCardClass}>
    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5a5556]">{label}</p>
    <p className="mt-3 font-display text-3xl font-semibold text-dark">{value}</p>
    <p className="mt-2 text-base leading-relaxed text-[#4b4748]">{hint}</p>
  </div>
)

const ControlLabel = ({ children }) => (
  <label className="space-y-2">
    <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#5a5556]">{children}</span>
  </label>
)

const ScatterPlot = ({ points, regression }) => {
  const width = 560
  const height = 360
  const xValues = points.map(({ x }) => x)
  const yValues = points.map(({ y }) => y)
  const xMin = Math.min(...xValues) - 1
  const xMax = Math.max(...xValues) + 1
  const yMin = Math.min(...yValues) - 1
  const yMax = Math.max(...yValues) + 1

  const scaleX = (value) => 56 + ((value - xMin) / (xMax - xMin || 1)) * (width - 92)
  const scaleY = (value) => height - 42 - ((value - yMin) / (yMax - yMin || 1)) * (height - 88)
  const leftY = regression.intercept + regression.slope * xMin
  const rightY = regression.intercept + regression.slope * xMax

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[22rem] w-full rounded-[1.5rem] bg-[#fffdfa]">
      <rect x="0" y="0" width={width} height={height} rx="28" fill="#fffdfa" />
      {Array.from({ length: 5 }, (_, index) => {
        const y = 30 + index * 70
        return <line key={`grid-y-${index}`} x1="56" y1={y} x2={width - 28} y2={y} stroke="#e5ddd0" strokeDasharray="5 8" />
      })}
      {Array.from({ length: 6 }, (_, index) => {
        const x = 56 + index * 84
        return <line key={`grid-x-${index}`} x1={x} y1="28" x2={x} y2={height - 42} stroke="#ece4d7" strokeDasharray="5 8" />
      })}

      <line x1="56" y1={height - 42} x2={width - 28} y2={height - 42} stroke="#9ca3af" strokeWidth="1.5" />
      <line x1="56" y1="28" x2="56" y2={height - 42} stroke="#9ca3af" strokeWidth="1.5" />
      <line
        x1={scaleX(xMin)}
        y1={scaleY(leftY)}
        x2={scaleX(xMax)}
        y2={scaleY(rightY)}
        stroke="#f59e0b"
        strokeWidth="3"
        strokeDasharray="12 10"
      />

      {points.map(({ x, y }, index) => (
        <g key={`${x}-${y}-${index}`}>
          <circle cx={scaleX(x)} cy={scaleY(y)} r="9" fill="rgba(43,90,82,0.14)" />
          <circle cx={scaleX(x)} cy={scaleY(y)} r="5.5" fill="#2b5a52" />
        </g>
      ))}

      <text x="14" y="24" fill="#6b7280" fontSize="12">y</text>
      <text x={width - 18} y={height - 18} fill="#6b7280" fontSize="12">x</text>
    </svg>
  )
}

const DotPlot = ({ values }) => {
  const sorted = [...values].sort((a, b) => a - b)
  const width = 560
  const height = 280
  const min = Math.min(...sorted) - 1
  const max = Math.max(...sorted) + 1
  const stack = {}

  const dots = sorted.map((value) => {
    const key = value.toFixed(1)
    const level = stack[key] ?? 0
    stack[key] = level + 1
    return { value, level }
  })

  const scaleX = (value) => 44 + ((value - min) / (max - min || 1)) * (width - 88)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-72 w-full rounded-[1.5rem] bg-[#fffdfa]">
      <rect x="0" y="0" width={width} height={height} rx="28" fill="#fffdfa" />
      <line x1="44" y1={height - 38} x2={width - 24} y2={height - 38} stroke="#9ca3af" strokeWidth="1.5" />

      {Array.from({ length: 6 }, (_, index) => {
        const x = 44 + index * ((width - 88) / 5)
        return (
          <g key={`tick-${index}`}>
            <line x1={x} y1="36" x2={x} y2={height - 38} stroke="#ece4d7" strokeDasharray="4 8" />
            <text x={x} y={height - 14} textAnchor="middle" fill="#6b7280" fontSize="11">
              {(min + ((max - min) * index) / 5).toFixed(0)}
            </text>
          </g>
        )
      })}

      {dots.map(({ value, level }, index) => (
        <g key={`${value}-${index}`}>
          <circle cx={scaleX(value)} cy={height - 58 - level * 26} r="9" fill="rgba(251,176,65,0.24)" />
          <circle cx={scaleX(value)} cy={height - 58 - level * 26} r="5.5" fill="#f59e0b" />
        </g>
      ))}
    </svg>
  )
}

const BoxPlot = ({ summary }) => {
  const width = 560
  const height = 150
  const scaleX = (value) => 44 + ((value - summary.min) / (summary.max - summary.min || 1)) * (width - 88)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-40 w-full rounded-[1.5rem] bg-[#fffdfa]">
      <rect x="0" y="0" width={width} height={height} rx="28" fill="#fffdfa" />
      <line x1="44" y1="74" x2={width - 24} y2="74" stroke="#d6d3d1" strokeWidth="2" />
      <line x1={scaleX(summary.min)} y1="56" x2={scaleX(summary.min)} y2="92" stroke="#2b5a52" strokeWidth="3" />
      <line x1={scaleX(summary.max)} y1="56" x2={scaleX(summary.max)} y2="92" stroke="#2b5a52" strokeWidth="3" />
      <line x1={scaleX(summary.min)} y1="74" x2={scaleX(summary.q1)} y2="74" stroke="#2b5a52" strokeWidth="3" />
      <line x1={scaleX(summary.q3)} y1="74" x2={scaleX(summary.max)} y2="74" stroke="#2b5a52" strokeWidth="3" />
      <rect
        x={scaleX(summary.q1)}
        y="42"
        width={Math.max(scaleX(summary.q3) - scaleX(summary.q1), 4)}
        height="64"
        rx="18"
        fill="rgba(43,90,82,0.12)"
        stroke="#2b5a52"
        strokeWidth="3"
      />
      <line x1={scaleX(summary.median)} y1="42" x2={scaleX(summary.median)} y2="106" stroke="#f59e0b" strokeWidth="4" />

      {[
        { label: 'Min', value: summary.min },
        { label: 'Q1', value: summary.q1 },
        { label: 'Mediana', value: summary.median },
        { label: 'Q3', value: summary.q3 },
        { label: 'Max', value: summary.max },
      ].map((item) => (
        <g key={item.label}>
          <text x={scaleX(item.value)} y="24" textAnchor="middle" fill="#6b7280" fontSize="11">{item.label}</text>
          <text x={scaleX(item.value)} y="136" textAnchor="middle" fill="#374151" fontSize="11">{item.value}</text>
        </g>
      ))}
    </svg>
  )
}

const DataTable = ({ rows, columns }) => (
  <div className="overflow-hidden rounded-[1.5rem] border border-black/8 bg-[#fffdfa]">
    <table className="min-w-full border-collapse text-left">
      <thead className="bg-black/5">
        <tr>
          {columns.map((column) => (
            <th key={column.key} className="px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#5a5556]">
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index} className="border-t border-black/6">
            {columns.map((column) => (
              <td key={column.key} className="px-4 py-3 text-base text-[#403b3c]">
                {row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export const DataLab = () => {
  usePageMeta(seoConfig.dataLab)

  const [mode, setMode] = useState('anscombe')
  const [anscombeKey, setAnscombeKey] = useState('I')
  const [matejkaKey, setMatejkaKey] = useState('A')
  const [tukeyPattern, setTukeyPattern] = useState('bimodal')
  const [seriesSize, setSeriesSize] = useState(14)
  const [targetMean, setTargetMean] = useState(50)
  const [spread, setSpread] = useState(1)
  const [seed, setSeed] = useState(4)

  const activeAnscombe = useMemo(
    () => anscombeSets.find((set) => set.key === anscombeKey) ?? anscombeSets[0],
    [anscombeKey],
  )

  const activeTukey = useMemo(
    () => generateTukeySeries({ template: tukeyPattern, size: seriesSize, targetMean, spread, seed }),
    [seed, seriesSize, spread, targetMean, tukeyPattern],
  )

  const activeMatejka = useMemo(
    () => {
      const selected = datasaurusSets.find((set) => set.key === matejkaKey) ?? datasaurusSets[0]

      return {
        ...selected,
        points: selected.points.map(([x, y]) => ({ x, y })),
      }
    },
    [matejkaKey],
  )

  const scatterSummary = useMemo(
    () => buildScatterSummary((mode === 'matejka' ? activeMatejka : activeAnscombe).points),
    [activeAnscombe, activeMatejka, mode],
  )

  const distributionSummary = useMemo(
    () => buildDistributionSummary(activeTukey.values),
    [activeTukey],
  )

  const isAnscombe = mode === 'anscombe'
  const isTukey = mode === 'tukey'
  const isMatejka = mode === 'matejka'
  const activeScatterSet = isMatejka ? activeMatejka : activeAnscombe

  return (
    <div className="overflow-hidden bg-[radial-gradient(circle_at_top_left,#fff4df_0%,#f7f0e4_35%,#efe7d7_100%)] pb-20 pt-6">
      <Container className="space-y-8">
        <SlideInView duration={0.18} distance={10} threshold={0}>
          <section className="relative overflow-hidden rounded-[2.2rem] border border-white/60 bg-[#f8f3e8] px-6 py-8 shadow-[0_32px_90px_rgba(37,33,34,0.12)] sm:px-8 lg:px-10">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 w-[36%] bg-[radial-gradient(circle_at_top,rgba(43,90,82,0.18),transparent_55%),radial-gradient(circle_at_bottom,rgba(251,176,65,0.24),transparent_45%)]"
            />
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div className="space-y-5">
                <span className="inline-flex rounded-full border border-dark/10 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-primary">
                  Día de las Matemáticas 2026
                </span>
                <div className="space-y-4">
                  <h1 className="max-w-3xl font-display text-5xl font-semibold leading-none text-dark sm:text-6xl">
                    Genera datos al estilo de Anscombe, Tukey y Datasaurus
                  </h1>
                  <p className="max-w-2xl text-lg leading-relaxed text-[#403b3c] sm:text-xl">
                    Una miniaplicación para crear conjuntos que se ven parecidos en sus métricas pero cuentan historias visuales distintas.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.4rem] border border-black/8 bg-white/75 p-4">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5a5556]">Anscombe</p>
                  <p className="mt-2 text-base font-semibold text-dark">Misma correlación, figuras diferentes</p>
                </div>
                <div className="rounded-[1.4rem] border border-black/8 bg-white/75 p-4">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5a5556]">Tukey</p>
                  <p className="mt-2 text-base font-semibold text-dark">Explorar antes de resumir</p>
                </div>
                <div className="rounded-[1.4rem] border border-black/8 bg-white/75 p-4">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5a5556]">Matejka-Fitzmaurice</p>
                  <p className="mt-2 text-base font-semibold text-dark">Conjuntos reales del Datasaurus Dozen</p>
                </div>
              </div>
            </div>
          </section>
        </SlideInView>

        <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <SlideInView duration={0.18} distance={10} threshold={0}>
            <aside className={`${panelClass} space-y-6`}>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setMode('anscombe')}
                  className={`${buttonClass} ${isAnscombe ? 'bg-primary text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-primary/8'}`}
                >
                  <span className="inline-flex items-center gap-2">
                    <FaChartLine />
                    Modo Anscombe
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('tukey')}
                  className={`${buttonClass} ${isTukey ? 'bg-accent text-dark shadow-lg' : 'bg-white text-gray-700 hover:bg-accent/15'}`}
                >
                  <span className="inline-flex items-center gap-2">
                    <FaSliders />
                    Modo Tukey
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('matejka')}
                  className={`${buttonClass} ${isMatejka ? 'bg-dark text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-dark/8'}`}
                >
                  <span className="inline-flex items-center gap-2">
                    <FaChartLine />
                    Modo Matejka
                  </span>
                </button>
              </div>

              {isAnscombe || isMatejka ? (
                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5a5556]">
                      {isMatejka ? 'Elige una figura' : 'Elige un conjunto'}
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {(isMatejka ? datasaurusSets : anscombeSets).map((set) => (
                        <button
                          key={set.key}
                          type="button"
                          onClick={() => (isMatejka ? setMatejkaKey(set.key) : setAnscombeKey(set.key))}
                          className={`rounded-[1.25rem] border p-4 text-left transition ${(isMatejka ? matejkaKey : anscombeKey) === set.key ? 'border-primary bg-primary/8 shadow-md' : 'border-black/8 bg-white/75 hover:border-primary/30 hover:bg-white'}`}
                        >
                          <p className="font-display text-lg font-semibold text-dark">{set.label}</p>
                          <p className="mt-2 text-base leading-relaxed text-[#4b4748]">{set.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-dashed border-primary/30 bg-primary/6 p-4">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Qué observar</p>
                    <p className="mt-2 text-base leading-relaxed text-[#403b3c]">
                      {isMatejka
                        ? 'Estos conjuntos provienen del Datasaurus Dozen: comparten prácticamente los mismos estadísticos globales, pero la forma cambia de manera drástica.'
                        : 'Las estadísticas resumen cambian muy poco, pero la geometría del gráfico sí cambia bastante. Esa tensión es justo la lección de Anscombe.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => downloadFile(`${isMatejka ? 'datasaurus' : 'anscombe'}-${activeScatterSet.key.toLowerCase()}.csv`, exportScatterCsv(activeScatterSet.points))}
                    className="inline-flex items-center gap-2 rounded-full bg-dark px-5 py-3 text-base font-semibold text-white transition hover:bg-dark/90"
                  >
                    <FaArrowDown />
                    Descargar CSV
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="space-y-3">
                    <ControlLabel>Patrón</ControlLabel>
                    <div className="grid gap-3">
                      {tukeyPatterns.map((pattern) => (
                        <button
                          key={pattern.key}
                          type="button"
                          onClick={() => setTukeyPattern(pattern.key)}
                          className={`rounded-[1.25rem] border p-4 text-left transition ${tukeyPattern === pattern.key ? 'border-amber-400 bg-amber-50 shadow-md' : 'border-black/8 bg-white/75 hover:border-amber-300 hover:bg-white'}`}
                        >
                          <p className="font-display text-lg font-semibold text-dark">{pattern.label}</p>
                          <p className="mt-2 text-base leading-relaxed text-[#4b4748]">{pattern.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <ControlLabel>
                      Tamaño de la serie
                      <input
                        type="range"
                        min="8"
                        max="24"
                        step="1"
                        value={seriesSize}
                        onChange={(event) => setSeriesSize(Number(event.target.value))}
                        className="mt-3 w-full accent-primary"
                      />
                      <p className="text-base text-[#403b3c]">{seriesSize} observaciones</p>
                    </ControlLabel>

                    <ControlLabel>
                      Media objetivo
                      <input
                        type="range"
                        min="20"
                        max="90"
                        step="1"
                        value={targetMean}
                        onChange={(event) => setTargetMean(Number(event.target.value))}
                        className="mt-3 w-full accent-primary"
                      />
                      <p className="text-base text-[#403b3c]">{targetMean}</p>
                    </ControlLabel>

                    <ControlLabel>
                      Apertura
                      <input
                        type="range"
                        min="0.6"
                        max="1.8"
                        step="0.1"
                        value={spread}
                        onChange={(event) => setSpread(Number(event.target.value))}
                        className="mt-3 w-full accent-primary"
                      />
                      <p className="text-base text-[#403b3c]">{spread.toFixed(1)}</p>
                    </ControlLabel>

                    <ControlLabel>
                      Semilla
                      <input
                        type="range"
                        min="1"
                        max="24"
                        step="1"
                        value={seed}
                        onChange={(event) => setSeed(Number(event.target.value))}
                        className="mt-3 w-full accent-primary"
                      />
                      <p className="text-base text-[#403b3c]">{seed}</p>
                    </ControlLabel>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setSeed((current) => current + 1)}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-base font-semibold text-white transition hover:bg-primary/92"
                    >
                      <FaShuffle />
                      Generar otra muestra
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadFile(`tukey-${activeTukey.key}.csv`, exportSeriesCsv(activeTukey.values))}
                      className="inline-flex items-center gap-2 rounded-full bg-dark px-5 py-3 text-base font-semibold text-white transition hover:bg-dark/90"
                    >
                      <FaArrowDown />
                      Descargar CSV
                    </button>
                  </div>
                </div>
              )}
            </aside>
          </SlideInView>

          <SlideInView duration={0.18} distance={10} threshold={0}>
            <section className={`${panelClass} space-y-6`}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5a5556]">
                    {isTukey ? 'Visualizador exploratorio' : 'Visualizador de dispersión'}
                  </p>
                  <h2 className="mt-2 font-display text-4xl font-semibold text-dark">
                    {isTukey ? activeTukey.label : activeScatterSet.label}
                  </h2>
                  <p className="mt-3 max-w-2xl text-[1.06rem] leading-relaxed text-[#403b3c]">
                    {isTukey ? activeTukey.description : activeScatterSet.description}
                  </p>
                </div>
                <div className="rounded-[1.3rem] border border-black/8 bg-white/80 px-4 py-3">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5a5556]">Lectura rápida</p>
                  <p className="mt-2 text-base leading-relaxed text-[#403b3c]">
                    {!isTukey
                      ? 'Compara pendiente, correlación y forma del diagrama.'
                      : 'Contrasta media y mediana con la forma del punto a punto.'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#5a5556]">
                  <FaChartLine />
                  Gráficas
                </div>
                {!isTukey ? (
                  <ScatterPlot points={activeScatterSet.points} regression={scatterSummary.regressionCoefficients} />
                ) : (
                  <div className="grid gap-4">
                    <DotPlot values={activeTukey.values} />
                    <BoxPlot summary={distributionSummary} />
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {!isTukey ? (
                  <>
                    <StatCard label="Media de x" value={scatterSummary.meanX} hint={isMatejka ? 'Se mantiene muy parecida entre figuras distintas.' : 'Se mantiene casi intacta en los cuatro conjuntos.'} />
                    <StatCard label="Media de y" value={scatterSummary.meanY} hint={isMatejka ? 'Otra métrica que apenas cambia aunque la forma sí cambie.' : 'Otra estadística estable que no revela la forma.'} />
                    <StatCard label="Correlación" value={scatterSummary.correlation} hint={isMatejka ? 'Casi no cambia, aunque la figura sí lo haga.' : 'Parece decir lo mismo aunque el patrón visual cambie.'} />
                    <StatCard label="Varianza de x" value={scatterSummary.varianceX} hint={isMatejka ? 'Muy parecida entre conjuntos con formas distintas.' : 'La dispersión en x apenas se mueve entre versiones.'} />
                    <StatCard label="Varianza de y" value={scatterSummary.varianceY} hint={isMatejka ? 'Otra constancia engañosa cuando solo miramos el resumen.' : 'Otra pista de por qué solo mirar la tabla es insuficiente.'} />
                    <StatCard label="Regresión" value={scatterSummary.regression} hint={isMatejka ? 'La línea resumen parece estable aunque el dibujo de los puntos cambie.' : 'La recta ajustada casi coincide en toda la familia.'} />
                  </>
                ) : (
                  <>
                    <StatCard label="Media" value={distributionSummary.mean} hint="La forzamos como objetivo para imitar una tabla engañosa." />
                    <StatCard label="Mediana" value={distributionSummary.median} hint="Suele desenmascarar asimetrías u observaciones extremas." />
                    <StatCard label="Desv. estándar" value={distributionSummary.standardDeviation} hint="Resume apertura, pero no cuenta toda la historia." />
                    <StatCard label="Q1" value={distributionSummary.q1} hint="Primer cuartil: inicio de la caja en el boxplot." />
                    <StatCard label="Q3" value={distributionSummary.q3} hint="Tercer cuartil: final de la caja en el boxplot." />
                    <StatCard label="Mínimo" value={distributionSummary.min} hint="Muestra el borde inferior de la muestra actual." />
                    <StatCard label="Máximo" value={distributionSummary.max} hint="En el patrón con outlier verás el salto enseguida." />
                    <StatCard label="Rango" value={distributionSummary.range} hint="Otra medida útil, pero todavía ciega a la forma." />
                  </>
                )}
              </div>

              <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
                <div className="rounded-[1.5rem] border border-dashed border-black/10 bg-black/3 p-5">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5a5556]">Clave para la charla</p>
                  <p className="mt-3 text-[1.06rem] leading-relaxed text-[#403b3c]">
                    {!isTukey
                      ? isMatejka
                        ? 'Aquí se ve con claridad la idea central: conjuntos con resúmenes numéricos muy parecidos pueden producir figuras completamente distintas.'
                        : 'Anscombe sirve para abrir la charla con una sorpresa simple: la tabla parece estable, pero el gráfico cambia por completo la interpretación.'
                      : 'Tukey entra aquí como principio rector: antes de resumir, conviene mirar. La forma de los datos también es información.'}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#5a5556]">
                    <FaTableCellsLarge />
                    Datos generados
                  </div>
                  {!isTukey ? (
                    <DataTable
                      columns={[
                        { key: 'x', label: 'x' },
                        { key: 'y', label: 'y' },
                      ]}
                      rows={activeScatterSet.points.map(({ x, y }) => ({ x, y }))}
                    />
                  ) : (
                    <DataTable
                      columns={[
                        { key: 'index', label: '#' },
                        { key: 'value', label: 'valor' },
                      ]}
                      rows={activeTukey.values.map((value, index) => ({ index: index + 1, value }))}
                    />
                  )}
                </div>
              </div>
            </section>
          </SlideInView>
        </div>
      </Container>
    </div>
  )
}
