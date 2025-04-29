import React from 'react';

interface LoaderProps {
  label: string;
  size?: number;
}

const Loader = ({ label, size = 4 }: LoaderProps) => {
  const spinnerSize = `h-${size} w-${size}`;

  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <svg
        className={`animate-spin ${spinnerSize} text-white`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
        />
      </svg>
      {label}
    </span>
  );
};

export default Loader;
