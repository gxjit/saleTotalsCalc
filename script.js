const DEFAULTS = {
  minsWorked: 15,
  hourlyRate: 108,
  gstRate: 5,
  pstRate: 6,
  productCharge: 0,
}

const roundToTwo = (n) => Math.round(n * 100) / 100
const byPercentage = (n) => n / 100
const getLocalParam = (str) => parseFloat(localStorage.getItem(str)) || null
const objFilterNull = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null))

function calcTotals(minsWorked, hourlyRate, gstRate, pstRate, productCharge) {
  const ratePerMin = hourlyRate / 60
  const serviceCharge = ratePerMin * minsWorked
  const subTotal = serviceCharge + productCharge
  const gst = roundToTwo(subTotal * byPercentage(gstRate))
  const pst = roundToTwo(subTotal * byPercentage(pstRate))
  const total = roundToTwo(subTotal + gst + pst)

  return { serviceCharge, subTotal, gst, pst, total }
}

function setLocalParams(hourlyRate, gstRate, pstRate) {
  localStorage.setItem('hourlyRate', hourlyRate)
  localStorage.setItem('gstRate', gstRate)
  localStorage.setItem('pstRate', pstRate)
}

function getLocalParams() {
  return {
    hourlyRate: getLocalParam('hourlyRate'),
    gstRate: getLocalParam('gstRate'),
    pstRate: getLocalParam('pstRate'),
  }
}

document.addEventListener('alpine:init', () => {
  Alpine.data('calc', () => ({
    ...DEFAULTS,
    serviceCharge: 0,
    subTotal: 0,
    gst: 0,
    pst: 0,
    total: 0,

    init() {
      Object.assign(this, objFilterNull(getLocalParams()))
    },

    setParams() {
      setLocalParams(this.hourlyRate, this.gstRate, this.pstRate)
    },

    calc() {
      const totals = calcTotals(
        this.minsWorked,
        this.hourlyRate,
        this.gstRate,
        this.pstRate,
        this.productCharge
      )
      Object.assign(this, totals)
    },
  }))
})
