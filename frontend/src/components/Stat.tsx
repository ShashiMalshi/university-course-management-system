import { ReactNode } from 'react'

export default function Stat({label, value, hint}: {label:string; value:ReactNode; hint?:string}){
  return (
    <div className="stat">
      <div className="label">{label}</div>
      <div className="value text-primary-700">{value}</div>
      {hint && <div className="muted text-xs mt-1">{hint}</div>}
    </div>
  )
}
