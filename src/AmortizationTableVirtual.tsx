import React from 'react'
import { TableVirtuoso } from 'react-virtuoso'
import { formatPrice } from "./hooks/formatPrice"
import generateAmortizationTable from './hooks/generateAmortizationTable'


interface AmortizationRow {
  mes: number
  cuota: string
  interes: string
  capital: string
  saldo: string
}

interface Props {
  tasa: number
  cuota: number
  monto: number
}

export const AmortizationTable: React.FC<Props> = ({ tasa, cuota, monto }) => {
  const table = generateAmortizationTable(monto, tasa, cuota)


  return (
    <div style={{ height: 400, width: '100%', marginTop: '20px' }}>
      <h2 className="table-title">Tabla de Amortización</h2>

      <TableVirtuoso
        data={table}
        // Estilos para que la tabla se vea profesional
        style={{ height: '100%', border: '1px solid #eee', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
        // Cabecera fija (Sticky Header) automática
        fixedHeaderContent={() => (
          <tr style={{ backgroundColor: '#acc7f7' }}>
            <th style={{ width: 80, padding: '12px' }}>Mes</th>
            <th>Cuota</th>
            <th>Interés</th>
            <th>Capital</th>
            <th>Saldo</th>
          </tr>
        )}
        // Cómo se renderiza cada fila
        itemContent={(index, item) => (
          <>
            <td style={{ padding: '10px', textAlign: 'center' }}>{item.mes}</td>
            <td>{formatPrice(Number(item.cuota))}</td>
            <td>{formatPrice(Number(item.interes))}</td>
            <td>{formatPrice(Number(item.capital))}</td>
            <td style={{ fontWeight: item.saldo === "0.00" ? 'bold' : 'normal' }}>
              {formatPrice(Number(item.saldo))}
            </td>
          </>
        )}
      />
    </div>
  )
}

export default AmortizationTable
