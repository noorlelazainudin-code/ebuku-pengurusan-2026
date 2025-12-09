import React from 'react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce">
      <div className="bg-[#C9B458] text-[#0B132B] px-6 py-3 rounded-lg shadow-lg font-semibold flex items-center gap-2">
        <span>✅</span>
        {toastMessage}
      </div>
    </div>
  );
};
