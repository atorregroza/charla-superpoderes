import { useMemo, useState } from 'react'
import { FaArrowTrendUp, FaCartShopping, FaClock, FaEye, FaLocationDot, FaMusic, FaShieldHalved, FaTriangleExclamation, FaFingerprint, FaBrain, FaShuffle, FaCircleQuestion } from 'react-icons/fa6'
import { Container } from '../components/ui/Container'
import { seoConfig } from '../data/seoConfig'
import { usePageMeta } from '../hooks/usePageMeta'

const youthRecommendations = [
  {
    title: 'Revisa permisos',
    body: 'Antes de instalar o abrir una app, mira si realmente necesita tu ubicación, cámara, micrófono o contactos.',
  },
  {
    title: 'No aceptes por reflejo',
    body: 'Lee al menos lo esencial cuando una plataforma te pide datos, cookies o acceso extra. Un clic rápido también deja huella.',
  },
  {
    title: 'Desactiva lo innecesario',
    body: 'Si una función no la usas, apágala: historial de ubicación, notificaciones invasivas o seguimiento entre apps.',
  },
  {
    title: 'Compara lo que ves',
    body: 'Si una app siempre te muestra lo mismo, busca otras fuentes. El algoritmo no debería decidir por completo tu mundo.',
  },
]

const controls = [
  {
    key: 'watchTime',
    label: 'Tiempo viendo videos',
    shortLabel: 'Videos',
    icon: FaEye,
    minLabel: 'Curiosidad baja',
    maxLabel: 'Consume mucho',
  },
  {
    key: 'nightClicks',
    label: 'Actividad nocturna',
    shortLabel: 'Noche',
    icon: FaClock,
    minLabel: 'Casi nunca',
    maxLabel: 'Muy frecuente',
  },
  {
    key: 'musicRepeats',
    label: 'Repite canciones',
    shortLabel: 'Repite',
    icon: FaMusic,
    minLabel: 'Explora mucho',
    maxLabel: 'Prefiere lo familiar',
  },
  {
    key: 'shoppingImpulse',
    label: 'Responde a ofertas',
    shortLabel: 'Ofertas',
    icon: FaCartShopping,
    minLabel: 'Compra con calma',
    maxLabel: 'Compra rápido',
  },
  {
    key: 'locationShare',
    label: 'Comparte ubicación',
    shortLabel: 'Ubicación',
    icon: FaLocationDot,
    minLabel: 'Muy poco',
    maxLabel: 'Con frecuencia',
  },
]

const toneByValue = (value, low, medium, high) => {
  if (value < 34) return low
  if (value < 67) return medium
  return high
}

const trafficLightByRisk = (risk) => {
  if (risk < 34) {
    return {
      label: 'Bajo',
      message: 'Poca predictibilidad',
      accent: 'emerald',
      active: 'green',
    }
  }

  if (risk < 67) {
    return {
      label: 'Medio',
      message: 'Perfilado moderado',
      accent: 'amber',
      active: 'yellow',
    }
  }

  return {
    label: 'Alto',
    message: 'Muy predecible',
    accent: 'rose',
    active: 'red',
  }
}

const footprintPalette = ['#2b5a52', '#f59e0b', '#e67a3a', '#8b5cf6', '#ef4444']

