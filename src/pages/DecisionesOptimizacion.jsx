import { useMemo, useState } from 'react'
import {
  FaArrowTrendUp,
  FaBatteryHalf,
  FaBookOpen,
  FaCalendarCheck,
  FaChartLine,
  FaClock,
  FaCompassDrafting,
  FaDice,
  FaFlask,
  FaLightbulb,
  FaMagnifyingGlass,
  FaPeopleArrows,
  FaRegCircleQuestion,
  FaRoute,
  FaScaleBalanced,
  FaSignal,
  FaTriangleExclamation,
  FaUmbrella,
  FaWallet,
} from 'react-icons/fa6'
import { Container } from '../components/ui/Container'
import { seoConfig } from '../data/seoConfig'
import { usePageMeta } from '../hooks/usePageMeta'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const percent = (value) => Math.round(value * 100)
const roundCount = (value) => Math.round(value)

const scenarios = [
  {
    key: 'dice',
    badge: 'Azar cotidiano',
    title: 'Lanzamiento de dados',
    hook: '¿Qué probabilidad hay de sacar un resultado alto?',
    summary: 'Primero vemos un caso simple de azar para entender mejor cómo leer pistas y decisiones.',
    context: 'Vamos a lanzar un dado y aquí llamaremos resultado alto a sacar 4, 5 o 6.',
    storyLead: 'Vamos a lanzar un dado y queremos decidir si conviene apostar fuerte, apostar poco o no arriesgar casi nada.',
    hypothesis: 'salga un número alto en el dado',
    opposite: 'salga un número bajo en el dado',
    signalSource: 'Lo que pasó en lanzamientos anteriores',
    signalPlain: 'Si en varios lanzamientos recientes salieron 4, 5 o 6, esa es la pista que estamos mirando.',
    moneyRole: 'Aquí el presupuesto representa cuántos recursos quieres poner en una apuesta o en una decisión de juego.',
    timeRole: 'Aquí el tiempo representa cuántas jugadas o intentos puedes hacer antes de decidir.',
    evidencePositive: 'En los últimos lanzamientos aparecieron varios números altos.',
    evidenceNegative: 'En los últimos lanzamientos aparecieron varios números bajos.',
    defaults: {
      priorPercent: 50,
      sensitivityPercent: 70,
      falseAlarmPercent: 20,
      evidencePositive: true,
      budget: 40,
      timeBudget: 40,
    },
    examples: [
      { label: 'Juego parejo', priorPercent: 50, sensitivityPercent: 60, falseAlarmPercent: 20, evidencePositive: true },
      { label: 'Pista fuerte', priorPercent: 50, sensitivityPercent: 85, falseAlarmPercent: 10, evidencePositive: true },
      { label: 'Pista dudosa', priorPercent: 50, sensitivityPercent: 55, falseAlarmPercent: 35, evidencePositive: false },
    ],
    icon: FaDice,
    tint: 'from-[#ffe2c7] via-[#fff4ea] to-[#fffdf9]',
    edge: 'border-[#efbf79]',
    mark: 'bg-[#c77424]',
    options: [
      { key: 'big', title: 'Apuesta grande', successValue: 92, failureValue: 18, cost: 68, time: 18, humanValue: 30 },
      { key: 'medium', title: 'Apuesta moderada', successValue: 72, failureValue: 50, cost: 38, time: 16, humanValue: 72 },
      { key: 'safe', title: 'No arriesgar mucho', successValue: 54, failureValue: 52, cost: 16, time: 10, humanValue: 88 },
    ],
  },
  {
    key: 'umbrella',
    badge: 'Caso cotidiano',
    title: 'Llevar paraguas',
    hook: '¿Qué probabilidad hay de que llueva hoy?',
    summary: 'Un caso cotidiano para decidir si conviene cargar paraguas o salir liviano.',
    context: 'Vas a salir y no sabes si llevar paraguas o no.',
    storyLead: 'Salir con paraguas puede salvarte de mojarte, pero también puede ser incómodo si al final no llueve.',
    hypothesis: 'llueva hoy',
    opposite: 'no llueva hoy',
    signalSource: 'Nubes, app del clima y sensación de humedad',
    signalPlain: 'Si el cielo está oscuro y la app marca lluvia, parece más probable que sí llueva.',
    moneyRole: 'Aquí el presupuesto representa esfuerzo o costo de cargar algo extra y estar preparado.',
    timeRole: 'Aquí el tiempo representa cuánto rato vas a estar fuera y cuánto te afectaría mojarte.',
    evidencePositive: 'El cielo está gris y la app del clima marca lluvia.',
    evidenceNegative: 'El cielo se ve despejado y la app no marca lluvia.',
    defaults: {
      priorPercent: 45,
      sensitivityPercent: 78,
      falseAlarmPercent: 22,
      evidencePositive: true,
      budget: 36,
      timeBudget: 68,
    },
    examples: [
      { label: 'Cielo oscuro', priorPercent: 50, sensitivityPercent: 82, falseAlarmPercent: 18, evidencePositive: true },
      { label: 'Duda normal', priorPercent: 35, sensitivityPercent: 66, falseAlarmPercent: 26, evidencePositive: true },
      { label: 'Pinta despejado', priorPercent: 30, sensitivityPercent: 70, falseAlarmPercent: 18, evidencePositive: false },
    ],
    icon: FaUmbrella,
    tint: 'from-[#dbe7ff] via-[#f3f7ff] to-[#fbfdff]',
    edge: 'border-[#b6c8ef]',
    mark: 'bg-[#5579ba]',
    options: [
      { key: 'large', title: 'Llevar paraguas grande', successValue: 88, failureValue: 34, cost: 44, time: 22, humanValue: 66 },
      { key: 'small', title: 'Llevar paraguas pequeño', successValue: 72, failureValue: 56, cost: 28, time: 16, humanValue: 82 },
      { key: 'none', title: 'Salir sin paraguas', successValue: 46, failureValue: 18, cost: 4, time: 8, humanValue: 30 },
    ],
  },
  {
    key: 'leave-early',
    badge: 'Caso cotidiano',
    title: 'Salir temprano',
    hook: '¿Qué probabilidad hay de que haya trancón?',
    summary: 'Un caso diario para decidir si sales temprano o a la hora de siempre.',
    context: 'Tienes que llegar a tiempo y dudas entre salir temprano o salir como siempre.',
    storyLead: 'Salir temprano da más margen, pero también puede hacerte perder tiempo si el camino está normal.',
    hypothesis: 'haya trancón',
    opposite: 'el camino esté fluido',
    signalSource: 'Tráfico en la app, clima y hora pico',
    signalPlain: 'Si la app marca tráfico y además es hora pico, parece más probable que haya trancón.',
    moneyRole: 'Aquí el presupuesto representa energía, transporte o costo de salir con más margen.',
    timeRole: 'Aquí el tiempo representa cuánto margen real tienes antes de llegar tarde.',
    evidencePositive: 'La app marca tráfico fuerte y ya empezó la hora pico.',
    evidenceNegative: 'La app marca tráfico normal y todavía no empieza la hora pico.',
    defaults: {
      priorPercent: 48,
      sensitivityPercent: 80,
      falseAlarmPercent: 18,
      evidencePositive: true,
      budget: 42,
      timeBudget: 50,
    },
    examples: [
      { label: 'Hora pico fuerte', priorPercent: 60, sensitivityPercent: 84, falseAlarmPercent: 14, evidencePositive: true },
      { label: 'Día tranquilo', priorPercent: 28, sensitivityPercent: 70, falseAlarmPercent: 18, evidencePositive: false },
      { label: 'Datos mezclados', priorPercent: 45, sensitivityPercent: 68, falseAlarmPercent: 30, evidencePositive: true },
    ],
    icon: FaClock,
    tint: 'from-[#ffe4c6] via-[#fff4e9] to-[#fffdfa]',
    edge: 'border-[#efc48d]',
    mark: 'bg-[#c4823f]',
    options: [
      { key: 'early', title: 'Salir bastante temprano', successValue: 90, failureValue: 54, cost: 42, time: 34, humanValue: 78 },
      { key: 'normal', title: 'Salir a la hora de siempre', successValue: 62, failureValue: 30, cost: 18, time: 18, humanValue: 52 },
      { key: 'late', title: 'Salir más tarde', successValue: 28, failureValue: 14, cost: 8, time: 8, humanValue: 18 },
    ],
  },
  {
    key: 'flu',
    badge: 'Caso cotidiano',
    title: 'Síntomas de gripe',
    hook: '¿Qué probabilidad hay de que una persona tenga gripe?',
    summary: 'Un caso cotidiano para pensar cómo una pista cambia lo que creemos al comienzo.',
    context: 'Una persona tiene malestar y queremos pensar si lo más probable es que tenga gripe o solo un resfriado leve.',
    storyLead: 'Hay fiebre, cansancio y tos. La pregunta es si eso alcanza para pensar en gripe o si todavía puede ser algo más suave.',
    hypothesis: 'una persona tenga gripe',
    opposite: 'sea un resfriado leve',
    signalSource: 'Síntomas y una prueba rápida',
    signalPlain: 'Si hay fiebre, dolor de cuerpo y además una prueba rápida positiva, parece más probable que sí sea gripe.',
    moneyRole: 'Aquí el presupuesto representa recursos para actuar: consulta, medicamentos o quedarse en casa.',
    timeRole: 'Aquí el tiempo representa cuántas horas o días hay para reaccionar antes de tomar una decisión.',
    evidencePositive: 'Hay fiebre, dolor de cuerpo y la prueba rápida salió positiva.',
    evidenceNegative: 'Hay molestias leves y la prueba rápida salió negativa.',
    defaults: {
      priorPercent: 25,
      sensitivityPercent: 72,
      falseAlarmPercent: 16,
      evidencePositive: false,
      budget: 52,
      timeBudget: 48,
    },
    examples: [
      { label: 'Síntomas suaves', priorPercent: 25, sensitivityPercent: 72, falseAlarmPercent: 16, evidencePositive: false },
      { label: 'Prueba positiva', priorPercent: 35, sensitivityPercent: 86, falseAlarmPercent: 10, evidencePositive: true },
      { label: 'Señales mezcladas', priorPercent: 45, sensitivityPercent: 68, falseAlarmPercent: 28, evidencePositive: true },
    ],
    icon: FaRegCircleQuestion,
    tint: 'from-[#ffd9d9] via-[#fff1f1] to-[#fffafa]',
    edge: 'border-[#e9a3a3]',
    mark: 'bg-[#bf5b5b]',
    options: [
      { key: 'rest', title: 'Quedarse en casa y descansar', successValue: 84, failureValue: 64, cost: 32, time: 42, humanValue: 88 },
      { key: 'visit', title: 'Buscar atención médica', successValue: 90, failureValue: 58, cost: 62, time: 54, humanValue: 80 },
      { key: 'normal', title: 'Seguir como si nada', successValue: 36, failureValue: 22, cost: 8, time: 10, humanValue: 18 },
    ],
  },
  {
    key: 'battery',
    badge: 'Caso cotidiano',
    title: 'Cargar el celular',
    hook: '¿Qué probabilidad hay de que la batería no te alcance?',
    summary: 'Un caso cotidiano para decidir si cargar ahora o seguir así.',
    context: 'Vas a salir varias horas y dudas si cargar el celular ya o confiar en la batería que queda.',
    storyLead: 'Cargar ahora toma tiempo, pero salir sin batería puede dejarte incomunicado justo cuando más la necesitas.',
    hypothesis: 'la batería no te alcance',
    opposite: 'la batería sí te alcance',
    signalSource: 'Porcentaje de batería, tiempo fuera de casa y uso esperado',
    signalPlain: 'Si la batería está baja y vas a usar mapas, mensajes o música, parece más probable que no te alcance.',
    moneyRole: 'Aquí el presupuesto representa esfuerzo o recursos para cargar ahora: tiempo, enchufe o batería portátil.',
    timeRole: 'Aquí el tiempo representa cuántas horas estarás fuera y cuántas te faltan para poder cargar de nuevo.',
    evidencePositive: 'La batería está baja y vas a estar varias horas fuera usando el celular.',
    evidenceNegative: 'La batería está alta y vas a volver pronto.',
    defaults: {
      priorPercent: 40,
      sensitivityPercent: 76,
      falseAlarmPercent: 20,
      evidencePositive: true,
      budget: 34,
      timeBudget: 62,
    },
    examples: [
      { label: 'Batería crítica', priorPercent: 65, sensitivityPercent: 84, falseAlarmPercent: 12, evidencePositive: true },
      { label: 'Todavía aguanta', priorPercent: 28, sensitivityPercent: 70, falseAlarmPercent: 18, evidencePositive: false },
      { label: 'Uso pesado', priorPercent: 48, sensitivityPercent: 78, falseAlarmPercent: 24, evidencePositive: true },
    ],
    icon: FaBatteryHalf,
    tint: 'from-[#d8f0d8] via-[#f3fbf3] to-[#fbfffb]',
    edge: 'border-[#b7d7b7]',
    mark: 'bg-[#5f9a63]',
    options: [
      { key: 'full', title: 'Cargarlo ahora', successValue: 88, failureValue: 62, cost: 34, time: 28, humanValue: 86 },
      { key: 'short', title: 'Cargarlo un rato', successValue: 70, failureValue: 46, cost: 18, time: 14, humanValue: 68 },
      { key: 'leave', title: 'Salir ya sin cargar', successValue: 40, failureValue: 16, cost: 4, time: 4, humanValue: 24 },
    ],
  },
  {
    key: 'hangout',
    badge: 'Caso cotidiano',
    title: 'Comprar comida para la fiesta',
    hook: '¿Qué probabilidad hay de que sí llegue bastante gente a la fiesta?',
    summary: 'Un caso cotidiano para decidir si compras comida extra o si compras lo justo.',
    context: 'Vas a hacer una fiesta con amigos y no sabes cuánta comida comprar.',
    storyLead: 'Si compras de más, puede sobrar. Si compras de menos, puede faltar justo cuando llegue la gente a la fiesta.',
    hypothesis: 'sí llegue bastante gente',
    opposite: 'llegue poca gente',
    signalSource: 'Mensajes del grupo, confirmaciones y hora de la fiesta',
    signalPlain: 'Si varias personas confirman y siguen activas en el chat, parece más probable que sí llegue bastante gente.',
    moneyRole: 'Aquí el presupuesto representa cuánto dinero tienes para comprar comida y bebida.',
    timeRole: 'Aquí el tiempo representa cuánto margen te queda antes de que empiece la fiesta.',
    evidencePositive: 'Varias personas confirmaron y siguen escribiendo en el grupo.',
    evidenceNegative: 'Poca gente respondió y varios dejaron el mensaje en visto.',
    defaults: {
      priorPercent: 42,
      sensitivityPercent: 80,
      falseAlarmPercent: 24,
      evidencePositive: true,
      budget: 48,
      timeBudget: 44,
    },
    examples: [
      { label: 'Chat activo', priorPercent: 50, sensitivityPercent: 84, falseAlarmPercent: 18, evidencePositive: true },
      { label: 'Duda total', priorPercent: 35, sensitivityPercent: 68, falseAlarmPercent: 28, evidencePositive: false },
      { label: 'Confirmaron pocos', priorPercent: 28, sensitivityPercent: 74, falseAlarmPercent: 16, evidencePositive: false },
    ],
    icon: FaPeopleArrows,
    tint: 'from-[#ffe0cc] via-[#fff3eb] to-[#fffdfa]',
    edge: 'border-[#efc0a1]',
    mark: 'bg-[#c57f45]',
    options: [
      { key: 'extra', title: 'Comprar comida extra', successValue: 88, failureValue: 30, cost: 64, time: 36, humanValue: 68 },
      { key: 'just', title: 'Comprar lo justo', successValue: 74, failureValue: 58, cost: 42, time: 24, humanValue: 82 },
      { key: 'basic', title: 'Comprar lo mínimo', successValue: 48, failureValue: 26, cost: 18, time: 14, humanValue: 34 },
    ],
  },
  {
    key: 'talk',
    badge: 'Caso de charla',
    title: 'Enganche de la charla',
    hook: '¿Qué probabilidad hay de que el público se desconecte?',
    summary: 'Un caso meta para pensar cómo leer al público y ajustar una charla en tiempo real.',
    context: 'Estás dando una charla y quieres anticipar si el grupo se va a aburrir o si sigue conectado con lo que cuentas.',
    storyLead: 'A veces una charla arranca bien y luego pierde al público. La idea no es adivinar, sino leer señales para decidir si conviene cambiar el ritmo.',
    hypothesis: 'el público se desconecte',
    opposite: 'el público siga enganchado',
    signalSource: 'Miradas, participación, gestos y uso del celular',
    signalPlain: 'Si hay pocas respuestas, muchas miradas perdidas y varios celulares arriba, parece más probable que el grupo se esté desconectando.',
    moneyRole: 'Aquí el presupuesto representa los recursos que puedes meter en el momento: material visual, dinámica o ejemplo extra.',
    timeRole: 'Aquí el tiempo representa cuánto margen real te queda para cambiar el ritmo antes de cerrar la charla.',
    evidencePositive: 'Hay poco contacto visual, casi nadie responde y varias personas miran el celular.',
    evidenceNegative: 'Hay preguntas, risas, miradas atentas y varias personas participan.',
    defaults: {
      priorPercent: 38,
      sensitivityPercent: 74,
      falseAlarmPercent: 24,
      evidencePositive: true,
      budget: 46,
      timeBudget: 52,
    },
    examples: [
      { label: 'Grupo frío', priorPercent: 45, sensitivityPercent: 78, falseAlarmPercent: 22, evidencePositive: true },
      { label: 'Se activaron', priorPercent: 28, sensitivityPercent: 70, falseAlarmPercent: 18, evidencePositive: false },
      { label: 'Señales mezcladas', priorPercent: 40, sensitivityPercent: 66, falseAlarmPercent: 30, evidencePositive: true },
    ],
    icon: FaLightbulb,
    tint: 'from-[#fff0cf] via-[#fff8eb] to-[#fffdf7]',
    edge: 'border-[#efc676]',
    mark: 'bg-[#c58c1f]',
    options: [
      { key: 'switch', title: 'Cambiar el ritmo y meter interacción', successValue: 90, failureValue: 60, cost: 38, time: 26, humanValue: 88 },
      { key: 'example', title: 'Seguir, pero con un ejemplo más cercano', successValue: 76, failureValue: 58, cost: 22, time: 18, humanValue: 82 },
      { key: 'same', title: 'Seguir igual', successValue: 34, failureValue: 26, cost: 6, time: 8, humanValue: 20 },
    ],
  },
]

