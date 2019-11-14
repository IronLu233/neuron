const YEAR = 365 * 24 * 60 * 60 * 1000
const BASE = 10000000

export default (compensation: string, amount: string, duration: string) => {
  const v = (BigInt(compensation) * BigInt(YEAR) * BigInt(BASE)) / (BigInt(amount) * BigInt(duration))
  return `${(Number(v) / (BASE / 100)).toFixed(2)}`
}
