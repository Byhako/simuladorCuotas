import Decimal from 'decimal.js'

const generateAmortizationTable = (monto: number, tasaMensual: number, cuotaMensual: number) => {
  let saldoActual = new Decimal(monto)
  const tasa = new Decimal(tasaMensual).div(100)
  const cuotaFija = new Decimal(cuotaMensual)
  const tabla = []
  let mes = 1

  while (saldoActual.gt(0)) {
    const interesMes = saldoActual.times(tasa)
    let abonoCapital = cuotaFija.minus(interesMes)
    let cuotaEfectiva = cuotaFija

    // Ajuste para la última cuota (Edge Case)
    if (abonoCapital.gte(saldoActual) || saldoActual.minus(abonoCapital).lt(1)) {
      abonoCapital = saldoActual
      cuotaEfectiva = saldoActual.plus(interesMes)
      saldoActual = new Decimal(0)
    } else {
      saldoActual = saldoActual.minus(abonoCapital)
    }

    tabla.push({
      mes,
      cuota: cuotaEfectiva.toFixed(2),
      interes: interesMes.toFixed(2),
      capital: abonoCapital.toFixed(2),
      saldo: saldoActual.toFixed(2),
    })

    mes++
    if (mes > 500) break // Seguro contra bucles infinitos
  }

  return tabla
}

export default generateAmortizationTable
