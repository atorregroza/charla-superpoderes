const anscombeRaw = {
  I: {
    label: 'Anscombe I',
    description: 'Relación lineal limpia con una dispersión razonable.',
    points: [
      [10, 8.04],
      [8, 6.95],
      [13, 7.58],
      [9, 8.81],
      [11, 8.33],
      [14, 9.96],
      [6, 7.24],
      [4, 4.26],
      [12, 10.84],
      [7, 4.82],
      [5, 5.68],
    ],
  },
  II: {
    label: 'Anscombe II',
    description: 'Curvatura clara que la correlación no delata por sí sola.',
    points: [
      [10, 9.14],
      [8, 8.14],
      [13, 8.74],
      [9, 8.77],
      [11, 9.26],
      [14, 8.1],
      [6, 6.13],
      [4, 3.1],
      [12, 9.13],
      [7, 7.26],
      [5, 4.74],
    ],
  },
  III: {
    label: 'Anscombe III',
    description: 'Un punto extremo altera la pendiente sin cambiar el resumen.',
    points: [
      [10, 7.46],
      [8, 6.77],
      [13, 12.74],
      [9, 7.11],
      [11, 7.81],
      [14, 8.84],
      [6, 6.08],
      [4, 5.39],
      [12, 8.15],
      [7, 6.42],
      [5, 5.73],
    ],
  },
  IV: {
    label: 'Anscombe IV',
    description: 'Casi todos los x son iguales y un solo punto sostiene el patrón.',
    points: [
      [8, 6.58],
      [8, 5.76],
      [8, 7.71],
      [8, 8.84],
      [8, 8.47],
      [8, 7.04],
      [8, 5.25],
      [19, 12.5],
      [8, 5.56],
      [8, 7.91],
      [8, 6.89],
    ],
  },
}

const tukeyTemplates = {
  symmetric: {
    label: 'Simétrica',
    description: 'Valores equilibrados alrededor del centro; útil para contrastar con otras formas.',
    values: [-14, -12, -10, -6, -3, -1, 1, 3, 6, 10, 12, 14],
  },
  skewed: {
    label: 'Sesgada',
    description: 'Una cola larga hacia la derecha, típica en datos de tiempos o ingresos.',
    values: [-12, -10, -9, -8, -7, -6, -5, -3, 0, 5, 14, 29],
  },
  bimodal: {
    label: 'Bimodal',
    description: 'Dos grupos separados, una firma clásica de mezcla de poblaciones.',
    values: [-18, -16, -14, -12, -10, -8, 8, 10, 12, 14, 16, 18],
  },
  outlier: {
    label: 'Con outlier',
    description: 'Un valor aislado arrastra la media y cambia la historia visual.',
    values: [-9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 44],
  },
}

const round = (value, digits = 2) => Number(value.toFixed(digits))

const sum = (values) => values.reduce((accumulator, value) => accumulator + value, 0)

export const mean = (values) => sum(values) / values.length

export const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  }

  return sorted[middle]
}

export const quartiles = (values) => {
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  const lowerHalf = sorted.slice(0, middle)
  const upperHalf = sorted.length % 2 === 0 ? sorted.slice(middle) : sorted.slice(middle + 1)

  return {
    q1: median(lowerHalf),
    q3: median(upperHalf),
  }
}

export const variance = (values) => {
  const avg = mean(values)
  return sum(values.map((value) => (value - avg) ** 2)) / (values.length - 1)
}

export const standardDeviation = (values) => Math.sqrt(variance(values))

export const correlation = (xValues, yValues) => {
  const xAvg = mean(xValues)
  const yAvg = mean(yValues)
  const numerator = sum(xValues.map((value, index) => (value - xAvg) * (yValues[index] - yAvg)))
  const denominator = Math.sqrt(
    sum(xValues.map((value) => (value - xAvg) ** 2)) * sum(yValues.map((value) => (value - yAvg) ** 2)),
  )

  return numerator / denominator
}

