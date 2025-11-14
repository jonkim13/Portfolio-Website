import { createContext, useContext, useState } from 'react'

const ProjectContext = createContext()

export const useProject = () => {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}

export const ProjectProvider = ({ children }) => {
  const [currentProject, setCurrentProject] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [selectedTechStack, setSelectedTechStack] = useState([])
  const [theme, setTheme] = useState('dark')
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [panelContent, setPanelContent] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const nextProject = (projects) => {
    if (projects && projects.length > 0) {
      const nextIndex = (currentProjectIndex + 1) % projects.length
      setCurrentProjectIndex(nextIndex)
      setCurrentProject(projects[nextIndex])
    }
  }

  const previousProject = (projects) => {
    if (projects && projects.length > 0) {
      const prevIndex = currentProjectIndex === 0 ? projects.length - 1 : currentProjectIndex - 1
      setCurrentProjectIndex(prevIndex)
      setCurrentProject(projects[prevIndex])
    }
  }

  const playDemo = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleTechStack = (tech) => {
    setSelectedTechStack(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    )
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const openPanel = (content) => {
    setPanelContent(content)
    setIsPanelOpen(true)
  }

  const closePanel = () => {
    setIsPanelOpen(false)
    setPanelContent(null)
  }

  return (
    <ProjectContext.Provider value={{
      currentProject,
      setCurrentProject,
      isPlaying,
      setIsPlaying,
      currentProjectIndex,
      setCurrentProjectIndex,
      scrollProgress,
      setScrollProgress,
      selectedTechStack,
      setSelectedTechStack,
      theme,
      setTheme,
      isPanelOpen,
      panelContent,
      selectedCategory,
      setSelectedCategory,
      nextProject,
      previousProject,
      playDemo,
      toggleTechStack,
      toggleTheme,
      openPanel,
      closePanel
    }}>
      {children}
    </ProjectContext.Provider>
  )
}