const scenarioOrder = ['umbrella', 'leave-early', 'battery', 'hangout', 'flu', 'dice', 'talk']

const historicalFrames = [
  {
    title: 'Azar y probabilidad',
    contribution: 'Nos ayudan a pensar cómo cambia una predicción cuando aparece nueva información.',
    people: [
      { name: 'Blaise Pascal', nationality: '🇫🇷 Francia', years: '1623-1662' },
      { name: 'Pierre de Fermat', nationality: '🇫🇷 Francia', years: '1601-1665' },
      { name: 'Jakob Bernoulli', nationality: '🇨🇭 Suiza', years: '1655-1705' },
      { name: 'Pierre-Simon Laplace', nationality: '🇫🇷 Francia', years: '1749-1827' },
    ],
    icon: FaChartLine,
    accent: 'bg-[#fff0dd] text-[#a65c19]',
  },
  {
    title: 'Restricciones y optimización',
    contribution: 'Nos ayudan a elegir una opción cuando el tiempo y los recursos no alcanzan para todo.',
    people: [
      { name: 'George Dantzig', nationality: '🇺🇸 Estados Unidos', years: '1914-2005' },
      { name: 'Leonid Kantorovich', nationality: '🇷🇺 Imperio ruso / URSS', years: '1912-1986' },
    ],
    icon: FaCompassDrafting,
    accent: 'bg-[#e7f0ff] text-[#356fba]',
  },
]

const mathSteps = [
  {
    title: '1. Empezamos con una creencia inicial',
    text: 'Empezamos con una idea inicial sobre lo que podría pasar.',
    icon: FaLightbulb,
  },
  {
    title: '2. Miramos una evidencia imperfecta',
    text: 'Luego miramos una pista. Esa pista ayuda, pero no siempre acierta.',
    icon: FaMagnifyingGlass,
  },
  {
    title: '3. Actualizamos la probabilidad',
    text: 'Combinamos la idea inicial con la pista para obtener una mejor predicción.',
    icon: FaChartLine,
  },
  {
    title: '4. Comparamos decisiones',
    text: 'Con esa predicción comparamos opciones y elegimos la que más conviene.',
    icon: FaScaleBalanced,
  },
]

const talkFlow = [
  {
    step: 'Paso 1',
    title: 'Elegir un caso',
    text: 'Partimos de una historia cotidiana y de una pregunta concreta.',
    icon: FaRoute,
    accent: 'bg-[#fff1dd] text-[#b36c42]',
    targetId: 'casos',
  },
  {
    step: 'Paso 2',
    title: 'Leer la pista',
    text: 'Vemos qué dato nuevo apareció y qué tan confiable suele ser.',
    icon: FaMagnifyingGlass,
    accent: 'bg-[#eef4ff] text-[#5579ba]',
    targetId: 'entender-caso',
  },
  {
    step: 'Paso 3',
    title: 'Actualizar la idea',
    text: 'Juntamos lo que pensábamos antes con la pista del caso.',
    icon: FaChartLine,
    accent: 'bg-[#fff4e8] text-[#c77424]',
    targetId: 'prediccion',
  },
  {
    step: 'Paso 4',
    title: 'Tomar una decisión',
    text: 'Comparamos opciones con recursos, tiempo y criterio.',
    icon: FaScaleBalanced,
    accent: 'bg-[#edf8ee] text-[#4d8756]',
    targetId: 'decision',
  },
]

