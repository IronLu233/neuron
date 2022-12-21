import Base from './base'
import CkbIndexerMonitor from './ckb-indexer-monitor'
import CkbMonitor from './ckb-monitor'

const monitors: Base[] = []

export default function startMonitor(name?: string, startNow?: boolean) {
  if (!monitors.length) {
    monitors.push(new CkbIndexerMonitor(), new CkbMonitor())
  }
  monitors
    .filter(v => !name || v.name === name)
    .forEach((v: Base) => {
      v.startMonitor(undefined, startNow)
    })
}

export async function stopMonitor(name?: string) {
  await Promise.all(
    monitors
      .filter(v => !name || v.name === name)
      .map(v => {
        v.clearMonitor()
        return v.stop()
      })
  )
}