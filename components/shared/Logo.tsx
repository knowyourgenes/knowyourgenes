export function KygLogo({ tone = 'dark', className }: { tone?: 'dark' | 'light'; className?: string }) {
  const wordmark = tone === 'light' ? '#FAF6EF' : '#0E4D4B';
  return (
    <svg viewBox="0 0 729.85 318.67" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <g fill="none" stroke={wordmark} strokeWidth="19.02" strokeLinecap="round" strokeMiterlimit="10">
        <line x1="50.72" y1="9.51" x2="50.72" y2="189.61" />
        <line x1="52" y1="149.3" x2="189.75" y2="11.55" />
        <path
          d="M498.81,134.54c5.95,5.16,8.39,7.43,12.15,11.07,34.34,33.36,54.01,44.25,88.7,44.25s79.48-22.74,79.48-79.38h-67.62"
          strokeLinejoin="round"
        />
        <path d="M108.12,93.18s71.37,96.68,125.89,96.42c73.12,6.82,108.45-122.98,167.32-118.02,0,0,18.34-.86,39.63,14.94" />
        <line x1="311.72" y1="87.39" x2="240.72" y2="17.42" />
        <path d="M667.76,55.12c-20.55-36.18-55.34-43.57-75.17-43.57s-57.14.73-100.21,66.89c-43.07,66.16-62.99,79.76-90.19,79.76-22.09,0-37.94-19.14-37.94-19.14" />
      </g>
      <g stroke="#25B5AB" strokeLinecap="round" strokeMiterlimit="10" fill="none">
        <line x1="402.82" y1="139.05" x2="402.82" y2="93.36" strokeWidth="9.44" />
        <line x1="423.01" y1="129.68" x2="423.01" y2="102.73" strokeWidth="7.55" />
        <line x1="382.29" y1="129.68" x2="382.29" y2="102.73" strokeWidth="7.55" />
      </g>
      <text
        fill={wordmark}
        fontSize="96.98"
        fontFamily="Figtree, sans-serif"
        fontWeight="700"
        transform="translate(0 297.34)"
      >
        <tspan x="0" y="0">
          K
        </tspan>
        <tspan x="63.91" y="0">
          n
        </tspan>
        <tspan x="118.99" y="0" fontWeight="400">
          o
        </tspan>
        <tspan x="173.2" y="0">
          w
        </tspan>
        <tspan x="254.18" y="0" fontWeight="400">
          Y
        </tspan>
        <tspan x="306.94" y="0" fontWeight="400">
          our
        </tspan>
        <tspan x="450.07" y="0">
          Genes
        </tspan>
      </text>
    </svg>
  );
}
