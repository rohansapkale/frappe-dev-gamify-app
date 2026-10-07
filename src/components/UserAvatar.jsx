import React from 'react';

export default function UserAvatar({ avatar, size = 'md', className = '' }) {
  const isImage = typeof avatar === 'string' && (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('data:image'));

  const sizeClasses = {
    xs: 'w-5 h-5 text-xs',
    sm: 'w-7 h-7 text-sm',
    md: 'w-9 h-9 text-base',
    lg: 'w-12 h-12 text-2xl',
    xl: 'w-16 h-16 text-3xl'
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  if (isImage) {
    return (
      <img
        src={avatar}
        alt="User Avatar"
        className={`rounded-full object-cover shrink-0 border border-slate-700/60 shadow-xs ${selectedSize} ${className}`}
        onError={(e) => {
          // Fallback to emoji if Google image fails to load
          e.currentTarget.style.display = 'none';
          if (e.currentTarget.nextSibling) {
            e.currentTarget.nextSibling.style.display = 'inline-flex';
          }
        }}
      />
    );
  }

  return (
    <span className={`inline-flex items-center justify-center shrink-0 ${className}`}>
      {avatar || '👨‍💻'}
    </span>
  );
}
