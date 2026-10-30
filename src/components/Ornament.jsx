// The eight-point star (khatam) found across Emirati and wider Islamic
// architecture: two squares, one turned 45 degrees.
export function Star({ className = '', filled = true }) {
  return (
    <svg className={`star ${className}`} viewBox="-50 -50 100 100" aria-hidden="true">
      <g fill={filled ? 'currentColor' : 'none'} stroke={filled ? 'none' : 'currentColor'} strokeWidth="3">
        <rect x="-35" y="-35" width="70" height="70" />
        <rect x="-35" y="-35" width="70" height="70" transform="rotate(45)" />
      </g>
    </svg>
  )
}

// A faint lattice of the same star, like light through a mashrabiya screen.
export function Lattice({ className = '' }) {
  return (
    <svg className={`lattice ${className}`} aria-hidden="true">
      <defs>
        <pattern id="khatam" width="64" height="64" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1" transform="translate(32 32)">
            <rect x="-14" y="-14" width="28" height="28" />
            <rect x="-14" y="-14" width="28" height="28" transform="rotate(45)" />
            <path d="M-32 0 H-20 M20 0 H32 M0 -32 V-20 M0 20 V32" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#khatam)" />
    </svg>
  )
}

// The Dubai skyline as a single line drawing. Each landmark is its own path
// so they can draw in one after another.
export function Skyline({ className = '' }) {
  const paths = [
    // low-rise and towers, left
    'M0 200 H40 V150 H70 V170 H90 V120 H115 V200',
    // Emirates Towers: two slim towers with angled tops
    'M130 200 V70 L150 45 V200 M160 200 V90 L176 72 V200',
    'M190 200 V140 H215 V110 H235 V200 H260 V160 H290 V200',
    // Burj Khalifa: stepped, tapering, with a spire
    'M330 200 V150 H342 V112 H352 V80 H360 V52 H366 V28 L370 4 L374 28 V52 H380 V80 H388 V112 H398 V150 H410 V200',
    'M430 200 V130 H460 V100 H480 V200 H500 V150 H520 V200',
    // Museum of the Future: a torus on a green mound
    'M548 200 Q600 176 652 200 M562 182 C562 132, 638 132, 638 182 M578 178 C578 150, 622 150, 622 178',
    'M670 200 V120 H700 V90 H715 V200 H740 V140 H770 V200',
    // Burj Al Arab: the sail, with its mast
    'M800 200 V48 M800 56 C846 80, 876 140, 880 200 M800 92 H840 M800 130 H866',
    'M900 200 V160 H930 V130 H950 V200',
    // Ain Dubai: the wheel on its legs
    'M1040 120 m-62 0 a62 62 0 1 0 124 0 a62 62 0 1 0 -124 0 M1040 120 L1012 200 M1040 120 L1068 200 M978 120 H1102 M1040 58 V182 M996 76 L1084 164 M1084 76 L996 164',
    'M1120 200 V140 H1145 V110 H1165 V200 H1200',
  ]
  return (
    <svg className={`skyline ${className}`} viewBox="0 0 1200 204" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
        {paths.map((d, i) => <path key={i} d={d} pathLength="1" />)}
        <path d="M0 200 H1200" pathLength="1" />
      </g>
    </svg>
  )
}
