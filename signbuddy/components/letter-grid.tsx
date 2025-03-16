import React from 'react';

interface LetterGridProps {
  completedLetters: string[];
  className?: string;
}

export function LetterGrid({ completedLetters, className = '' }: LetterGridProps) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
  
  return (
    <div className={`grid grid-cols-5 md:grid-cols-7 gap-2 ${className}`}>
      {alphabet.map((letter) => (
        <div
          key={letter}
          className={`
            aspect-square flex items-center justify-center rounded-lg border
            ${completedLetters.includes(letter)
              ? 'bg-green-500/20 border-green-500 text-green-300'
              : 'bg-gray-800 border-gray-700 text-gray-300'
            }
            font-bold text-xl md:text-2xl
            transition-colors duration-200
          `}
        >
          {letter}
        </div>
      ))}
    </div>
  );
} 