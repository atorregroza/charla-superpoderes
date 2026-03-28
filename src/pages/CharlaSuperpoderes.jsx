import { Link } from 'react-router-dom'
import {
  FaArrowTrendUp,
  FaBullseye,
  FaChartSimple,
  FaChevronRight,
  FaEye,
  FaPlay,
} from 'react-icons/fa6'
import { usePageMeta } from '../hooks/usePageMeta'
import { seoConfig } from '../data/seoConfig'

const superpowers = [
  {
    title: 'Ver patrones',
    eyebrow: 'Superpoder 1',
    subtitle: 'Estadística y visualización',
    body: 'Mirar con cuidado antes de resumir.',
    path: '/laboratorio-datos',
    presentationPath: 'https://www.canva.com/design/DAHDwKhNVzI/T3jq97XpPT0xJ2RVV1Izug/view?utm_content=DAHDwKhNVzI&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hf246428196',
    presentationCta: 'Ver presentación',
    cta: 'Explorar patrones',
    icon: FaEye,
    accent: 'from-lime-300 via-emerald-400 to-blue-500',
    iconShell: 'bg-[linear-gradient(135deg,#8bf063_0%,#35c759_55%,#2f6df6_100%)] text-white',
  },
  {
    title: 'Predecir',
    eyebrow: 'Superpoder 2',
    subtitle: 'Datos e inferencias',
    body: 'Entender cómo los datos permiten anticipar.',
    path: '/preferencias-digitales',
    presentationPath: 'https://www.canva.com/design/DAHDwO02pCA/ohyJG5ckRHlbsVKjrCox_w/view?utm_content=DAHDwO02pCA&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hfcb20eec17',
    presentationCta: 'Ver presentación',
    cta: 'Explorar predicción',
    icon: FaArrowTrendUp,
    accent: 'from-lime-300 via-emerald-400 to-blue-500',
    iconShell: 'bg-[linear-gradient(135deg,#8bf063_0%,#35c759_55%,#2f6df6_100%)] text-white',
  },
  {
    title: 'Tomar decisiones',
    eyebrow: 'Superpoder 3',
    subtitle: 'Probabilidad y optimización',
    body: 'Elegir con criterio cuando no sabemos todo.',
    path: '/decisiones-optimizacion',
    presentationPath: 'https://www.canva.com/design/DAHDwGqoSCU/wjqofP6iSwzDmnibRhUe6A/view?utm_content=DAHDwGqoSCU&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h23e0d6372b',
    presentationCta: 'Ver presentación',
    cta: 'Explorar decisiones',
    icon: FaBullseye,
    accent: 'from-lime-300 via-emerald-400 to-blue-500',
    iconShell: 'bg-[linear-gradient(135deg,#8bf063_0%,#35c759_55%,#2f6df6_100%)] text-white',
  },
]

const idmIdeas = [
  'Entender mejor la realidad',
  'Compartir definiciones comunes',
  'Usar los datos con responsabilidad',
  'Buscar estrategias ganar-ganar',
]

