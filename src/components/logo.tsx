export default function Logo({ className = "h-8 w-8", textClassName = "text-xl" }: { className?: string, textClassName?: string }) {
  return (
    <div className="flex items-center gap-2">
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Box shape */}
        <path
          d="M20 35 L50 20 L80 35 V70 L50 85 L20 70 Z"
          fill="currentColor"
          className="text-primary"
          fillOpacity="0.2"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        {/* Inner box lines */}
        <path
          d="M20 35 L50 50 L80 35 M50 50 V85"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Speed lines */}
        <path
          d="M85 30 H95 M85 50 H100 M85 70 H95"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          className="text-primary"
        />
      </svg>
      <span className={`font-bold tracking-tight ${textClassName}`}>
        Olamil<span className="text-primary">LogiSwift</span>
      </span>
    </div>
  )
}
