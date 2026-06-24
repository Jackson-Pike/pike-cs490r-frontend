/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useLayoutEffect } from 'react'

export const ThemeContext = createContext(null)

export const THEMES = [
  { id: 'dark-cinema',       label: 'Dark Cinema',       swatch: '#00ff85', bg: '#121212' },
  { id: 'vintage-hollywood', label: 'Vintage Hollywood', swatch: '#c9a84c', bg: '#f5f0e8' },
  { id: 'streaming-service', label: 'Streaming Service', swatch: '#e50914', bg: '#0a0a0a' },
  { id: 'retro-vhs',         label: 'Retro VHS',         swatch: '#00f5e4', bg: '#0d0015' },
  { id: 'clean-light',       label: 'Clean Light',       swatch: '#6366f1', bg: '#ffffff' },
]

const FONT_URLS = {
  'dark-cinema':       null,
  'vintage-hollywood': 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=Lora:wght@400;600&display=swap',
  'streaming-service': 'https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;600&display=swap',
  'retro-vhs':         'https://fonts.googleapis.com/css2?family=VT323&family=Share+Tech+Mono&display=swap',
  'clean-light':       'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap',
}

function injectFonts(themeId) {
  const url = FONT_URLS[themeId]
  let link = document.getElementById('theme-fonts')

  if (!url) {
    if (link) link.remove()
    return
  }

  if (!link) {
    link = document.createElement('link')
    link.id = 'theme-fonts'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }

  link.href = url
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('dark-cinema')

  useLayoutEffect(() => {
    const saved = localStorage.getItem('theme') ?? 'dark-cinema'
    document.documentElement.dataset.theme = saved
    injectFonts(saved)
    setThemeState(saved) // eslint-disable-line react-hooks/set-state-in-effect
  }, [])

  function setTheme(id) {
    function apply() {
      document.documentElement.dataset.theme = id
      injectFonts(id)
      localStorage.setItem('theme', id)
      setThemeState(id)
    }

    if (document.startViewTransition) {
      document.startViewTransition(apply)
    } else {
      apply()
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}
