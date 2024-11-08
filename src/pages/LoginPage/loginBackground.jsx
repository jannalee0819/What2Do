export const WorldMapBackground = () => (
  <svg
    className="absolute inset-0 w-full h-full"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 800"
    preserveAspectRatio="xMidYMid slice"
  >
    <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="#93C5FD" opacity="0.2" />
    </pattern>
    <rect width="100%" height="100%" fill="url(#dots)" />

    <path
      d="M100 300 C 300 250, 500 350, 700 300"
      stroke="#93C5FD"
      fill="none"
      strokeWidth="2"
      opacity="0.3"
    />
    <path
      d="M300 400 C 500 350, 700 450, 900 400"
      stroke="#93C5FD"
      fill="none"
      strokeWidth="2"
      opacity="0.3"
    />
    <path
      d="M500 200 C 700 150, 900 250, 1100 200"
      stroke="#93C5FD"
      fill="none"
      strokeWidth="2"
      opacity="0.3"
    />

    <circle cx="200" cy="300" r="4" fill="#60A5FA" opacity="0.5" />
    <circle cx="500" cy="250" r="4" fill="#60A5FA" opacity="0.5" />
    <circle cx="800" cy="350" r="4" fill="#60A5FA" opacity="0.5" />

    <path
      d="M200 300 Q 350 200 500 250"
      stroke="#60A5FA"
      strokeWidth="1"
      fill="none"
      opacity="0.3"
    />
    <path
      d="M500 250 Q 650 300 800 350"
      stroke="#60A5FA"
      strokeWidth="1"
      fill="none"
      opacity="0.3"
    />
  </svg>
);
