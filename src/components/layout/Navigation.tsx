import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface NavigationItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface NavigationProps {
  items: NavigationItem[];
}

export function Navigation({ items }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 bg-opacity-95 backdrop-blur-lg border-t border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative flex flex-col items-center justify-center w-16 h-16 ${
                  isActive ? 'text-blue-400' : 'text-gray-400'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navigation-indicator"
                    className="absolute inset-0 bg-gray-700 rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative">
                  <Icon className="w-6 h-6" />
                </span>
                <span className="relative text-xs mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}