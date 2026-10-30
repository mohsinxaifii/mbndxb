// The UAE flag, drawn rather than an emoji (Windows shows flag emoji as letters).
export default function Flag({ className = '' }) {
  return (
    <svg className={`flag ${className}`} viewBox="0 0 12 6" role="img" aria-label="United Arab Emirates flag">
      <rect width="12" height="2" fill="#00732F" />
      <rect y="2" width="12" height="2" fill="#FFFFFF" />
      <rect y="4" width="12" height="2" fill="#000000" />
      <rect width="3" height="6" fill="#EF3340" />
    </svg>
  )
}
