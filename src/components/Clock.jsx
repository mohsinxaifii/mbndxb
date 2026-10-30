import { useEffect, useState } from 'react'
import { site } from '../data/site.js'

const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: site.timezone, hour: '2-digit', minute: '2-digit', hour12: false })

export default function Clock({ prefix = site.city }) {
  const [now, setNow] = useState(() => fmt.format(new Date()))
  useEffect(() => {
    const id = setInterval(() => setNow(fmt.format(new Date())), 15000)
    return () => clearInterval(id)
  }, [])
  const [h, m] = now.split(':')
  return (
    <span className="clock mono">
      {prefix} {h}<span className="clock__colon">:</span>{m} GST
    </span>
  )
}
