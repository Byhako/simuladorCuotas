import Decimal from 'decimal.js'


const changeTasa = (tasa: number) => {
  const tasaAnual = new Decimal(tasa).div(100);

  const uno = new Decimal(1);

  // Convertir E.A. a Mensual: (1 + i)^(1/12) - 1
  const tasaMensual = uno.plus(tasaAnual).pow(uno.div(12)).minus(1);

  return tasaMensual.times(100).toNumber()
}

export default changeTasa


