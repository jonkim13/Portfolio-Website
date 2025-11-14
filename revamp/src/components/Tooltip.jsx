import { useState, useRef, useEffect } from 'react'
import './Tooltip.css'

const Tooltip = ({ children, content, delay = 500, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef(null)
  const timeoutRef = useRef(null)

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        const tooltipWidth = 200 // Approximate tooltip width
        const tooltipHeight = 40 // Approximate tooltip height
        
        let top = 0
        let left = 0
        
        switch (position) {
          case 'top':
            top = rect.top - tooltipHeight - 8
            left = rect.left + (rect.width / 2) - (tooltipWidth / 2)
            break
          case 'bottom':
            top = rect.bottom + 8
            left = rect.left + (rect.width / 2) - (tooltipWidth / 2)
            break
          case 'left':
            top = rect.top + (rect.height / 2) - (tooltipHeight / 2)
            left = rect.left - tooltipWidth - 8
            break
          case 'right':
            top = rect.top + (rect.height / 2) - (tooltipHeight / 2)
            left = rect.right + 8
            break
          default:
            top = rect.top - tooltipHeight - 8
            left = rect.left + (rect.width / 2) - (tooltipWidth / 2)
        }
        
        // Ensure tooltip stays within viewport
        left = Math.max(8, Math.min(left, window.innerWidth - tooltipWidth - 8))
        
        setTooltipPosition({ top, left })
        setIsVisible(true)
      }
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="tooltip-trigger"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`tooltip tooltip-${position}`}
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`
          }}
        >
          {content}
        </div>
      )}
    </>
  )
}

export default Tooltip