const RadarFootprint = ({ controls, signals, accent }) => {
  const width = 520
  const height = 390
  const centerX = width / 2
  const centerY = height / 2
  const radius = 122
  const levels = [0.25, 0.5, 0.75, 1]
  const points = controls.map((item, index) => {
    const angle = (-Math.PI / 2) + (index / controls.length) * Math.PI * 2
    const signalValue = Number.isFinite(signals[item.key]) ? signals[item.key] : 0
    const valueRadius = (signalValue / 100) * radius
    const rawLabelX = centerX + Math.cos(angle) * (radius + 50)
    const rawLabelY = centerY + Math.sin(angle) * (radius + 36)

    return {
      ...item,
      angle,
      x: centerX + Math.cos(angle) * valueRadius,
      y: centerY + Math.sin(angle) * valueRadius,
      labelX: Math.max(52, Math.min(width - 52, rawLabelX)),
      labelY: Math.max(28, Math.min(height - 28, rawLabelY)),
    }
  })

  const polygonPoints = points.map((point) => `${point.x},${point.y}`).join(' ')
  const fillColor = accent === 'emerald'
    ? 'rgba(16,185,129,0.18)'
    : accent === 'amber'
      ? 'rgba(245,158,11,0.2)'
      : 'rgba(244,63,94,0.18)'
  const strokeColor = accent === 'emerald'
    ? '#059669'
    : accent === 'amber'
      ? '#d97706'
      : '#e11d48'

  return (
    <div className="rounded-[1.9rem] border border-black/8 bg-[#fffdfa] p-6 shadow-[0_18px_48px_rgba(37,33,34,0.07)]">
      <p className="text-sm font-bold uppercase tracking-[0.24em] text-gray-600">Radar de huella digital</p>
      <p className="mt-2 max-w-lg font-display text-[clamp(1.8rem,2.2vw,2.5rem)] font-semibold leading-tight text-dark">
        Forma matemática de tus señales
      </p>

      <div className="mt-4 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto h-[24rem] w-full max-w-[34rem]">
          <rect width={width} height={height} rx="28" fill="#fffdfa" />
          {levels.map((level) => {
            const ringPoints = controls.map((_, index) => {
              const angle = (-Math.PI / 2) + (index / controls.length) * Math.PI * 2
              const x = centerX + Math.cos(angle) * radius * level
              const y = centerY + Math.sin(angle) * radius * level
              return `${x},${y}`
            }).join(' ')

            return (
              <polygon
                key={level}
                points={ringPoints}
                fill="none"
                stroke="#e7dfd4"
                strokeDasharray="6 8"
                strokeWidth="1.4"
              />
            )
          })}

          {points.map((point) => (
            <line
              key={`axis-${point.key}`}
              x1={centerX}
              y1={centerY}
              x2={centerX + Math.cos(point.angle) * radius}
              y2={centerY + Math.sin(point.angle) * radius}
              stroke="#d8d1c5"
              strokeWidth="1.3"
            />
          ))}

          <polygon
            points={polygonPoints}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="3"
          />

          {points.map((point, index) => (
            <g key={point.key}>
              <circle cx={point.x} cy={point.y} r="6" fill={footprintPalette[index]} />
              <text
                x={point.labelX}
                y={point.labelY}
                textAnchor={point.labelX < centerX - 10 ? 'end' : point.labelX > centerX + 10 ? 'start' : 'middle'}
                dominantBaseline="middle"
                fill="#374151"
                fontSize="17"
                fontWeight="600"
              >
                {point.shortLabel}
              </text>
            </g>
          ))}

          <circle cx={centerX} cy={centerY} r="4" fill="#252122" />
        </svg>
      </div>
    </div>
  )
}

