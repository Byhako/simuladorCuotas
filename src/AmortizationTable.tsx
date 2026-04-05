import { formatPrice } from "./hooks/formatPrice"
import generateAmortizationTable from "./hooks/generateAmortizationTable"

const AmortizationTable = ({ tasa, cuota, monto }: { tasa: number, cuota: number, monto: number }) => {
  const table = generateAmortizationTable(monto, tasa, cuota)

  return (
    <div className="table">
      <h2 className="table-title">Tabla de Amortización</h2>
      <table>
        <thead className="table-header">
          <tr>
            <th>Mes</th>
            <th>Cuota</th>
            <th>Interes</th>
            <th>Capital</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {table.map((row) => (
            <tr key={row.mes}>
              <td style={{ textAlign: "center" }}>{row.mes}</td>
              <td>{formatPrice(Number(row.cuota))}</td>
              <td>{formatPrice(Number(row.interes))}</td>
              <td>{formatPrice(Number(row.capital))}</td>
              <td style={{ position: "relative" }}>
                <div className="interesBar" style={{ width: `${(Number(row.interes) / Number(row.cuota)) * 100}%` }}></div>
                <div className="capitalBar" style={{ width: `${(Number(row.capital) / Number(row.cuota)) * 100}%` }}></div>
                {formatPrice(Number(row.saldo))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AmortizationTable