const scenarioWalkthrough = (scenario, { priorPercent, signalQuality, evidencePositive, posteriorPercent }) => [
  {
    title: 'Qué está pasando',
    text: scenario.context,
    icon: FaBookOpen,
  },
  {
    title: 'Qué queremos anticipar',
    text: `Queremos saber si ${scenario.hypothesis} o si será más probable que ${scenario.opposite}.`,
    icon: FaRegCircleQuestion,
  },
  {
    title: 'Qué pista estamos usando',
    text: `${scenario.signalSource}. En este momento la pista es ${evidencePositive ? 'positiva' : 'negativa'}: ${evidencePositive ? scenario.evidencePositive : scenario.evidenceNegative}`,
    icon: FaSignal,
  },
  {
    title: 'Cómo leer los números',
    text: `La idea inicial es ${priorPercent}%. La calidad de la pista es ${signalQuality}%. Con eso, la nueva predicción queda en ${posteriorPercent}%.`,
    icon: FaChartLine,
  },
]

const clayExplanations = (scenario, { priorPercent, sensitivityPercent, falseAlarmPercent, posteriorPercent, evidencePositive }) => [
  {
    title: '1. Antes de mirar la pista',
    text: scenario.key === 'flu'
      ? `Antes de mirar síntomas o prueba, podríamos pensar: 'tal vez sí es gripe, pero todavía no estoy seguro'. Por eso arrancamos en ${priorPercent}%.`
      : scenario.key === 'umbrella'
        ? `Antes de mirar el cielo o la app del clima, hacemos una primera apuesta sobre si podría llover hoy. Por eso arrancamos en ${priorPercent}%.`
        : scenario.key === 'leave-early'
          ? `Antes de mirar el tráfico y la hora pico, hacemos una primera apuesta sobre si podría haber trancón. Por eso arrancamos en ${priorPercent}%.`
          : scenario.key === 'battery'
            ? `Antes de mirar la batería y las horas fuera de casa, hacemos una primera apuesta sobre si el celular podría no alcanzarte. Por eso arrancamos en ${priorPercent}%.`
            : scenario.key === 'talk'
              ? `Antes de mirar caras, preguntas o celulares, hacemos una primera apuesta sobre si el grupo podría desconectarse. Por eso arrancamos en ${priorPercent}%.`
              : scenario.key === 'hangout'
                ? `Antes de mirar el grupo y las confirmaciones, hacemos una primera apuesta sobre si sí podría llegar bastante gente. Por eso arrancamos en ${priorPercent}%.`
                : `Antes de mirar los lanzamientos anteriores, hacemos una primera apuesta sobre si podría salir un número alto. Por eso arrancamos en ${priorPercent}%.`,
    icon: FaLightbulb,
  },
  {
    title: '2. Miramos una pista del caso',
    text: scenario.key === 'flu'
      ? `Ahora miramos lo que está pasando: síntomas y prueba rápida. En este caso, la pista salió ${evidencePositive ? 'a favor de que sí sea gripe' : 'más bien en contra de que sea gripe'}.`
      : scenario.key === 'umbrella'
        ? `Ahora miramos el cielo, la humedad y la app del clima. En este caso, la pista salió ${evidencePositive ? 'a favor de que sí llueva' : 'más bien en contra de eso'}.`
        : scenario.key === 'leave-early'
          ? `Ahora miramos el tráfico, el clima y la hora pico. En este caso, la pista salió ${evidencePositive ? 'a favor de que sí haya trancón' : 'más bien en contra de eso'}.`
          : scenario.key === 'battery'
            ? `Ahora miramos la batería, las horas fuera de casa y el uso esperado. En este caso, la pista salió ${evidencePositive ? 'a favor de que la batería no alcance' : 'más bien en contra de eso'}.`
            : scenario.key === 'talk'
              ? `Ahora miramos lo que hace el público: caras, participación y celulares. En este caso, la señal salió ${evidencePositive ? 'a favor de pensar que el grupo se está desconectando' : 'más bien en contra de eso'}.`
              : scenario.key === 'hangout'
                ? `Ahora miramos el chat, las confirmaciones y la hora. En este caso, la pista salió ${evidencePositive ? 'a favor de que sí llegue bastante gente' : 'más bien en contra de eso'}.`
                : `Ahora miramos los lanzamientos anteriores. Si hace poco salieron varios 4, 5 o 6, la pista queda ${evidencePositive ? 'a favor de pensar en un número alto' : 'más bien en contra de eso'}.`,
    icon: FaMagnifyingGlass,
  },
  {
    title: '3. Revisamos si esa pista suele acertar',
    text: scenario.key === 'flu'
      ? `El ${sensitivityPercent}% quiere decir esto: si una persona de verdad tiene gripe, estas señales la apuntan bien ${sensitivityPercent} de cada 100 veces.`
      : scenario.key === 'umbrella'
        ? `El ${sensitivityPercent}% quiere decir esto: si de verdad iba a llover, estas señales lo mostrarían bien ${sensitivityPercent} de cada 100 veces.`
        : scenario.key === 'leave-early'
          ? `El ${sensitivityPercent}% quiere decir esto: si de verdad sí iba a haber trancón, estas señales lo mostrarían bien ${sensitivityPercent} de cada 100 veces.`
          : scenario.key === 'battery'
            ? `El ${sensitivityPercent}% quiere decir esto: si de verdad la batería no iba a alcanzar, estas señales lo mostrarían bien ${sensitivityPercent} de cada 100 veces.`
            : scenario.key === 'talk'
              ? `El ${sensitivityPercent}% quiere decir esto: si de verdad el grupo se estaba desconectando, estas señales del público lo mostrarían bien ${sensitivityPercent} de cada 100 veces.`
              : scenario.key === 'hangout'
                ? `El ${sensitivityPercent}% quiere decir esto: si de verdad sí iba a llegar bastante gente, las confirmaciones lo mostrarían bien ${sensitivityPercent} de cada 100 veces.`
                : `El ${sensitivityPercent}% quiere decir esto: si de verdad iba a salir 4, 5 o 6, mirar los lanzamientos anteriores apuntaría bien en esa dirección ${sensitivityPercent} de cada 100 veces.`,
    icon: FaSignal,
  },
  {
    title: '4. Revisamos cuánto puede engañar',
    text: scenario.key === 'flu'
      ? `El ${falseAlarmPercent}% muestra cuántas veces estas señales podrían parecer de gripe, aunque en realidad solo fuera un resfriado leve.`
      : scenario.key === 'umbrella'
        ? `El ${falseAlarmPercent}% muestra cuántas veces el cielo o la app podrían hacerte pensar que va a llover, aunque al final no llueva.`
        : scenario.key === 'leave-early'
          ? `El ${falseAlarmPercent}% muestra cuántas veces el tráfico o la hora pico podrían asustarte, aunque al final no haya trancón.`
          : scenario.key === 'battery'
            ? `El ${falseAlarmPercent}% muestra cuántas veces podrías pensar que la batería no alcanza, aunque al final sí te hubiera alcanzado.`
            : scenario.key === 'talk'
              ? `El ${falseAlarmPercent}% muestra cuántas veces el grupo podría verse distraído por un rato, aunque en realidad todavía siga enganchado con la charla.`
              : scenario.key === 'hangout'
                ? `El ${falseAlarmPercent}% muestra cuántas veces el grupo podría sonar animado, aunque al final no llegue tanta gente.`
                : `El ${falseAlarmPercent}% muestra cuántas veces los lanzamientos anteriores podrían ilusionarnos con un 4, 5 o 6, aunque al final salga un número bajo.`,
    icon: FaTriangleExclamation,
  },
  {
    title: '5. Juntamos todo',
    text: scenario.key === 'flu'
      ? `Entonces juntamos la primera idea con los síntomas y la prueba. Por eso aparece el ${posteriorPercent}%. Ese número resume qué tan probable parece ahora que sí sea gripe.`
      : scenario.key === 'umbrella'
        ? `Entonces juntamos la primera idea con el cielo, la humedad y la app del clima. Por eso aparece el ${posteriorPercent}%. Ese número resume qué tan probable parece ahora que sí llueva.`
        : scenario.key === 'leave-early'
          ? `Entonces juntamos la primera idea con el tráfico y la hora pico. Por eso aparece el ${posteriorPercent}%. Ese número resume qué tan probable parece ahora que sí haya trancón.`
          : scenario.key === 'battery'
            ? `Entonces juntamos la primera idea con la batería y las horas fuera de casa. Por eso aparece el ${posteriorPercent}%. Ese número resume qué tan probable parece ahora que la batería no te alcance.`
            : scenario.key === 'talk'
              ? `Entonces juntamos la primera idea con lo que muestra el público. Por eso aparece el ${posteriorPercent}%. Ese número resume qué tan probable parece ahora que el grupo se esté desconectando.`
              : scenario.key === 'hangout'
                ? `Entonces juntamos la primera idea con lo que vimos en el chat. Por eso aparece el ${posteriorPercent}%. Ese número resume qué tan probable parece ahora que sí llegue bastante gente.`
                : `Entonces juntamos la primera idea con lo que vimos en los lanzamientos. Por eso aparece el ${posteriorPercent}%. Ese número resume qué tan probable parece ahora sacar 4, 5 o 6.`,
    icon: FaPeopleArrows,
  },
]

const frequencyExample = ({ scenarioKey, priorPercent, sensitivityPercent, falseAlarmPercent, evidencePositive }) => {
  const total = 100
  const hypothesisCases = priorPercent
  const oppositeCases = total - hypothesisCases

  if (evidencePositive) {
    const trueSignals = roundCount((hypothesisCases * sensitivityPercent) / 100)
    const falseSignals = roundCount((oppositeCases * falseAlarmPercent) / 100)
    const totalSignals = trueSignals + falseSignals

    return {
      intro: 'Imagina 100 casos parecidos a este.',
      line1: scenarioKey === 'dice'
        ? `${hypothesisCases} de esos 100 serían casos donde terminaría saliendo 4, 5 o 6.`
        : `${hypothesisCases} de esos 100 serían casos donde sí ocurre lo que queremos saber.`,
      line2: scenarioKey === 'dice'
        ? `Como la pista acierta ${sensitivityPercent}%, marcaría “sí” en unos ${trueSignals} de esos ${hypothesisCases} casos de 4, 5 o 6.`
        : `Como la pista acierta ${sensitivityPercent}%, marcaría “sí” en unos ${trueSignals} de esos ${hypothesisCases}.`,
      line3: `Pero también puede engañar: en los otros ${oppositeCases}, marcaría “sí” en unos ${falseSignals}.`,
      line4: `Entonces, cuando vemos una pista positiva, estamos mirando ${totalSignals} casos parecidos: ${trueSignals} buenos y ${falseSignals} engañosos.`,
    }
  }

  const missedSignals = roundCount((hypothesisCases * (100 - sensitivityPercent)) / 100)
  const correctNegatives = roundCount((oppositeCases * (100 - falseAlarmPercent)) / 100)
  const totalSignals = missedSignals + correctNegatives

  return {
    intro: 'Imagina 100 casos parecidos a este.',
    line1: scenarioKey === 'dice'
      ? `${hypothesisCases} de esos 100 serían casos donde terminaría saliendo 4, 5 o 6.`
      : `${hypothesisCases} de esos 100 serían casos donde sí ocurre lo que queremos saber.`,
    line2: scenarioKey === 'dice'
      ? `Como la pista no siempre acierta, saldría “no” en unos ${missedSignals} de esos ${hypothesisCases} casos de 4, 5 o 6.`
      : `Como la pista no siempre acierta, saldría “no” en unos ${missedSignals} de esos ${hypothesisCases}.`,
    line3: `En los otros ${oppositeCases}, la pista saldría “no” en unos ${correctNegatives}.`,
    line4: `Entonces, cuando vemos una pista negativa, estamos mirando ${totalSignals} casos parecidos: ${missedSignals} donde la pista falló y ${correctNegatives} donde sí ayudó.`,
  }
}

