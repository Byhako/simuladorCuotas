export const formatPrice = (
  value: number,
): string => {
  try {
    const currencyFormatter = Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 2,
      style: 'currency',
      currency: 'COP',
    });

    return currencyFormatter.format(value)
  } catch (error) {
    console.error('Error al formatear el precio:', error)
    return '-'
  }
}
