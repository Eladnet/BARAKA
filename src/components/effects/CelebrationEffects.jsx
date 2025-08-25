import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export const useConfetti = () => {
  const fireConfetti = (options = {}) => {
    const defaults = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b']
    };
    
    confetti({ ...defaults, ...options });
  };

  const fireSuccess = () => {
    fireConfetti({
      particleCount: 150,
      spread: 90,
      shapes: ['star'],
      colors: ['#10b981', '#34d399', '#6ee7b7']
    });
  };

  const fireVIP = () => {
    fireConfetti({
      particleCount: 200,
      spread: 100,
      shapes: ['star', 'circle'],
      colors: ['#d4af37', '#f59e0b', '#fbbf24', '#fcd34d']
    });
  };

  const fireConversion = () => {
    // Multiple bursts for conversion celebration
    setTimeout(() => fireConfetti({ origin: { x: 0.1, y: 0.6 } }), 0);
    setTimeout(() => fireConfetti({ origin: { x: 0.9, y: 0.6 } }), 200);
    setTimeout(() => fireConfetti({ origin: { x: 0.5, y: 0.4 } }), 400);
  };

  return { fireConfetti, fireSuccess, fireVIP, fireConversion };
};

export const VIPGlow = ({ children, isVIP = false, intensity = 'medium' }) => {
  const glowClasses = {
    low: 'shadow-lg shadow-yellow-500/20',
    medium: 'shadow-xl shadow-yellow-500/30 animate-pulse',
    high: 'shadow-2xl shadow-yellow-500/50 animate-pulse'
  };

  if (!isVIP) return children;

  return (
    <div className={`relative ${glowClasses[intensity]}`}>
      {children}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-lg pointer-events-none" />
    </div>
  );
};

export const FloatingNotification = ({ message, type = 'success', onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: 'bg-green-500/90 text-white',
    vip: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black',
    conversion: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    warning: 'bg-yellow-500/90 text-black'
  };

  return (
    <div
      className={`fixed top-20 right-6 p-4 rounded-lg shadow-lg backdrop-blur-sm z-50 transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } ${typeStyles[type]}`}
    >
      <div className="flex items-center gap-3">
        {type === 'success' && <span className="text-2xl">🎉</span>}
        {type === 'vip' && <span className="text-2xl">👑</span>}
        {type === 'conversion' && <span className="text-2xl">💰</span>}
        {type === 'warning' && <span className="text-2xl">⚠️</span>}
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export const PulsingDot = ({ color = 'green', size = 'sm' }) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const colorClasses = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="relative flex items-center">
      <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-ping absolute`} />
      <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full`} />
    </div>
  );
};