const decisionExplanation = (scenario, { budget, timeBudget }) => {
  if (scenario.key === 'dice') {
    return {
      title: 'Cómo decide la app en este juego',
      text: `Aquí el ${budget} representa cuánto quieres arriesgar y el ${timeBudget} cuántos intentos o tiempo de juego tienes. La app compara si conviene arriesgar mucho, poco o casi nada.`,
    }
  }

  if (scenario.key === 'flu') {
    return {
      title: 'Cómo decide la app en este caso de gripe',
      text: `Aquí el ${budget} representa recursos disponibles y el ${timeBudget} representa margen de tiempo para actuar. La app compara qué respuesta parece más prudente y además cabe dentro de esos límites. Es un ejemplo educativo, no una recomendación médica real.`,
    }
  }

  if (scenario.key === 'umbrella') {
    return {
      title: 'Cómo decide la app en este día de lluvia',
      text: `Aquí el ${budget} representa lo incómodo o costoso que te resulta cargar algo extra, y el ${timeBudget} cuánto tiempo estarás fuera. La app compara si conviene ir más preparado o salir liviano.`,
    }
  }

  if (scenario.key === 'leave-early') {
    return {
      title: 'Cómo decide la app en este trayecto',
      text: `Aquí el ${budget} representa el costo o esfuerzo de salir con más margen, y el ${timeBudget} el tiempo real que tienes antes de llegar tarde. La app compara qué opción te deja más cubierto.`,
    }
  }

  if (scenario.key === 'battery') {
    return {
      title: 'Cómo decide la app con esta batería',
      text: `Aquí el ${budget} representa el esfuerzo de cargar ahora y el ${timeBudget} cuántas horas estarás fuera. La app compara si conviene asegurar batería o asumir el riesgo.`,
    }
  }

  if (scenario.key === 'talk') {
    return {
      title: 'Cómo decide la app en esta charla',
      text: `Aquí el ${budget} representa los recursos que aún puedes meter en el momento y el ${timeBudget} cuánto margen te queda para cambiar el ritmo. La app compara si conviene meter interacción, acercar el ejemplo o seguir igual.`,
    }
  }

  if (scenario.key === 'hangout') {
    return {
      title: 'Cómo decide la app en esta fiesta',
      text: `Aquí el ${budget} representa cuánto dinero tienes para comprar comida y el ${timeBudget} cuánto margen te queda antes de que llegue la gente. La app compara si conviene comprar de más, comprar lo justo o irse por lo mínimo para la fiesta.`,
    }
  }

  return {
    title: 'Cómo decide la app en este caso',
    text: 'La app compara qué opción puede salir mejor y además cabe dentro del presupuesto y del tiempo que tienes disponibles.',
  }
}

const optionFitLabel = ({ option, budget, timeBudget }) => {
  const fitsBudget = option.cost <= budget
  const fitsTime = option.time <= timeBudget

  if (fitsBudget && fitsTime) {
    return 'Sí cabe con los recursos actuales.'
  }

  if (!fitsBudget && !fitsTime) {
    return 'Pide más presupuesto y más tiempo del que hay.'
  }

  if (!fitsBudget) {
    return 'Choca con el presupuesto actual.'
  }

  return 'Choca con el tiempo disponible.'
}

const optionCaseCopy = (scenario, option) => {
  if (scenario.key === 'dice') {
    return `Pide ${option.cost} de riesgo y ${option.time} intentos para jugar esta opción.`
  }

  if (scenario.key === 'umbrella') {
    return `Pide ${option.cost} de preparación y ${option.time} de exposición al clima para esta salida.`
  }

  if (scenario.key === 'leave-early') {
    return `Pide ${option.cost} de esfuerzo para salir antes y ${option.time} de margen de tiempo.`
  }

  if (scenario.key === 'battery') {
    return `Pide ${option.cost} de recursos para cargar y ${option.time} de tiempo antes de salir.`
  }

  if (scenario.key === 'hangout') {
    return `Pide ${option.cost} de compra y ${option.time} de organización antes de la fiesta.`
  }

  if (scenario.key === 'flu') {
    return `Pide ${option.cost} de recursos para actuar y ${option.time} de margen para responder a tiempo.`
  }

  if (scenario.key === 'talk') {
    return `Pide ${option.cost} de recursos para mover la charla y ${option.time} de tiempo para cambiar el ritmo.`
  }

  return `Pide ${option.cost} de presupuesto y ${option.time} de tiempo.`
}

const resourceLabels = (scenario) => {
  if (scenario.key === 'dice') {
    return {
      budget: 'Aquí representa cuánto te animas a arriesgar en el juego.',
      time: 'Aquí representa cuántos intentos o jugadas tienes antes de decidir.',
    }
  }

  if (scenario.key === 'flu') {
    return {
      budget: 'Aquí representa los recursos para actuar: consulta, medicinas o quedarse en casa.',
      time: 'Aquí representa el margen de tiempo para reaccionar y decidir qué hacer.',
    }
  }

  if (scenario.key === 'hangout') {
    return {
      budget: 'Aquí representa cuánto dinero tienes para comprar comida y bebida para la fiesta.',
      time: 'Aquí representa cuánto tiempo te queda antes de que empiece la fiesta.',
    }
  }

  if (scenario.key === 'umbrella') {
    return {
      budget: 'Aquí representa lo molesto que te resulta cargar paraguas o ir más preparado.',
      time: 'Aquí representa cuánto tiempo vas a estar fuera y cuánto te afectaría mojarte.',
    }
  }

  if (scenario.key === 'leave-early') {
    return {
      budget: 'Aquí representa el costo o esfuerzo de salir antes de lo normal.',
      time: 'Aquí representa el margen real que tienes antes de llegar tarde.',
    }
  }

  if (scenario.key === 'battery') {
    return {
      budget: 'Aquí representa el esfuerzo, enchufe o batería portátil disponible para cargar ahora.',
      time: 'Aquí representa cuántas horas estarás fuera antes de poder cargar de nuevo.',
    }
  }

  if (scenario.key === 'talk') {
    return {
      budget: 'Aquí representa los recursos que todavía puedes usar: una dinámica, una imagen, una pregunta o un ejemplo nuevo.',
      time: 'Aquí representa cuánto tiempo de charla te queda para ajustar el ritmo antes de cerrar.',
    }
  }

  return {
    budget: 'Aquí representa los recursos que tienes disponibles para este caso.',
    time: 'Aquí representa el tiempo real con el que cuentas antes de decidir.',
  }
}

const resourceScaleExplanation = (scenario, { budget, timeBudget }) => {
  if (scenario.key === 'dice') {
    return {
      title: `Cómo leer ${budget} y ${timeBudget} en este juego`,
      lines: [
        `El ${budget} no es plata real: aquí muestra qué tanto te animas a arriesgar en la apuesta.`,
        `El ${timeBudget} marca cuántos intentos o jugadas tienes antes de decidir si conviene arriesgar más o menos.`,
        'Si una opción pide más riesgo o más jugadas de las que quieres poner, su puntaje baja.',
      ],
    }
  }

  if (scenario.key === 'umbrella') {
    return {
      title: `Cómo leer ${budget} y ${timeBudget} en este caso`,
      lines: [
        `El ${budget} resume qué tan dispuesto estás a cargar algo extra o a prepararte de más.`,
        `El ${timeBudget} resume cuánto rato vas a estar fuera y cuánto te afectaría mojarte si llueve.`,
        'Si una opción te exige más preparación o más tiempo del que toleras, su puntaje baja.',
      ],
    }
  }

  if (scenario.key === 'leave-early') {
    return {
      title: `Cómo leer ${budget} y ${timeBudget} en este trayecto`,
      lines: [
        `El ${budget} resume el esfuerzo o costo de salir con más margen de tiempo.`,
        `El ${timeBudget} muestra cuánto margen real tienes antes de arriesgarte a llegar tarde.`,
        'Si una opción te pide más esfuerzo o más margen del que tienes, la app la castiga.',
      ],
    }
  }

  if (scenario.key === 'battery') {
    return {
      title: `Cómo leer ${budget} y ${timeBudget} en este caso`,
      lines: [
        `El ${budget} resume si tienes enchufe, batería portátil o ganas de esperar a que cargue.`,
        `El ${timeBudget} muestra cuántas horas vas a estar fuera antes de poder volver a cargar.`,
        'Si una opción necesita más recursos o más tiempo del que tienes, su puntaje baja.',
      ],
    }
  }

  if (scenario.key === 'hangout') {
    return {
      title: `Cómo leer ${budget} y ${timeBudget} para la fiesta`,
      lines: [
        `El ${budget} resume cuánto dinero tienes para comprar comida y bebida.`,
        `El ${timeBudget} muestra cuánto tiempo te queda antes de que llegue la gente a la fiesta.`,
        'Si una opción pide más compra o más tiempo del que te queda, la app la castiga.',
      ],
    }
  }

  if (scenario.key === 'flu') {
    return {
      title: `Cómo leer ${budget} y ${timeBudget} en este caso`,
      lines: [
        `El ${budget} resume los recursos que tienes para actuar: consulta, medicinas o quedarte en casa.`,
        `El ${timeBudget} muestra cuánto margen de horas o días tienes para reaccionar.`,
        'Si una opción exige más recursos o más tiempo de respuesta del que tienes, su puntaje baja.',
      ],
    }
  }

  if (scenario.key === 'talk') {
    return {
      title: `Cómo leer ${budget} y ${timeBudget} en la charla`,
      lines: [
        `El ${budget} resume qué tantos recursos te quedan para mover la charla: una dinámica, una imagen o un ejemplo nuevo.`,
        `El ${timeBudget} muestra cuánto tiempo de exposición te queda para cambiar el ritmo.`,
        'Si una opción pide más recursos o más tiempo del que tienes, la app la castiga.',
      ],
    }
  }

  return {
    title: `Cómo leer ${budget} y ${timeBudget}`,
    lines: [
      'Estos números resumen recursos y tiempo disponibles para comparar opciones.',
      'Si una opción pide más de lo que tienes, la app baja su puntaje.',
      'Si una opción cabe mejor dentro de esos límites, su puntaje sube.',
    ],
  }
}

