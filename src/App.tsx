import './App.css'

import { useForm, type SubmitHandler } from "react-hook-form"
import useCreditCalculator from './hooks/useCreditCalculator'
import { useState } from 'react'
import { formatPrice } from './hooks/formatPrice'
import changeTasa from './hooks/changeTasa'
import calculateRemainingMonths from './hooks/calculateRemainingMonths'
import AmortizationTable from './AmortizationTable'
// import AmortizationTable from './AmortizationTableVirtual'

interface IFormInput {
  monto: number
  cuotas: number
  tasa: number
  tipoTasa: string
  seguroDeVida: string
  abonoCapital: number
}

const TASA_BASE = 10

export default function App() {
  const { register, handleSubmit, watch } = useForm<IFormInput>()
  const [result, setResult] = useState<{ quota: string, total: string, tasa: number, remainingMonths: number, abonoCapital: number, newTotal: string, savedMoney: string, lastQuota: string, monto: number }>({
    quota: "",
    total: "",
    tasa: 0,
    remainingMonths: 0,
    abonoCapital: 0,
    newTotal: "",
    savedMoney: "",
    lastQuota: "",
    monto: 0
  })

  const calculateQuotaHook = useCreditCalculator;

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    let tasa = data.tasa || TASA_BASE
    let monto = data.monto

    if (data.tipoTasa === "Efectiva Anual") {
      tasa = changeTasa(tasa)
    }

    const tasaFinal = data.seguroDeVida === "true" ? tasa + 0.05 : tasa

    const calculateQuota = calculateQuotaHook(data.monto, tasaFinal, data.cuotas)

    const { quota, total } = calculateQuota()

    if (data.abonoCapital) {
      const { remainingMonths, newTotal, savedMoney, lastQuota } = calculateRemainingMonths(
        data.monto,
        data.abonoCapital,
        tasaFinal,
        Number(quota),
        data.cuotas
      )

      monto = data.monto - data.abonoCapital

      setResult({
        quota,
        total,
        tasa: Number(tasaFinal.toFixed(2)),
        remainingMonths,
        abonoCapital: data.abonoCapital,
        newTotal,
        savedMoney,
        lastQuota,
        monto
      })
    } else {
      setResult({
        quota, total, tasa: Number(tasaFinal.toFixed(2)), monto, remainingMonths: 0, abonoCapital: 0, newTotal: "", savedMoney: "", lastQuota: ""
      })
    }

  }

  return (
    <div className='container'>
      <h1 className='title'>Simulador de cuotas</h1>
      <p className='description'>Simula tus cuotas de crédito con un seguro de vida opcional del 0.05%</p>

      <form onSubmit={handleSubmit(onSubmit)} className='form'>
        <div className='row'>
          <label className='label'>
            Monto a Solicitar
            <input
              type="number"
              className='input-monto'
              aria-label='Monto a Solicitar'
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
              {...register("monto", { valueAsNumber: true, required: true })}
            />
          </label>

          <label className='label'>
            Cantidad de cuotas
            <input
              type="number"
              className='input-monto'
              aria-label='Cantidad de cuotas'
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
              {...register("cuotas", { valueAsNumber: true, required: true })}
            />
          </label>

          <div className='seguro'>
            <p>¿Agregar seguro de vida?</p>

            <div className='seguro-options'>
              <label className='label-row'>
                Si
                <input type="radio" value="true" defaultChecked {...register("seguroDeVida")} />
              </label>

              <label className='label-row'>
                No
                <input type="radio" value="false" {...register("seguroDeVida")} />
              </label>
            </div>
          </div>
        </div>

        <div className='row'>
          <label className='label'>
            Tasa de Interes
            <input
              type="number"
              step="any"
              className='input-monto'
              aria-label='Tasa de Interes'
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
              {...register("tasa", { valueAsNumber: true, required: true })}
            />
          </label>
          <div className='seguro'>
            <p>Tipo de tasa</p>

            <div className='seguro-options'>
              <label className='label-row'>
                Efectiva Anual
                <input type="radio" value="Efectiva Anual" defaultChecked {...register("tipoTasa")} />
              </label>

              <label className='label-row'>
                Efectiva Mensual
                <input type="radio" value="Efectiva Mensual" {...register("tipoTasa")} />
              </label>
            </div>
          </div>
        </div>

        <div className='row'>
          <label className='label'>
            Abono a Capital
            <input
              type="number"
              step="any"
              className='input-monto'
              aria-label='Abono a Capital'
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
              {...register("abonoCapital", { valueAsNumber: true, required: false })}
            />
          </label>

          <button
            type="submit"
            className='button'
            disabled={!watch("monto") || !watch("cuotas") || !watch("tasa")}
          >
            Calcular
          </button>
        </div>
      </form>

      {result.quota && (
        <div className='result-container'>
          <p><b>Tasa de Interes Efectiva Mensual:</b> <span>{result.tasa}%</span></p>
          <p><b>Cuota Mensual:</b> <span>{formatPrice(Number(result.quota))}</span></p>
          <p><b>Total a Pagar:</b> <span style={{ color: "blue", backgroundColor: "#e3f2fdff" }}>{formatPrice(Number(result.total))}</span></p>

          {result.remainingMonths > 0 && (
            <>
              <p style={{ borderTop: "1px solid #878787ff", marginTop: "1rem", paddingTop: "1rem" }}>
                <b>Abono a Capital:</b> <span>{formatPrice(Number(result.abonoCapital))}</span>
              </p>
              <p>
                <b>Meses Restantes:</b> <span>{result.remainingMonths}</span>
              </p>
              <p>
                <b>Nuevo Total a Pagar:</b> <span style={{ color: "blue", backgroundColor: "#e3f2fdff" }}>{formatPrice(Number(result.newTotal))}</span>
              </p>
              {Number(result.lastQuota) > 0 && (
                <p>
                  <b>Ultima Cuota:
                    <span className='info-icon' title="Debido a que el tiempo resultante de un abono a capital no suele ser un número entero exacto, el modelo financiero ajusta la última cuota para saldar el remanente de capital e intereses, evitando así un saldo negativo o un cobro excesivo al usuario.">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path fill="#000000" fill-rule="evenodd" d="M256 42.667C138.18 42.667 42.667 138.179 42.667 256c0 117.82 95.513 213.334 213.333 213.334c117.822 0 213.334-95.513 213.334-213.334S373.822 42.667 256 42.667m0 384c-94.105 0-170.666-76.561-170.666-170.667S161.894 85.334 256 85.334c94.107 0 170.667 76.56 170.667 170.666S350.107 426.667 256 426.667m26.714-256c0 15.468-11.262 26.667-26.497 26.667c-15.851 0-26.837-11.2-26.837-26.963c0-15.15 11.283-26.37 26.837-26.37c15.235 0 26.497 11.22 26.497 26.666m-48 64h42.666v128h-42.666z"/></svg>
                    </span>
                  </b> <span>{formatPrice(Number(result.lastQuota))}</span>
                </p>
              )}
              <p style={{ marginTop: "1rem" }}>
                <b>Dinero Ahorrado:</b> <span style={{ color: "green", backgroundColor: "#e8f5e9ff" }}>{formatPrice(Number(result.savedMoney))}</span>
              </p>
            </>
          )}
        </div>
      )}

      {result.quota && (<AmortizationTable tasa={result.tasa} cuota={Number(result.quota)} monto={result.monto} />)}
    </div>
  )
}
