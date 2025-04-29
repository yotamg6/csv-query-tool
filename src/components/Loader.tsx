'use client';

import React from 'react';
import { ClipLoader } from 'react-spinners';

interface LoaderProps {
  label: string;
}

const Loader = ({ label }: LoaderProps) => {
  return (
    <div className="flex items-center gap-2 text-blue-600 font-medium">
      <ClipLoader size={20} color="#3b82f6" />
      <span>{label}</span>
    </div>
  );
};

export default Loader;