const posteriorExplanation = ({ priorPercent, sensitivityPercent, falseAlarmPercent, posteriorPercent, evidencePositive }) => {
  if (evidencePositive) {
    return `Sale de mezclar tres números: la primera apuesta (${priorPercent}%), cuánto acierta la pista (${sensitivityPercent}%) y cuánto engaña (${falseAlarmPercent}%). Con esa cuenta, la predicción sube o baja hasta ${posteriorPercent}%.`
  }

  return `Sale de mezclar la primera apuesta (${priorPercent}%), cuánto acierta la pista (${sensitivityPercent}%) y cuánto engaña (${falseAlarmPercent}%) cuando la pista no ayuda. Con esa cuenta, la predicción cambia hasta ${posteriorPercent}%.`
}

const bayesLabels = (scenario, evidencePositive) => {
  const observedEvidence = evidencePositive ? scenario.evidencePositive : scenario.evidenceNegative
  const evidenceLead = evidencePositive ? 'vemos esto' : 'vemos más bien esto'

  return {
    hypothesis: `H = ${scenario.hypothesis}.`,
    evidence: `E = ${observedEvidence}`,
    posterior: `P(H|E) = probabilidad de que ${scenario.hypothesis} dado que ${evidenceLead}: ${observedEvidence}`,
    prior: `P(H) = probabilidad inicial de que ${scenario.hypothesis}.`,
    likelihood: `P(E|H) = probabilidad de ver esto: ${observedEvidence} si en verdad ${scenario.hypothesis}.`,
    falseAlarm: `P(E|no H) = probabilidad de ver esto: ${observedEvidence} aunque en realidad ${scenario.opposite}.`,
  }
}

const bayesPosterior = ({ prior, sensitivity, falseAlarm, evidencePositive }) => {
  const pH = prior
  const pNotH = 1 - prior

  if (evidencePositive) {
    const numerator = sensitivity * pH
    const denominator = numerator + (falseAlarm * pNotH)
    return denominator === 0 ? 0 : numerator / denominator
  }

  const numerator = (1 - sensitivity) * pH
  const denominator = numerator + ((1 - falseAlarm) * pNotH)
  return denominator === 0 ? 0 : numerator / denominator
}

const expectedValue = ({ posterior, successValue, failureValue }) => (
  (posterior * successValue) + ((1 - posterior) * failureValue)
)

const feasibilityScore = ({ option, budget, timeBudget }) => {
  const budgetGap = Math.max(option.cost - budget, 0)
  const timeGap = Math.max(option.time - timeBudget, 0)
  return clamp(Math.round(100 - (budgetGap * 1.7) - (timeGap * 1.15)), 5, 100)
}

const formulaTokens = [
  'P(H)',
  'P(E|H)',
  'P(E|no H)',
  'P(H|E)',
]

const IconBadge = ({ icon: Icon, tone, className = '' }) => (
  <span className={`relative inline-flex h-11 w-11 items-center justify-center rounded-2xl ${tone} ${className}`}>
    <span className="absolute inset-[3px] rounded-[1rem] bg-white/45" />
    <Icon className="relative z-10 text-lg" />
  </span>
)

const SliderCard = ({ icon: Icon, title, value, accent, hint, children }) => (
  <article className="rounded-[1.5rem] border border-black/8 bg-white/88 p-4 shadow-[0_16px_38px_rgba(36,27,21,0.07)]">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <IconBadge icon={Icon} tone={accent} />
        <div>
          <p className="font-display text-[1.35rem] font-semibold text-[#382d2a]">{title}</p>
          <p className="text-sm uppercase tracking-[0.16em] text-[#6a4f43]">{hint}</p>
        </div>
      </div>
      <span className="font-display text-[2.25rem] font-semibold text-[#382d2a]">{value}</span>
    </div>
    <div className="mt-4">{children}</div>
  </article>
)

const MeterCard = ({ label, value, tone }) => (
  <article className="rounded-[1.4rem] border border-white/65 bg-white/86 p-4 shadow-[0_12px_26px_rgba(36,27,21,0.05)]">
    <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#6a4f43]">{label}</p>
    <p className="mt-2 font-display text-[2.85rem] font-semibold text-[#382d2a]">{value}%</p>
    <div className="mt-3 h-2.5 rounded-full bg-[#eadfd7]">
      <div className={`h-2.5 rounded-full ${tone}`} style={{ width: `${value}%` }} />
    </div>
  </article>
)

const OptionCard = ({ scenario, option, highlighted, budget, timeBudget }) => (
  <article
    className={`rounded-[1.7rem] border p-5 transition ${
      highlighted
        ? 'border-[#c77424] bg-[linear-gradient(145deg,#fffaf3_0%,#ffefdb_100%)] shadow-[0_24px_48px_rgba(199,116,36,0.14)]'
        : 'border-black/8 bg-white/88 shadow-[0_16px_34px_rgba(36,27,21,0.06)]'
    }`}
  >
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2">
        {highlighted ? (
          <span className="inline-flex rounded-full bg-[#c77424] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
            Mejor opción
          </span>
        ) : null}
        <h3 className="font-display text-2xl font-semibold text-[#382d2a]">{option.title}</h3>
      </div>
      <div className="min-w-[6rem] rounded-[1.15rem] bg-[#2d4b61] px-4 py-3 text-center text-white">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/82">Puntaje</p>
        <p className="mt-2 font-display text-4xl font-semibold">{option.score}</p>
      </div>
    </div>

    <div className="mt-4 rounded-[1rem] bg-[#f8f1ea] px-4 py-3 text-base leading-relaxed text-[#483a34]">
      <p>{optionCaseCopy(scenario, option)}</p>
      <p className="mt-1 font-semibold text-[#3f322e]">{optionFitLabel({ option, budget, timeBudget })}</p>
    </div>

    <div className="mt-5 grid gap-3 md:grid-cols-4">
      <MeterCard label="Valor esperado" value={option.expectedRounded} tone="bg-[#c77424]" />
      <MeterCard label="Factibilidad" value={option.feasibility} tone="bg-[#356fba]" />
      <MeterCard label="Criterio humano" value={option.humanValue} tone="bg-[#4d8756]" />
      <MeterCard label="Costo" value={option.cost} tone="bg-[#6a5951]" />
    </div>
  </article>
)