const FootprintChart = ({ controls, signals, weightedSignals, risk, accent }) => {
  return (
    <div className="grid gap-5 2xl:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)]">
      <RadarFootprint controls={controls} signals={signals} accent={accent} />

      <div className="rounded-[1.9rem] border border-black/8 bg-[#fffdfa] p-6 shadow-[0_18px_48px_rgba(37,33,34,0.07)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-gray-600">Riesgo calculado</p>
            <p className="mt-2 max-w-md font-display text-[clamp(1.8rem,2.1vw,2.45rem)] font-semibold leading-tight text-dark">
              Cuánto aporta cada señal
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Riesgo {risk}%
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {controls.map((item, index) => (
            <div key={item.key} className="grid gap-2 lg:grid-cols-[12rem_1fr_auto] lg:items-center">
              {(() => {
                const currentSignal = weightedSignals[item.key] ?? { contribution: 0, weightLabel: '0%' }

                return (
                  <>
                    <div>
                      <p className="text-[1.05rem] font-semibold leading-tight text-dark">{item.label}</p>
                      <p className="text-sm uppercase tracking-[0.16em] text-gray-500">peso {currentSignal.weightLabel}</p>
                    </div>

                    <div className="relative h-4 overflow-hidden rounded-full bg-stone-200">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-300"
                        style={{
                          width: `${currentSignal.contribution}%`,
                          background: `linear-gradient(90deg, ${footprintPalette[index]}cc, ${footprintPalette[index]})`,
                        }}
                      />
                    </div>

                    <div className="min-w-[3.5rem] text-right">
                      <span className="font-display text-2xl font-semibold text-dark">{currentSignal.contribution}</span>
                    </div>
                  </>
                )
              })()}
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[1.45rem] border border-dashed border-black/10 bg-black/3 p-5">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-gray-600">Fórmula visible</p>
          <p className="mt-2 text-lg leading-relaxed text-gray-800">
            riesgo = combinación ponderada de señales digitales
          </p>
          <p className="mt-3 text-base leading-relaxed text-gray-800 sm:text-lg">
            Ejemplo:
            {' '}0.24(video) +
            {' '}0.18(noche) +
            {' '}0.16(repetición) +
            {' '}0.24(ofertas) +
            {' '}0.18(ubicación)
          </p>
        </div>
      </div>
    </div>
  )
}

export const PreferenciasDigitales = () => {
  usePageMeta(seoConfig.preferenciasDigitales)

  const [signals, setSignals] = useState({
    watchTime: 76,
    nightClicks: 62,
    musicRepeats: 81,
    shoppingImpulse: 54,
    locationShare: 33,
  })

  const profile = useMemo(() => {
    const attention = toneByValue(
      signals.watchTime,
      'Tu rastro digital sugiere exploración breve y cambios rápidos de interés.',
      'Tu rastro digital sugiere interes sostenido cuando algo logra atraparte.',
      'Tu rastro digital sugiere alta retención: es probable que una plataforma detecte rápido lo que te engancha.',
    )

    const timing = toneByValue(
      signals.nightClicks,
      'Una app te veria como alguien poco predecible en horarios.',
      'Una app podria aprender franjas de tiempo en las que sueles responder.',
      'Una app podria programar notificaciones justo cuando eres mas propenso a abrirlas.',
    )

    const taste = toneByValue(
      signals.musicRepeats,
      'Tus datos apuntarían a gustos variados y menos fáciles de encasillar.',
      'Tus datos mezclan exploración con costumbre, un perfil útil para recomendaciones suaves.',
      'Tus datos apuntarían a preferencias muy estables, fáciles de alimentar con contenido parecido.',
    )

    const commercial = toneByValue(
      signals.shoppingImpulse,
      'Tu comportamiento sugeriría decisiones lentas y comparadas.',
      'Tu comportamiento sugeriría apertura moderada a descuentos y recordatorios.',
      'Tu comportamiento sugeriría sensibilidad alta a urgencia, escasez y ofertas personalizadas.',
    )

    const risk = Math.round(
      (signals.watchTime * 0.24)
      + (signals.nightClicks * 0.18)
      + (signals.musicRepeats * 0.16)
      + (signals.shoppingImpulse * 0.24)
      + (signals.locationShare * 0.18),
    )

    return {
      attention,
      timing,
      taste,
      commercial,
      risk,
    }
  }, [signals])

  const trafficLight = useMemo(
    () => trafficLightByRisk(profile.risk),
    [profile.risk],
  )

  const inferenceToneClass = useMemo(() => {
    if (profile.risk < 34) {
      return 'border-emerald-200 bg-emerald-50/75'
    }

    if (profile.risk < 67) {
      return 'border-amber-200 bg-amber-50/80'
    }

    return 'border-rose-200 bg-rose-50/85'
  }, [profile.risk])

  const inferenceLabelClass = useMemo(() => {
    if (profile.risk < 34) {
      return 'text-emerald-700'
    }

    if (profile.risk < 67) {
      return 'text-amber-700'
    }

    return 'text-rose-700'
  }, [profile.risk])

  const inferenceSurfaceClass = useMemo(() => {
    if (profile.risk < 34) {
      return 'border-emerald-300 bg-gradient-to-br from-emerald-50 via-emerald-50 to-white'
    }

    if (profile.risk < 67) {
      return 'border-amber-300 bg-gradient-to-br from-amber-50 via-amber-50 to-white'
    }

    return 'border-rose-300 bg-gradient-to-br from-rose-50 via-rose-50 to-white'
  }, [profile.risk])

  const inferenceBadgeClass = useMemo(() => {
    if (profile.risk < 34) {
      return 'bg-emerald-600 text-white'
    }

    if (profile.risk < 67) {
      return 'bg-amber-500 text-white'
    }

    return 'bg-rose-600 text-white'
  }, [profile.risk])

  const inferredActions = useMemo(() => {
    if (profile.risk < 34) {
      return [
        {
          title: 'Lo que el sistema podria inferir',
          body: 'Tus señales todavía muestran un perfil abierto y cambiante, menos fácil de encasillar con seguridad.',
        },
        {
          title: 'Lo que podria decidir mostrarte',
          body: 'La plataforma tendría menos certezas, así que probaría opciones variadas antes de insistir en una sola línea.',
        },
        {
          title: 'Lo que podria elegir por timing',
          body: 'Tus horarios se verían menos estables, por lo que sería más difícil anticipar cuándo reaccionas.',
        },
        {
          title: 'Lo que podria intentar venderte',
          body: 'Haría intentos más generales, porque tu rastro aún no sugiere un patrón comercial muy claro.',
        },
      ]
    }

    if (profile.risk < 67) {
      return [
        {
          title: 'Lo que el sistema podria inferir',
          body: 'Ya aparecen hábitos reconocibles: el sistema podría construir un perfil útil, aunque todavía no totalmente estable.',
        },
        {
          title: 'Lo que podria decidir mostrarte',
          body: 'Empezaría a priorizar contenidos parecidos a los que más retienen tu atención y a repetir ciertas recomendaciones.',
        },
        {
          title: 'Lo que podria elegir por timing',
          body: 'Podría detectar algunas franjas horarias favorables y usarlas para enviarte mensajes o notificaciones.',
        },
        {
          title: 'Lo que podria intentar venderte',
          body: 'Ya tendría pistas suficientes para combinar recordatorios, descuentos y pequeños empujes personalizados.',
        },
      ]
    }

    return [
      {
        title: 'Lo que el sistema podria inferir',
        body: 'Tus señales dibujan un perfil muy consistente: gustos, hábitos y respuestas probables aparecen con bastante nitidez.',
      },
      {
        title: 'Lo que podria decidir mostrarte',
        body: 'La plataforma podría ajustar con rapidez lo que ves para mantenerte dentro de contenidos muy parecidos entre sí.',
      },
      {
        title: 'Lo que podria elegir por timing',
        body: 'Tus rutinas se vuelven más previsibles, así que el sistema puede elegir momentos muy precisos para buscar tu reacción.',
      },
      {
        title: 'Lo que podria intentar venderte',
        body: 'También podría empujar ofertas, urgencias y mensajes personalizados con mayor probabilidad de acierto.',
      },
    ]
  }, [profile.risk])

  const weightedSignals = useMemo(() => ({
    watchTime: { contribution: Math.round(signals.watchTime * 0.24), weightLabel: '24%' },
    nightClicks: { contribution: Math.round(signals.nightClicks * 0.18), weightLabel: '18%' },
    musicRepeats: { contribution: Math.round(signals.musicRepeats * 0.16), weightLabel: '16%' },
    shoppingImpulse: { contribution: Math.round(signals.shoppingImpulse * 0.24), weightLabel: '24%' },
    locationShare: { contribution: Math.round(signals.locationShare * 0.18), weightLabel: '18%' },
  }), [signals])

  const handleChange = (key, value) => {
    setSignals((current) => ({
      ...current,
      [key]: Number(value),
    }))
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#fff6e5_0%,#f4eadf_35%,#e9dfd4_100%)] pb-16 pt-6">
      <Container className="max-w-[96rem] space-y-8">
        <section className="relative overflow-hidden rounded-[2.4rem] border border-white/70 bg-[#f7f0e7] px-6 py-8 shadow-[0_32px_90px_rgba(37,33,34,0.12)] sm:px-8 lg:px-10">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(43,90,82,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(230,122,58,0.16),transparent_36%)]"
          />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <span className="inline-flex rounded-full border border-dark/10 bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-primary">
                  Día de las Matemáticas 2026
              </span>
              <div className="space-y-4">
                <h1 className="max-w-4xl font-display text-5xl font-semibold leading-none text-dark sm:text-6xl">
                    Nuestras huellas digitales influyen en lo que otros sistemas creen saber sobre nosotros.
                </h1>
                <p className="max-w-3xl text-xl leading-relaxed text-gray-800 sm:text-[1.4rem]">
                    Hoy no solo compartimos información: también dejamos patrones de conducta que pueden ser leídos, clasificados y utilizados para anticipar decisiones.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-black/8 bg-white/80 p-4 shadow-[0_14px_34px_rgba(37,33,34,0.05)]">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-lg text-primary">
                    <FaFingerprint />
                  </span>
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-gray-600">Huellas</p>
                </div>
                <p className="mt-2 text-lg font-semibold leading-snug text-dark">Cada clic deja rastro. Cada pausa también.</p>
              </div>
              <div className="rounded-[1.5rem] border border-black/8 bg-white/80 p-4 shadow-[0_14px_34px_rgba(37,33,34,0.05)]">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-lg text-amber-700">
                    <FaBrain />
                  </span>
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-gray-600">Inferencias</p>
                </div>
                <p className="mt-2 text-lg font-semibold leading-snug text-dark">Tus huellas pueden transformarse en un perfil sobre quién eres y qué podrías hacer.</p>
              </div>
              <div className="rounded-[1.5rem] border border-black/8 bg-white/80 p-4 shadow-[0_14px_34px_rgba(37,33,34,0.05)]">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-lg text-rose-700">
                    <FaShuffle />
                  </span>
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-gray-600">Consecuencias</p>
                </div>
                <p className="mt-2 text-lg font-semibold leading-snug text-dark">Lo que un sistema cree sobre ti puede cambiar lo que ves, lo que recibes y lo que decides.</p>
              </div>
              <div className="rounded-[1.5rem] border border-black/8 bg-white/80 p-4 shadow-[0_14px_34px_rgba(37,33,34,0.05)]">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-lg text-violet-700">
                    <FaCircleQuestion />
                  </span>
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-gray-600">Pregunta clave</p>
                </div>
                <p className="mt-2 text-lg font-semibold leading-snug text-dark">Si una máquina te interpreta, ¿quién responde cuando se equivoca?</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(22rem,0.78fr)_minmax(0,1.22fr)]">
          <section className="space-y-5 rounded-[2rem] border border-black/8 bg-white/80 p-6 shadow-[0_24px_60px_rgba(37,33,34,0.08)] backdrop-blur">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-gray-600">Paso 1 · Ajusta las señales</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-dark">
                Simula la huella que una plataforma podría usar
              </h2>
            </div>

            <div className="space-y-5">
              {controls.map(({ key, label, icon: Icon, minLabel, maxLabel }) => (
                <div key={key} className="rounded-[1.4rem] border border-black/8 bg-[#fffdfa] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon />
                      </span>
                      <div>
                        <label htmlFor={key} className="font-semibold text-dark">{label}</label>
                        <p className="text-base font-medium text-gray-700">{signals[key]}/100</p>
                      </div>
                    </div>
                  </div>
                  <input
                    id={key}
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={signals[key]}
                    onChange={(event) => handleChange(key, event.target.value)}
                    className="mt-4 w-full accent-primary"
                  />
                  <div className="mt-2 flex justify-between text-sm font-medium uppercase tracking-[0.18em] text-gray-500">
                    <span>{minLabel}</span>
                    <span>{maxLabel}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6 rounded-[2rem] border border-black/8 bg-white/80 p-6 shadow-[0_24px_60px_rgba(37,33,34,0.08)] backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-gray-600">Paso 2 · Observa el resultado</p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-dark">
                  Lo que un algoritmo podría concluir
                </h2>
              </div>
              <div className={`rounded-[1.4rem] border px-4 py-4 ${
                trafficLight.accent === 'emerald'
                  ? 'border-emerald-200 bg-emerald-50'
                  : trafficLight.accent === 'amber'
                    ? 'border-amber-200 bg-amber-50'
                    : 'border-rose-200 bg-rose-50'
              }`}>
                <p className={`text-xs font-bold uppercase tracking-[0.24em] ${
                  trafficLight.accent === 'emerald'
                    ? 'text-emerald-700'
                    : trafficLight.accent === 'amber'
                      ? 'text-amber-700'
                      : 'text-rose-700'
                }`}>
                    ¿Qué tan predecible eres?
                </p>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex gap-2">
                    <span className={`h-4 w-4 rounded-full border ${
                      trafficLight.active === 'green' ? 'border-emerald-600 bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.45)]' : 'border-emerald-200 bg-white/80'
                    }`}
                    />
                    <span className={`h-4 w-4 rounded-full border ${
                      trafficLight.active === 'yellow' ? 'border-amber-600 bg-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.45)]' : 'border-amber-200 bg-white/80'
                    }`}
                    />
                    <span className={`h-4 w-4 rounded-full border ${
                      trafficLight.active === 'red' ? 'border-rose-700 bg-rose-500 shadow-[0_0_18px_rgba(244,63,94,0.45)]' : 'border-rose-200 bg-white/80'
                    }`}
                    />
                  </div>
                  <div>
                    <p className={`font-display text-3xl ${
                      trafficLight.accent === 'emerald'
                        ? 'text-emerald-900'
                        : trafficLight.accent === 'amber'
                          ? 'text-amber-900'
                          : 'text-rose-900'
                    }`}
                    >
                      {profile.risk}%
                    </p>
                    <p className="text-base font-medium text-gray-800">
                      {trafficLight.label}: {trafficLight.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <FootprintChart controls={controls} signals={signals} weightedSignals={weightedSignals} risk={profile.risk} accent={trafficLight.accent} />

            <div className="grid gap-4 md:grid-cols-2">
              {inferredActions.map((item) => (
                <article
                  key={item.title}
                  className={`relative overflow-hidden rounded-[1.5rem] border p-5 shadow-[0_12px_32px_rgba(37,33,34,0.05)] transition duration-300 ${inferenceToneClass} ${inferenceSurfaceClass}`}
                >
                  <div className={`absolute inset-y-0 left-0 w-2 ${
                    profile.risk < 34
                      ? 'bg-emerald-500'
                      : profile.risk < 67
                        ? 'bg-amber-400'
                        : 'bg-rose-500'
                  }`}
                  />
                  <div className="mb-4 flex items-center justify-between gap-3 pl-2">
                    <p className={`text-xs font-bold uppercase tracking-[0.24em] ${inferenceLabelClass}`}>{item.title}</p>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${inferenceBadgeClass}`}>
                      {trafficLight.label}
                    </span>
                  </div>
                  <p className="pl-2 text-lg leading-relaxed text-gray-800">{item.body}</p>
                </article>
              ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[1.6rem] bg-[#173d39] p-5 text-white">
                <div className="flex items-center gap-3">
                  <FaArrowTrendUp className="text-[#f7d88b]" />
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#f7d88b]">Cadena de inferencia</p>
                </div>
                <ol className="mt-4 space-y-3 text-base leading-relaxed text-white/90">
                  <li>1. Recoge señales pequeñas que parecen inocentes.</li>
                  <li>2. Compara tu conducta con miles de perfiles parecidos.</li>
                  <li>3. Estima qué contenido, horario o mensaje funcionaría mejor contigo.</li>
                  <li>4. Ajusta lo que ves para aumentar permanencia, clics o compras.</li>
                </ol>
              </div>

              <div className="rounded-[1.6rem] border border-amber-200 bg-amber-50 p-5">
                <div className="flex items-center gap-3">
                  <FaShieldHalved className="text-amber-700" />
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-amber-700">Lectura ética</p>
                </div>
                <p className="mt-4 text-base leading-relaxed text-gray-800">
                    Un perfil automatizado no es la verdad sobre una persona. Es una estimación. Puede simplificarte demasiado, equivocarse o reforzar sesgos sin que lo notes.
                </p>
                <p className="mt-4 border-l-4 border-amber-500 pl-4 font-display text-xl leading-snug text-dark">
                    Si un sistema puede inferir tus preferencias, también puede influir en el entorno en el que tomas decisiones.
                </p>
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-rose-200 bg-rose-50 p-5">
              <div className="flex items-center gap-3">
                <FaTriangleExclamation className="text-rose-700" />
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-rose-700">Preguntas para estudiantes</p>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <p className="group rounded-[1.35rem] border border-rose-200/70 bg-white/92 p-4 text-base leading-relaxed text-gray-800 shadow-[0_12px_30px_rgba(148,28,72,0.08)] transition duration-200 hover:-translate-y-1 hover:border-rose-300 hover:shadow-[0_18px_40px_rgba(148,28,72,0.14)]">
                  <span className="mb-3 inline-flex rounded-full bg-rose-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-rose-700">Huella</span>
                  <span className="block text-base font-medium text-dark">¿Qué datos entrego sin darme cuenta cuando uso una app?</span>
                </p>
                <p className="group rounded-[1.35rem] border border-rose-200/70 bg-white/92 p-4 text-base leading-relaxed text-gray-800 shadow-[0_12px_30px_rgba(148,28,72,0.08)] transition duration-200 hover:-translate-y-1 hover:border-rose-300 hover:shadow-[0_18px_40px_rgba(148,28,72,0.14)]">
                  <span className="mb-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-amber-700">Perfil</span>
                  <span className="block text-base font-medium text-dark">¿Qué cree el sistema sobre mí a partir de esas huellas?</span>
                </p>
                <p className="group rounded-[1.35rem] border border-rose-200/70 bg-white/92 p-4 text-base leading-relaxed text-gray-800 shadow-[0_12px_30px_rgba(148,28,72,0.08)] transition duration-200 hover:-translate-y-1 hover:border-rose-300 hover:shadow-[0_18px_40px_rgba(148,28,72,0.14)]">
                  <span className="mb-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">Responsabilidad</span>
                  <span className="block text-base font-medium text-dark">¿Quién debería responder si ese perfil automatizado me clasifica mal?</span>
                </p>
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-center gap-3">
                <FaShieldHalved className="text-emerald-700" />
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-700">Recomendaciones para jóvenes</p>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {youthRecommendations.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-[1.25rem] border border-emerald-200/70 bg-white/92 p-4 shadow-[0_10px_24px_rgba(21,128,61,0.08)]"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">{item.title}</p>
                    <p className="mt-2 text-base leading-relaxed text-gray-800">{item.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  )
}