export const linearRegression = (xValues, yValues) => {
  const xAvg = mean(xValues)
  const yAvg = mean(yValues)
  const numerator = sum(xValues.map((value, index) => (value - xAvg) * (yValues[index] - yAvg)))
  const denominator = sum(xValues.map((value) => (value - xAvg) ** 2))
  const slope = numerator / denominator
  const intercept = yAvg - slope * xAvg

  return {
    slope,
    intercept,
  }
}

const resampleTemplate = (values, size) => {
  if (size === values.length) {
    return [...values]
  }

  return Array.from({ length: size }, (_, index) => {
    const scaledIndex = (index * (values.length - 1)) / Math.max(size - 1, 1)
    const lowerIndex = Math.floor(scaledIndex)
    const upperIndex = Math.min(values.length - 1, lowerIndex + 1)
    const mix = scaledIndex - lowerIndex
    return values[lowerIndex] + (values[upperIndex] - values[lowerIndex]) * mix
  })
}

const seedFactor = (seed, index) => {
  const raw = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453
  return raw - Math.floor(raw)
}

export const generateTukeySeries = ({ template = 'symmetric', size = 12, targetMean = 50, spread = 1, seed = 1 }) => {
  const base = tukeyTemplates[template] ?? tukeyTemplates.symmetric
  const sampled = resampleTemplate(base.values, size)
  const jittered = sampled.map((value, index) => {
    const centered = seedFactor(seed, index) - 0.5
    return value * spread + centered * Math.max(spread * 1.25, 0.35)
  })
  const shifted = jittered.map((value) => value + (targetMean - mean(jittered)))
  const rounded = shifted.map((value) => round(value, 1))
  const correction = round(targetMean * rounded.length - sum(rounded), 1)

  rounded[rounded.length - 1] = round(rounded[rounded.length - 1] + correction, 1)

  return {
    key: template,
    label: base.label,
    description: base.description,
    values: rounded,
  }
}

const createAnscombeVariant = (key) => {
  const base = anscombeRaw[key] ?? anscombeRaw.I

  return {
    key,
    label: base.label,
    description: base.description,
    points: base.points.map(([x, y]) => ({ x, y })),
  }
}

export const anscombeSets = Object.keys(anscombeRaw).map((key) => createAnscombeVariant(key))

export const buildScatterSummary = (points) => {
  const xValues = points.map(({ x }) => x)
  const yValues = points.map(({ y }) => y)
  const { slope, intercept } = linearRegression(xValues, yValues)

  return {
    meanX: round(mean(xValues), 2),
    meanY: round(mean(yValues), 2),
    varianceX: round(variance(xValues), 2),
    varianceY: round(variance(yValues), 2),
    correlation: round(correlation(xValues, yValues), 3),
    regression: `y = ${round(intercept, 2)} + ${round(slope, 2)}x`,
    regressionCoefficients: {
      slope,
      intercept,
    },
  }
}

export const buildDistributionSummary = (values) => {
  const sorted = [...values].sort((a, b) => a - b)
  const { q1, q3 } = quartiles(sorted)
  const min = Math.min(...sorted)
  const max = Math.max(...sorted)

  return {
    mean: round(mean(sorted), 2),
    median: round(median(sorted), 2),
    min: round(min, 2),
    max: round(max, 2),
    q1: round(q1, 2),
    q3: round(q3, 2),
    standardDeviation: round(standardDeviation(sorted), 2),
    range: round(max - min, 2),
  }
}

export const exportScatterCsv = (points) => {
  const rows = ['x,y', ...points.map(({ x, y }) => `${x},${y}`)]
  return rows.join('\n')
}

export const exportSeriesCsv = (values) => {
  const rows = ['index,value', ...values.map((value, index) => `${index + 1},${value}`)]
  return rows.join('\n')
}

export const tukeyPatterns = Object.keys(tukeyTemplates).map((key) => ({
  key,
  label: tukeyTemplates[key].label,
  description: tukeyTemplates[key].description,
}))