export const DecisionesOptimizacion = () => {
  usePageMeta(seoConfig.decisionesOptimizacion)

  const [scenarioKey, setScenarioKey] = useState(scenarioOrder[0])
  const [showPrediction, setShowPrediction] = useState(false)
  const [evidencePositive, setEvidencePositive] = useState(true)
  const [priorPercent, setPriorPercent] = useState(50)
  const [sensitivityPercent, setSensitivityPercent] = useState(70)
  const [falseAlarmPercent, setFalseAlarmPercent] = useState(20)
  const [budget, setBudget] = useState(40)
  const [timeBudget, setTimeBudget] = useState(40)

  const scenario = useMemo(
    () => scenarios.find((item) => item.key === scenarioKey) ?? scenarios[0],
    [scenarioKey],
  )
  const orderedScenarios = useMemo(
    () => scenarioOrder
      .map((key) => scenarios.find((item) => item.key === key))
      .filter(Boolean),
    [],
  )

  const applyScenarioDefaults = (nextScenario) => {
    setShowPrediction(false)
    setPriorPercent(nextScenario.defaults.priorPercent)
    setSensitivityPercent(nextScenario.defaults.sensitivityPercent)
    setFalseAlarmPercent(nextScenario.defaults.falseAlarmPercent)
    setEvidencePositive(nextScenario.defaults.evidencePositive)
    setBudget(nextScenario.defaults.budget)
    setTimeBudget(nextScenario.defaults.timeBudget)
  }

  const prior = priorPercent / 100
  const sensitivity = sensitivityPercent / 100
  const falseAlarm = falseAlarmPercent / 100

  const posterior = useMemo(
    () => bayesPosterior({ prior, sensitivity, falseAlarm, evidencePositive }),
    [evidencePositive, falseAlarm, prior, sensitivity],
  )

  const signalQuality = clamp(sensitivityPercent - falseAlarmPercent, 0, 100)
  const posteriorPercent = percent(posterior)
  const walkthroughCards = scenarioWalkthrough(scenario, {
    priorPercent,
    signalQuality,
    evidencePositive,
    posteriorPercent,
  })
  const clayCards = clayExplanations(scenario, {
    priorPercent,
    sensitivityPercent,
    falseAlarmPercent,
    posteriorPercent,
    evidencePositive,
  })
  const example = frequencyExample({
    scenarioKey,
    priorPercent,
    sensitivityPercent,
    falseAlarmPercent,
    evidencePositive,
  })

  const decisionOptions = useMemo(
    () => scenario.options.map((option) => {
      const expected = expectedValue({
        posterior,
        successValue: option.successValue,
        failureValue: option.failureValue,
      })
      const feasibility = feasibilityScore({ option, budget, timeBudget })
      const score = Math.round((expected * 0.55) + (feasibility * 0.25) + (option.humanValue * 0.2))

      return {
        ...option,
        expectedRounded: Math.round(expected),
        feasibility,
        score,
      }
    }).sort((left, right) => right.score - left.score),
    [budget, posterior, scenario, timeBudget],
  )

  const bestOption = decisionOptions[0]
  const decisionCopy = decisionExplanation(scenario, { budget, timeBudget })
  const resourceCopy = resourceLabels(scenario)
  const scaleCopy = resourceScaleExplanation(scenario, { budget, timeBudget })
  const posteriorCopy = posteriorExplanation({
    priorPercent,
    sensitivityPercent,
    falseAlarmPercent,
    posteriorPercent,
    evidencePositive,
  })
  const bayesCopy = bayesLabels(scenario, evidencePositive)

  return (
    <div className="min-h-screen overflow-hidden bg-[#f5efe8] text-[#251d1a]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(199,116,36,0.16),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(53,111,186,0.16),transparent_24%),radial-gradient(circle_at_80%_80%,rgba(77,135,86,0.14),transparent_24%)]"
      />

      <Container className="relative z-10 max-w-[94rem] px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2.5rem] border border-white/70 bg-[linear-gradient(135deg,#fdf8f3_0%,#f5ece4_48%,#efe4da_100%)] shadow-[0_34px_90px_rgba(49,35,27,0.12)]">
          <div className="relative px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
            <div className="absolute left-0 top-0 h-full w-full bg-[linear-gradient(125deg,rgba(255,255,255,0.32),transparent_35%)]" />
            <div className="relative space-y-6">
              <span className="inline-flex rounded-full border border-[#9f7760]/40 bg-white/92 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-[#6b4c3d]">
                  Día Internacional de las Matemáticas 2026
              </span>

              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#6f5448]">Probabilidad + decisión</p>
                <h1
                  aria-label="Predecir para decidir"
                  className="font-display text-5xl font-semibold leading-[0.92] text-[#2f2522] sm:text-6xl lg:text-7xl xl:text-[6.2rem]"
                >
                    Predecir
                  <br />
                    para decidir
                </h1>
                <p className="max-w-3xl text-[1.35rem] leading-relaxed text-[#493c36]">
                    Esta experiencia parte de una idea muy concreta: cuando no sabemos todo, no estamos condenados a decidir a ciegas.
                    Podemos usar información parcial, medir qué tan confiable es y transformar esa lectura en una mejor decisión.
                </p>
              </div>

              <article className="rounded-[1.8rem] border border-black/8 bg-[linear-gradient(135deg,#fff9f2_0%,#fff3e8_100%)] p-5 shadow-[0_18px_36px_rgba(36,27,21,0.07)]">
                <div className="flex items-start gap-4">
                  <IconBadge icon={FaFlask} tone="bg-[linear-gradient(135deg,#ffd29d_0%,#f0a64a_100%)] text-[#7a420f] shadow-[0_12px_24px_rgba(199,116,36,0.18)] h-12 w-12" />
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#6a4f43]">Fundamentación</p>
                    <p className="font-display text-3xl font-semibold text-[#382d2a]">La meta no es adivinar: es decidir mejor.</p>
                    <div className="grid gap-3 md:grid-cols-3">
                      <p className="rounded-[1.1rem] bg-white/76 px-4 py-3 text-base leading-relaxed text-[#483a34]">
                          Primero partimos de una idea inicial sobre lo que podría pasar.
                      </p>
                      <p className="rounded-[1.1rem] bg-white/76 px-4 py-3 text-base leading-relaxed text-[#483a34]">
                          Luego miramos señales del caso y preguntamos qué tan confiables suelen ser.
                      </p>
                      <p className="rounded-[1.1rem] bg-white/76 px-4 py-3 text-base leading-relaxed text-[#483a34]">
                          Con eso actualizamos la predicción y elegimos la opción que mejor responde a la situación.
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              <div className="grid gap-4 md:grid-cols-3">
                <article className="rounded-[1.6rem] border border-black/8 bg-[#fff9f2] p-4 shadow-[0_16px_34px_rgba(36,27,21,0.06)]">
                  <IconBadge icon={FaChartLine} tone="bg-[linear-gradient(135deg,#ffd29d_0%,#f0a64a_100%)] text-[#7a420f] shadow-[0_12px_24px_rgba(199,116,36,0.18)]" />
                  <p className="mt-4 font-display text-2xl font-semibold text-[#382d2a]">Idea inicial</p>
                  <p className="mt-2 text-base leading-relaxed text-[#4c3e38]">Es el punto de partida: lo que creemos antes de mirar información nueva.</p>
                </article>
                <article className="rounded-[1.6rem] border border-black/8 bg-[#f6faff] p-4 shadow-[0_16px_34px_rgba(36,27,21,0.06)]">
                  <IconBadge icon={FaSignal} tone="bg-[linear-gradient(135deg,#cfe0ff_0%,#84aef0_100%)] text-[#23599f] shadow-[0_12px_24px_rgba(53,111,186,0.18)]" />
                  <p className="mt-4 font-display text-2xl font-semibold text-[#382d2a]">Pista</p>
                  <p className="mt-2 text-base leading-relaxed text-[#4c3e38]">Es la información nueva del caso: ayuda a orientar, aunque no siempre acierta.</p>
                </article>
                <article className="rounded-[1.6rem] border border-black/8 bg-[#f5fbf5] p-4 shadow-[0_16px_34px_rgba(36,27,21,0.06)]">
                  <IconBadge icon={FaScaleBalanced} tone="bg-[linear-gradient(135deg,#d7f0d8_0%,#90c99a_100%)] text-[#2d6a35] shadow-[0_12px_24px_rgba(77,135,86,0.18)]" />
                  <p className="mt-4 font-display text-2xl font-semibold text-[#382d2a]">Decisión</p>
                  <p className="mt-2 text-base leading-relaxed text-[#4c3e38]">Es el cierre del proceso: usamos la predicción para comparar opciones y actuar mejor.</p>
                </article>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {historicalFrames.map(({ title, contribution, people, icon: Icon, accent }) => (
                  <article key={title} className="rounded-[1.6rem] border border-black/8 bg-white/84 p-4 shadow-[0_14px_28px_rgba(36,27,21,0.05)]">
                    <div className="flex items-start gap-3">
                      <IconBadge icon={Icon} tone={`${accent} shadow-[0_12px_24px_rgba(36,27,21,0.08)]`} />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6a4f43]">{title}</p>
                        <p className="mt-1 max-w-md text-base leading-relaxed text-[#483a34]">{contribution}</p>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {people.map((person) => (
                            <div key={person.name} className="rounded-[1rem] border border-black/6 bg-[linear-gradient(135deg,#faf5ef_0%,#f6eee5_100%)] px-3 py-2.5">
                              <p className="font-display text-base font-semibold leading-tight text-[#382d2a]">{person.name}</p>
                              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs leading-relaxed">
                                <span className="rounded-full bg-white/85 px-2 py-1 text-[#4c3e38]">{person.nationality}</span>
                                <span className="rounded-full bg-white/85 px-2 py-1 text-[#6a4f43]">{person.years}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-black/8 bg-white/86 p-5 shadow-[0_18px_42px_rgba(36,27,21,0.06)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#6a4f43]">Ruta de la charla</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-[#382d2a]">Recorrido de la experiencia</h2>
            </div>
            <IconBadge icon={FaCompassDrafting} tone="bg-[linear-gradient(135deg,#ffd29d_0%,#f0a64a_100%)] text-[#7a420f] shadow-[0_12px_24px_rgba(199,116,36,0.18)]" />
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-4">
            {talkFlow.map(({ step, title, text, icon: Icon, accent, targetId }) => (
              <button
                key={step}
                type="button"
                onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="rounded-[1.45rem] border border-black/8 bg-[#fffcf8] p-4 text-left transition hover:-translate-y-0.5 hover:border-[#d99b63] hover:shadow-[0_14px_28px_rgba(36,27,21,0.08)]"
              >
                <div className="flex items-center gap-3">
                  <IconBadge icon={Icon} tone={`${accent} shadow-[0_12px_24px_rgba(36,27,21,0.08)]`} />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6a4f43]">{step}</p>
                    <p className="font-display text-2xl font-semibold text-[#382d2a]">{title}</p>
                  </div>
                </div>
                <p className="mt-3 text-base leading-relaxed text-[#483a34]">{text}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 space-y-6">
          <article id="casos" className="rounded-[2rem] border border-black/8 bg-[linear-gradient(180deg,#fffaf4_0%,#fff3e7_100%)] p-6 shadow-[0_22px_54px_rgba(36,27,21,0.07)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#6a4f43]">Paso 1</p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-[#2f2522]">Elige un caso</h2>
                <p className="mt-2 max-w-2xl text-base leading-relaxed text-[#4b3d37]">Primero escogemos una historia cotidiana. Cuando el caso está claro, la matemática entra mucho más fácil.</p>
              </div>
              <IconBadge icon={FaRoute} tone="bg-[linear-gradient(135deg,#ffd29d_0%,#f0a64a_100%)] text-[#7a420f] shadow-[0_12px_24px_rgba(199,116,36,0.18)]" />
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
              {orderedScenarios.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setScenarioKey(item.key)
                    applyScenarioDefaults(item)
                  }}
                  className={`rounded-[1.45rem] border p-4 text-left transition ${
                    item.key === scenarioKey
                      ? 'border-[#c77424] bg-[#fff8ee] shadow-[0_14px_28px_rgba(199,116,36,0.10)]'
                      : 'border-black/8 bg-white/82 hover:border-[#d99b63]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-display text-2xl font-semibold text-[#382d2a]">{item.title}</p>
                      <p className="mt-1 text-base leading-relaxed text-[#4b3d37]">{item.summary}</p>
                    </div>
                    <IconBadge icon={item.icon} tone="bg-[linear-gradient(135deg,#f5e6d7_0%,#e9d2bb_100%)] text-[#7d6457] shadow-[0_10px_18px_rgba(36,27,21,0.08)] h-10 w-10" />
                  </div>
                </button>
              ))}
            </div>

            <div id="entender-caso" className={`mt-5 rounded-[2rem] border border-black/8 bg-gradient-to-br ${scenario.tint} p-6 shadow-[0_18px_38px_rgba(36,27,21,0.10)]`}>
              <div className="flex flex-col gap-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex rounded-full border border-black/10 bg-white/85 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#6a4f43]">
                      {scenario.badge}
                    </span>
                    <h3 className="mt-3 font-display text-4xl font-semibold text-[#2f2522]">{scenario.title}</h3>
                    <p className="mt-2 text-[1.3rem] leading-relaxed text-[#453833]">{scenario.hook}</p>
                  </div>
                  <span className={`inline-flex h-16 w-16 items-center justify-center rounded-[1.4rem] text-3xl text-white shadow-[0_12px_30px_rgba(36,27,21,0.16)] ${scenario.mark}`}>
                    <scenario.icon />
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <article className="rounded-[1.45rem] border border-black/8 bg-white/82 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6a4f43]">Situación</p>
                    <p className="mt-3 text-base leading-relaxed text-[#483a34]">{scenario.storyLead}</p>
                  </article>
                  <article className="rounded-[1.45rem] border border-black/8 bg-white/82 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6a4f43]">La pregunta</p>
                    <p className="mt-3 text-base leading-relaxed text-[#483a34]">{scenario.hook}</p>
                  </article>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <article className="rounded-[1.45rem] border border-black/8 bg-white/82 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6a4f43]">La otra respuesta posible</p>
                    <p className="mt-3 text-base leading-relaxed text-[#483a34]">Que {scenario.opposite}.</p>
                  </article>
                  <article className="rounded-[1.45rem] border border-black/8 bg-white/82 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6a4f43]">Qué miramos</p>
                    <p className="mt-3 text-base leading-relaxed text-[#483a34]">{scenario.signalPlain}</p>
                  </article>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <article className="rounded-[1.3rem] border border-black/8 bg-white/80 p-4">
                    <div className="flex items-center gap-3">
                      <FaSignal className="text-[#c77424]" />
                      <p className="text-[1.05rem] font-semibold text-[#382d2a]">La pista</p>
                    </div>
                    <p className="mt-2 text-base leading-relaxed text-[#483a34]">{scenario.signalSource}</p>
                  </article>
                  <article className="rounded-[1.3rem] border border-black/8 bg-white/80 p-4">
                    <div className="flex items-center gap-3">
                      <FaWallet className="text-[#c77424]" />
                      <p className="text-[1.05rem] font-semibold text-[#382d2a]">Qué cambia con el presupuesto</p>
                    </div>
                    <p className="mt-2 text-base leading-relaxed text-[#483a34]">{scenario.moneyRole}</p>
                  </article>
                  <article className="rounded-[1.3rem] border border-black/8 bg-white/80 p-4">
                    <div className="flex items-center gap-3">
                      <FaCalendarCheck className="text-[#356fba]" />
                      <p className="text-[1.05rem] font-semibold text-[#382d2a]">Qué cambia con el tiempo</p>
                    </div>
                    <p className="mt-2 text-base leading-relaxed text-[#483a34]">{scenario.timeRole}</p>
                  </article>
                </div>

                <article className="rounded-[1.55rem] border border-black/8 bg-[#251d1a] p-5 text-white shadow-[0_18px_38px_rgba(36,27,21,0.18)]">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">Números que usa la app</p>
                    <FaFlask className="text-[#ffd48a]" />
                  </div>
                  <div className="mt-3">
                    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${
                      evidencePositive ? 'bg-[#214d2a] text-[#d8f3dd]' : 'bg-[#5a2c2c] text-[#ffd9d9]'
                    }`}
                    >
                      {evidencePositive ? 'Pista que ayuda' : 'Pista que no ayuda'}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {formulaTokens.map((token) => (
                      <span key={token} className="rounded-full border border-white/12 bg-white/8 px-3 py-2 text-base font-semibold text-white/88">
                        {token}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-base leading-relaxed text-white/88">
                    La idea es simple: empezamos con una creencia, miramos una pista y mejoramos la predicción.
                  </p>
                </article>

                <div className="grid gap-3 sm:grid-cols-3">
                  <MeterCard label="Primera apuesta" value={priorPercent} tone="bg-[#c77424]" />
                  <MeterCard label="Qué tan buena es la pista" value={signalQuality} tone="bg-[#356fba]" />
                  <MeterCard label="Predicción final" value={showPrediction ? posteriorPercent : 0} tone="bg-[#4d8756]" />
                </div>
              </div>
            </div>
          </article>

          <div className="grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
            <div className="space-y-6">
              <article className="rounded-[2rem] border border-black/8 bg-white/88 p-6 shadow-[0_22px_54px_rgba(36,27,21,0.07)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p id="prediccion" className="text-xs font-bold uppercase tracking-[0.24em] text-[#6a4f43]">Paso 3</p>
                    <h2 className="mt-2 font-display text-3xl font-semibold text-[#382d2a]">Construye la predicción</h2>
                    <p className="mt-2 max-w-xl text-base leading-relaxed text-[#4b3d37]">Aquí jugamos con la primera idea y con la calidad de la pista para ver cómo se mueve la probabilidad.</p>
                  </div>
                  <IconBadge icon={FaTriangleExclamation} tone="bg-[linear-gradient(135deg,#ffd29d_0%,#f0a64a_100%)] text-[#7a420f] shadow-[0_12px_24px_rgba(199,116,36,0.18)]" />
                </div>

                <div className="mt-5 space-y-4">
                  <div className="rounded-[1.35rem] border border-black/8 bg-[#fff8f1] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6a4f43]">Prueba ejemplos</p>
                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                      {scenario.examples.map((examplePreset) => (
                        <button
                          key={examplePreset.label}
                          type="button"
                          onClick={() => {
                            setShowPrediction(false)
                            setPriorPercent(examplePreset.priorPercent)
                            setSensitivityPercent(examplePreset.sensitivityPercent)
                            setFalseAlarmPercent(examplePreset.falseAlarmPercent)
                            setEvidencePositive(examplePreset.evidencePositive)
                          }}
                          className="rounded-[1rem] border border-black/8 bg-white px-4 py-3 text-left transition hover:border-[#c77424]"
                        >
                          <p className="text-[1.05rem] font-semibold text-[#382d2a]">{examplePreset.label}</p>
                          <p className="mt-1 text-sm leading-relaxed text-[#4f4039]">
                          Empieza en {examplePreset.priorPercent}%, pista {examplePreset.evidencePositive ? 'positiva' : 'negativa'}, acierto {examplePreset.sensitivityPercent}%.
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <SliderCard
                    icon={FaChartLine}
                    title="Idea inicial"
                    value={`${priorPercent}%`}
                    accent="bg-[#fff0dd] text-[#a65c19]"
                    hint="Tu primera apuesta"
                  >
                    <input
                      type="range"
                      min="5"
                      max="95"
                      step="1"
                      value={priorPercent}
                      onChange={(event) => {
                        setShowPrediction(false)
                        setPriorPercent(Number(event.target.value))
                      }}
                      className="w-full accent-[#c77424]"
                    />
                  </SliderCard>

                  <SliderCard
                    icon={FaSignal}
                    title="Acierto de la pista"
                    value={`${sensitivityPercent}%`}
                    accent="bg-[#e7f0ff] text-[#356fba]"
                    hint="Cuántas veces acierta"
                  >
                    <input
                      type="range"
                      min="50"
                      max="99"
                      step="1"
                      value={sensitivityPercent}
                      onChange={(event) => {
                        setShowPrediction(false)
                        setSensitivityPercent(Number(event.target.value))
                      }}
                      className="w-full accent-[#356fba]"
                    />
                  </SliderCard>

                  <SliderCard
                    icon={FaTriangleExclamation}
                    title="Falsa pista"
                    value={`${falseAlarmPercent}%`}
                    accent="bg-[#f7e8df] text-[#b3673d]"
                    hint="Cuántas veces engaña"
                  >
                    <input
                      type="range"
                      min="1"
                      max="45"
                      step="1"
                      value={falseAlarmPercent}
                      onChange={(event) => {
                        setShowPrediction(false)
                        setFalseAlarmPercent(Number(event.target.value))
                      }}
                      className="w-full accent-[#b3673d]"
                    />
                  </SliderCard>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPrediction(false)
                        setEvidencePositive(true)
                      }}
                      className={`rounded-[1.45rem] border p-4 text-left transition ${
                        evidencePositive
                          ? 'border-[#4d8756] bg-[#f1faf1] shadow-[0_14px_24px_rgba(77,135,86,0.08)]'
                          : 'border-black/8 bg-[#fffdfa]'
                      }`}
                    >
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6a4f43]">Pista que ayuda</p>
                      <p className="mt-2 text-base leading-relaxed text-[#4f4039]">{scenario.evidencePositive}</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPrediction(false)
                        setEvidencePositive(false)
                      }}
                      className={`rounded-[1.45rem] border p-4 text-left transition ${
                        !evidencePositive
                          ? 'border-[#8f6f60] bg-[#f7f0ea] shadow-[0_14px_24px_rgba(80,55,40,0.07)]'
                          : 'border-black/8 bg-[#fffdfa]'
                      }`}
                    >
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6a4f43]">Pista que no ayuda</p>
                      <p className="mt-2 text-base leading-relaxed text-[#4f4039]">{scenario.evidenceNegative}</p>
                    </button>
                  </div>

                  <div className="rounded-[1.35rem] border border-black/8 bg-[#fff8f1] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6a4f43]">Cómo leer estos números</p>
                    <div className="mt-3 space-y-2 text-base leading-relaxed text-[#4f4039]">
                      <p>Idea inicial: es tu primera apuesta antes de mirar la pista.</p>
                      <p>Acierto de la pista: dice cuántas veces esa pista suele salir bien.</p>
                      <p>Falsa pista: dice cuántas veces esa pista parece buena, pero en realidad engaña.</p>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <div className="space-y-6">
              <article className="rounded-[2rem] border border-black/8 bg-[linear-gradient(180deg,#fffaf5_0%,#f7eee4_100%)] p-6 shadow-[0_22px_54px_rgba(36,27,21,0.07)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#6a4f43]">Paso 2</p>
                    <h2 className="mt-2 font-display text-3xl font-semibold text-[#382d2a]">Entender el caso paso a paso</h2>
                    <p className="mt-2 max-w-2xl text-base leading-relaxed text-[#4b3d37]">Antes de tocar fórmulas, aterrizamos qué está pasando, qué queremos saber y qué pista estamos usando en esta historia.</p>
                  </div>
                  <IconBadge icon={FaFlask} tone="bg-[linear-gradient(135deg,#ffd29d_0%,#f0a64a_100%)] text-[#7a420f] shadow-[0_12px_24px_rgba(199,116,36,0.18)]" />
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {walkthroughCards.map((step) => {
                    const StepIcon = step.icon
                    return (
                      <article key={step.title} className="rounded-[1.45rem] border border-black/8 bg-white/84 p-4 shadow-[0_12px_24px_rgba(36,27,21,0.05)]">
                        <div className="flex items-center gap-3">
                          <IconBadge icon={StepIcon} tone="bg-[linear-gradient(135deg,#fff0df_0%,#f0c59d_100%)] text-[#9b5b2f] shadow-[0_10px_18px_rgba(179,108,66,0.16)] h-10 w-10" />
                          <p className="font-display text-[1.65rem] font-semibold text-[#382d2a]">{step.title}</p>
                        </div>
                        <p className="mt-3 text-base leading-relaxed text-[#4f4039]">{step.text}</p>
                      </article>
                    )
                  })}
                </div>

                <div className="mt-4 rounded-[1.45rem] border border-black/8 bg-[#fff7ef] p-4 shadow-[0_12px_24px_rgba(36,27,21,0.05)]">
                  <div className="flex items-center gap-3">
                    <IconBadge icon={FaDice} tone="bg-[linear-gradient(135deg,#fff1de_0%,#efc18d_100%)] text-[#9b5b2f] shadow-[0_10px_18px_rgba(179,108,66,0.16)]" />
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#6a4f43]">Lectura guiada del caso</p>
                  </div>
                  <div className="mt-3 grid gap-3">
                    {clayCards.map((step) => {
                      const StepIcon = step.icon
                      return (
                        <div key={step.title} className="rounded-[1rem] bg-white/88 p-4">
                          <div className="flex items-center gap-3">
                            <IconBadge icon={StepIcon} tone="bg-[linear-gradient(135deg,#fff2e4_0%,#efc8a4_100%)] text-[#9b5b2f] shadow-[0_10px_18px_rgba(179,108,66,0.12)] h-9 w-9 rounded-xl" />
                            <p className="text-[1.05rem] font-semibold text-[#382d2a]">{step.title}</p>
                          </div>
                          <p className="mt-2 text-base leading-relaxed text-[#4f4039]">{step.text}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-4 rounded-[1.45rem] border border-black/8 bg-[#f9f4ee] p-4 shadow-[0_12px_24px_rgba(36,27,21,0.05)]">
                  <div className="flex items-center gap-3">
                    <IconBadge icon={FaPeopleArrows} tone="bg-[linear-gradient(135deg,#f1e3d6_0%,#ddc2ab_100%)] text-[#8a5d43] shadow-[0_10px_18px_rgba(138,93,67,0.14)]" />
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#6a4f43]">Ejemplo con 100 casos</p>
                  </div>
                  <div className="mt-3 space-y-2 text-base leading-relaxed text-[#4f4039]">
                    <p>{example.intro}</p>
                    <p>{example.line1}</p>
                    <p>{example.line2}</p>
                    <p>{example.line3}</p>
                    <p>{example.line4}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-[1.45rem] border border-black/8 bg-[#fffdfa] p-4 shadow-[0_12px_24px_rgba(36,27,21,0.05)]">
                  <div className="flex items-center gap-3">
                    <IconBadge icon={FaFlask} tone="bg-[linear-gradient(135deg,#f4ece7_0%,#ddc7bb_100%)] text-[#7b5b4f] shadow-[0_10px_18px_rgba(123,91,79,0.12)]" />
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#6a4f43]">La idea matemática, en corto</p>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {mathSteps.map((step) => {
                      const StepIcon = step.icon
                      return (
                        <div key={step.title} className="rounded-[1rem] bg-[#f8f1ea] p-3">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#8a5d43]">
                              <StepIcon />
                            </span>
                            <p className="text-[1.02rem] font-semibold text-[#382d2a]">{step.title}</p>
                          </div>
                          <p className="mt-2 text-base leading-relaxed text-[#4f4039]">{step.text}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </article>

            </div>
          </div>

          <article className="rounded-[2rem] border border-black/8 bg-[linear-gradient(180deg,#fffdf9_0%,#f7f1eb_100%)] p-6 shadow-[0_22px_54px_rgba(36,27,21,0.07)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#6a4f43]">Paso 4</p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-[#382d2a]">Revela la nueva predicción</h2>
                <p className="mt-2 max-w-2xl text-base leading-relaxed text-[#4b3d37]">En este momento aparece el resultado del modelo y vemos de dónde sale con los números del caso.</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPrediction(true)}
                  className="rounded-full bg-[#c77424] px-5 py-3 text-base font-semibold text-white shadow-[0_14px_26px_rgba(199,116,36,0.18)] transition hover:bg-[#ae651f]"
                >
                  Revelar predicción
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrediction(false)}
                  className="rounded-full border border-[#d8c8bc] bg-white px-5 py-3 text-base font-semibold text-[#5c4a43] transition hover:border-[#c77424]"
                >
                  Reiniciar
                </button>
              </div>
            </div>

            <div className="mt-5 grid items-start gap-3 lg:grid-cols-2">
              <div className="space-y-3">
                <div className="rounded-[1.7rem] bg-[#251d1a] p-5 text-white shadow-[0_20px_44px_rgba(36,27,21,0.16)]">
                  <div className="flex items-center gap-3">
                    <FaArrowTrendUp className="text-[#ffd48a]" />
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/82">Tu respuesta</p>
                  </div>

                  {!showPrediction ? (
                    <div className="mt-5 space-y-4">
                      <p className="font-display text-[3rem] font-semibold leading-tight text-white">
                        Al comienzo pensábamos una cosa.
                        <br />
                        ¿La pista la cambia o la deja casi igual?
                      </p>
                      <p className="text-base leading-relaxed text-white/90">
                        Empezamos pensando en {priorPercent} de cada 100. Ahora apareció una pista cuya fuerza es {signalQuality} de cada 100.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-5 space-y-4">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/82">Nueva predicción</p>
                      <p className="font-display text-[5.5rem] font-semibold leading-none text-white">{posteriorPercent}%</p>
                      <p className="text-base leading-relaxed text-white/90">
                        Con esta pista, la probabilidad de que {scenario.hypothesis} sube o baja hasta ese valor.
                      </p>
                      <div className="rounded-[1rem] border border-white/10 bg-white/10 p-4 text-base leading-relaxed text-white/90">
                        <p className="font-semibold text-white">¿De dónde salió?</p>
                        <p className="mt-2">{posteriorCopy}</p>
                        <p className="mt-2 text-white/82">La app usa aquí una idea del teorema de Bayes: P(H|E).</p>
                      </div>
                    </div>
                  )}
                </div>

                <article className="rounded-[1.4rem] border border-white/65 bg-white/86 p-4 shadow-[0_12px_26px_rgba(36,27,21,0.05)]">
                  <div className="flex items-center gap-3">
                    <IconBadge icon={FaChartLine} tone="bg-[linear-gradient(135deg,#fef0de_0%,#efc18d_100%)] text-[#b36c42] shadow-[0_10px_18px_rgba(179,108,66,0.12)] h-9 w-9 rounded-xl" />
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6a4f43]">De dónde salen los números</p>
                  </div>
                  <div className="mt-3 space-y-2 text-base leading-relaxed text-[#483a34]">
                    <p>El primer número sale de tu primera apuesta: {priorPercent}%.</p>
                    <p>El segundo sale de qué tan buena es la pista: {sensitivityPercent}%.</p>
                    <p>El tercero sale de qué tanto puede engañar esa pista: {falseAlarmPercent}%.</p>
                    <p>Con esos tres números la app calcula la nueva predicción: {showPrediction ? `${posteriorPercent}%` : 'todavía oculta'}.</p>
                  </div>
                </article>
              </div>

              <div className="space-y-3">
                <article className="rounded-[1.4rem] border border-white/65 bg-white/86 p-4 shadow-[0_12px_26px_rgba(36,27,21,0.05)]">
                  <div className="flex items-center gap-3">
                    <IconBadge icon={FaMagnifyingGlass} tone="bg-[linear-gradient(135deg,#f5ece4_0%,#e5cfbf_100%)] text-[#8a5d43] shadow-[0_10px_18px_rgba(138,93,67,0.12)] h-9 w-9 rounded-xl" />
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6a4f43]">Qué datos usamos</p>
                  </div>
                  <div className="mt-3 space-y-2 text-base leading-relaxed text-[#483a34]">
                    <p>La pregunta: {scenario.hook}</p>
                    <p>Fuente: {scenario.signalSource}</p>
                    <p>Pista elegida: {evidencePositive ? 'positiva' : 'negativa'}</p>
                    <p>Dato observado: {evidencePositive ? scenario.evidencePositive : scenario.evidenceNegative}</p>
                  </div>
                </article>

                <article className="rounded-[1.4rem] border border-white/65 bg-white/86 p-4 shadow-[0_12px_26px_rgba(36,27,21,0.05)]">
                  <div className="flex items-center gap-3">
                    <IconBadge icon={FaFlask} tone="bg-[linear-gradient(135deg,#eef3ff_0%,#c7d7f8_100%)] text-[#5579ba] shadow-[0_10px_18px_rgba(85,121,186,0.12)] h-9 w-9 rounded-xl" />
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6a4f43]">Modelo que usa la app</p>
                  </div>
                  <div className="mt-3 space-y-2 text-base leading-relaxed text-[#483a34]">
                    <p>{bayesCopy.hypothesis}</p>
                    <p>{bayesCopy.evidence}</p>
                    <p>{bayesCopy.posterior}</p>
                    <p>{bayesCopy.prior}</p>
                    <p>{bayesCopy.likelihood}</p>
                    <p>{bayesCopy.falseAlarm}</p>
                  </div>
                </article>
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <MeterCard label="Primera apuesta" value={priorPercent} tone="bg-[#6a5951]" />
              <MeterCard label="Resultado" value={showPrediction ? posteriorPercent : 0} tone="bg-[#c77424]" />
              <MeterCard label="Calidad de la pista" value={signalQuality} tone="bg-[#356fba]" />
            </div>
          </article>

          <article id="decision" className="rounded-[2rem] border border-black/8 bg-white/88 p-6 shadow-[0_22px_54px_rgba(36,27,21,0.07)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#6a4f43]">Paso 5</p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-[#382d2a]">Elige la mejor opción</h2>
                <p className="mt-2 max-w-2xl text-base leading-relaxed text-[#4b3d37]">Solo después de predecir comparamos opciones: cuál cabe en los recursos, cuál cuida mejor el tiempo y cuál conviene más.</p>
              </div>
              <div className="rounded-[1.3rem] border border-black/8 bg-[#fbf5ef] px-4 py-3 lg:max-w-xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6a4f43]">{decisionCopy.title}</p>
                <p className="mt-2 text-base leading-relaxed text-[#4b3d37]">{decisionCopy.text}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <SliderCard
                icon={FaWallet}
                title="Presupuesto"
                value={budget}
                accent="bg-[#fff0dd] text-[#a65c19]"
                hint="De 0 a 100"
              >
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="1"
                  value={budget}
                  onChange={(event) => setBudget(Number(event.target.value))}
                  className="w-full accent-[#c77424]"
                />
                <p className="mt-2 text-base leading-relaxed text-[#4f4039]">
                  {resourceCopy.budget}
                </p>
              </SliderCard>

              <SliderCard
                icon={FaBookOpen}
                title="Tiempo disponible"
                value={timeBudget}
                accent="bg-[#e7f0ff] text-[#356fba]"
                hint="De 0 a 100"
              >
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="1"
                  value={timeBudget}
                  onChange={(event) => setTimeBudget(Number(event.target.value))}
                  className="w-full accent-[#356fba]"
                />
                <p className="mt-2 text-base leading-relaxed text-[#4f4039]">
                  {resourceCopy.time}
                </p>
              </SliderCard>
            </div>

            <div className="mt-4 rounded-[1.35rem] border border-black/8 bg-[#fff8f1] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6a4f43]">{scaleCopy.title}</p>
              <div className="mt-3 space-y-2 text-base leading-relaxed text-[#4f4039]">
                {scaleCopy.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              {decisionOptions.map((option, index) => (
                <OptionCard
                  key={option.key}
                  scenario={scenario}
                  option={option}
                  highlighted={index === 0}
                  budget={budget}
                  timeBudget={timeBudget}
                />
              ))}
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
              <article className="rounded-[1.7rem] bg-[linear-gradient(135deg,#2d4b61_0%,#183040_100%)] p-5 text-white shadow-[0_22px_48px_rgba(33,59,79,0.18)]">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9fc0df]">Lectura final</p>
                <p className="mt-4 font-display text-3xl font-semibold text-white">{bestOption.title}</p>
                <p className="mt-3 text-base leading-relaxed text-white/92">
                  Es la opción que mejor combina resultado posible, recursos disponibles y criterio humano.
                </p>
                <p className="mt-3 text-base leading-relaxed text-white/92">
                  En la charla se puede leer así: primero anticipamos qué es más probable y luego elegimos mejor.
                </p>
              </article>

              <article className="rounded-[1.7rem] border border-black/8 bg-[#fffaf4] p-5 shadow-[0_14px_28px_rgba(36,27,21,0.05)]">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#6a4f43]">Preguntas para abrir discusión</p>
                <div className="mt-4 space-y-3 text-base leading-relaxed text-[#483a34]">
                  <p className="rounded-[1.1rem] bg-white/88 p-4">¿Qué variable movió más la probabilidad posterior?</p>
                  <p className="rounded-[1.1rem] bg-white/88 p-4">¿Cambió la mejor decisión cuando cambió el presupuesto?</p>
                  <p className="rounded-[1.1rem] bg-white/88 p-4">¿Qué parte del resultado viene del cálculo y cuál del criterio humano?</p>
                </div>
              </article>
            </div>
          </article>
        </section>
      </Container>
    </div>
  )
}
