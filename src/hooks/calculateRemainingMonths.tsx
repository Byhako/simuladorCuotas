import Decimal from 'decimal.js'

const calculateRemainingMonths = (
  monto: number,
  abonoCapital: number,
  tasaMensual: number,
  cuotaFija: number,
  months: number
) => {
  const nuevoSaldo = monto - abonoCapital

  const P = new Decimal(nuevoSaldo)
  const i = new Decimal(tasaMensual).div(100)
  const C = new Decimal(cuotaFija)

  // Parte de arriba: ln(1 - (P * i / C))
  const numerator = Decimal.ln(
    new Decimal(1).minus(P.times(i).div(C))
  )

  // Parte de abajo: ln(1 + i)
  const denominator = Decimal.ln(new Decimal(1).plus(i))

  // n = -(numerador / denominador)
  const n = numerator.div(denominator).neg()

  const newTotal = C.times(n)
  const total = C.times(months)


  const savedMoney = total.sub(newTotal)


  // Redondeamos hacia arriba porque no puedes pagar "media cuota" (la última sería menor)
  const remainingMonths = Math.ceil(n.toNumber())
  const lastQuota = calculateLastQuota(nuevoSaldo, i.toNumber(), cuotaFija, remainingMonths)


  return { remainingMonths, newTotal: newTotal.toFixed(2), savedMoney: savedMoney.toFixed(2), lastQuota }
}

const calculateLastQuota = (
  saldoPostAbono: number,
  tasaMensual: number,
  cuotaNormal: number,
  mesesRestantes: number
) => {
  const P = new Decimal(saldoPostAbono)
  const i = new Decimal(tasaMensual)
  const C = new Decimal(cuotaNormal)
  const n = mesesRestantes // El número ya redondeado (ej: 125)

  // 1. Calculamos el saldo acumulado hasta el mes n-1
  // Fórmula de saldo pendiente: P*(1+i)^(n-1) - C*[((1+i)^(n-1) - 1) / i]
  const nMinusOne = n - 1
  const factor = i.plus(1).pow(nMinusOne)
  
  const saldoAlMesAnterior = P.times(factor).minus(
    C.times(factor.minus(1).div(i))
  )

  // 2. La última cuota es el saldo anterior + su último interés
  const ultimaCuota = saldoAlMesAnterior.times(i.plus(1))

  return ultimaCuota.toFixed(2)
}

export default calculateRemainingMonths
