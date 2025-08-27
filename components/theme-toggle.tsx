'use client'

import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <motion.button
      onClick={toggleTheme}
      className="
        relative p-3 rounded-full 
        bg-[var(--surface)] hover:bg-[var(--surface-hover)]
        border border-[var(--border)]
        shadow-[var(--shadow-sm)]
        transition-colors duration-[var(--duration-normal)]
      "
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {theme === 'light' ? (
          <Sun className="w-5 h-5 text-[var(--foreground)]" />
        ) : (
          <Moon className="w-5 h-5 text-[var(--foreground)]" />
        )}
      </motion.div>
    </motion.button>
  )
}