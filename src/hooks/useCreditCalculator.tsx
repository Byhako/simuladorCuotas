import Decimal from 'decimal.js'

// Configuración de precisión para finanzas
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP })

const useCreditCalculator = (amount: number, rate: number, months: number) => {
  const calculateQuota = () => {

    const P = new Decimal(amount)
    const i = new Decimal(rate).div(100) // Tasa mensual
    const n = new Decimal(months)

    // Fórmula: C = (P * i) / (1 - (1 + i)^-n)
    const onePlusI = i.plus(1)
    const denominator = new Decimal(1).minus(onePlusI.pow(n.neg()))
    const quota = P.times(i).div(denominator)
    const total = quota.times(n)

    return { quota: quota.toFixed(2), total: total.toFixed(2) }
  }

  return calculateQuota
}

export default useCreditCalculator