export const CharlaSuperpoderes = () => {
  usePageMeta(seoConfig.charlaSuperpoderes)

  const mainPresentationPath = 'https://www.canva.com/design/DAHC5f2QIH0/pk4dmMOweiSsmXms5kLxUA/view?utm_content=DAHC5f2QIH0&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h1c0427c0ac'

  return (
    <div className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7f1f2_0%,#f4ece4_52%,#eee2d5_100%)] text-dark">
      <div className="mx-auto w-full max-w-[108rem] px-4 py-5 sm:px-6 lg:px-8 xl:px-10">
        <section className="relative overflow-hidden rounded-[3rem] border border-white/80 bg-[linear-gradient(140deg,rgba(255,255,255,0.74),rgba(255,248,244,0.88))] px-6 py-7 shadow-[0_34px_90px_rgba(37,33,34,0.11)] sm:px-8 sm:py-9 lg:px-10 xl:px-12">
          <div
            aria-hidden="true"
            className="absolute -right-20 top-8 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(70,185,120,0.18),transparent_68%)]"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-44 w-60 bg-[radial-gradient(circle_at_bottom_left,rgba(31,111,255,0.12),transparent_72%)]"
          />
          <div className="relative z-10">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)] xl:items-start">
              <div className="max-w-[48rem] space-y-5">
                <p className="text-sm font-bold uppercase tracking-[0.34em] text-gray-600">Día Internacional de las Matemáticas 2026</p>
                <div className="inline-flex rounded-full border border-black/8 bg-white/82 px-5 py-2 shadow-[0_12px_24px_rgba(37,33,34,0.06)]">
                  <p className="text-sm font-bold uppercase tracking-[0.32em] text-gray-700">Presentación</p>
                </div>
                <h1
                  aria-label="Los 3 superpoderes de las matemáticas"
                  className="font-display text-[clamp(3.5rem,7vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-[#262123]"
                >
                  Los 3
                  <br />
                  superpoderes
                  <br />
                  de las matemáticas
                </h1>
                <div className="max-w-2xl rounded-[1.6rem] border border-black/8 bg-white/70 px-5 py-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500">Tema del IDM 2026</p>
                  <p className="mt-2 font-display text-[1.8rem] leading-tight text-[#2f2a2c]">
                    Las matemáticas y la esperanza
                  </p>
                </div>
                <p className="max-w-2xl text-[1.22rem] leading-relaxed text-gray-800 sm:text-[1.34rem]">
                  Patrón. Predicción. Decisión.
                </p>
                <a
                  href={mainPresentationPath}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-visible-ring inline-flex items-center gap-3 rounded-full bg-dark px-5 py-3 text-base font-semibold text-white transition duration-200 hover:bg-black"
                >
                  Ver presentación completa
                  <FaPlay className="text-sm" />
                </a>
              </div>

              <div className="grid content-start gap-5 self-stretch">
                <div className="flex min-h-[12rem] items-center justify-center rounded-[2rem] border border-black/8 bg-white/72 px-7 py-6 shadow-[0_18px_38px_rgba(37,33,34,0.08)]">
                  <img
                    src="/logo-maryam-math.png"
                    alt="Logo Maryam Math"
                    className="h-16 w-auto object-contain sm:h-20"
                  />
                </div>

                <div className="flex min-h-[12rem] items-center justify-center rounded-[2rem] border border-black/8 bg-white/75 px-7 py-6 shadow-[0_17px_36px_rgba(37,33,34,0.08)]">
                  <img
                    src="/logo-mail.png"
                    alt="Logo La Olibero"
                    className="h-16 w-auto object-contain sm:h-20"
                  />
                </div>

                <div className="flex min-h-[12rem] items-center justify-center rounded-[2rem] border border-black/8 bg-white/78 px-7 py-6 shadow-[0_16px_34px_rgba(37,33,34,0.08)]">
                  <img
                    src="/logo-astrid.png"
                    alt="Logo Astrid Torregroza"
                    className="h-24 w-auto object-contain sm:h-28"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 space-y-5 rounded-[3rem] border border-black/8 bg-white/76 p-6 shadow-[0_28px_72px_rgba(37,33,34,0.08)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.32em] text-gray-600">Presentación</p>
              <h2 className="mt-2 font-display text-[clamp(2.6rem,4vw,4.6rem)] font-semibold leading-[0.95] text-dark">
                Los 3 superpoderes
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-gray-700 sm:text-lg">
              Patrón. Predicción. Decisión.
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            {superpowers.map(({ title, eyebrow, subtitle, body, path, presentationPath, presentationCta, cta, icon: Icon, accent, iconShell }) => (
              <article
                key={title}
                className="group relative overflow-hidden rounded-[2.2rem] border border-black/8 bg-[#fffaf6] p-6 shadow-[0_20px_52px_rgba(37,33,34,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_58px_rgba(37,33,34,0.12)]"
              >
                <div
                  aria-hidden="true"
                  className={`absolute inset-x-6 top-0 h-1.5 rounded-full bg-gradient-to-r ${accent}`}
                />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500">{eyebrow}</p>
                    <h3 className="mt-3 font-display text-[2.2rem] font-semibold leading-[0.95] text-dark">
                      {title}
                    </h3>
                  </div>
                  <span className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] text-2xl shadow-[0_14px_24px_rgba(37,33,34,0.08)] ${iconShell}`}>
                    <Icon />
                  </span>
                </div>

                <p className="mt-4 text-sm font-bold uppercase tracking-[0.26em] text-gray-600">{subtitle}</p>
                <p className="mt-4 min-h-[4.5rem] text-[1.15rem] leading-relaxed text-gray-800">
                  {body}
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href={presentationPath}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-visible-ring inline-flex items-center gap-3 rounded-full border border-black/10 bg-white px-5 py-3 text-base font-semibold text-dark transition duration-200 hover:border-black/20 hover:bg-white/90"
                  >
                    {presentationCta}
                    <FaChevronRight className="text-sm" />
                  </a>
                  <Link
                    to={path}
                    className="focus-visible-ring inline-flex items-center gap-3 rounded-full bg-dark px-5 py-3 text-base font-semibold text-white transition duration-200 hover:bg-black"
                  >
                    {cta}
                    <FaChevronRight className="text-sm" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2.7rem] border border-black/8 bg-white/76 p-6 shadow-[0_22px_54px_rgba(37,33,34,0.07)] sm:p-7">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-primary/10 text-xl text-primary">
              <FaChartSimple />
            </span>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-gray-600">Matemáticas y esperanza</p>
              <h3 className="mt-1 font-display text-3xl font-semibold text-dark">Cuatro ideas del IDM 2026</h3>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {idmIdeas.map((idea) => (
              <div key={idea} className="rounded-[1.7rem] border border-black/8 bg-[#fffaf6] p-5">
                <p className="text-lg font-medium leading-relaxed text-gray-900">{idea}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
