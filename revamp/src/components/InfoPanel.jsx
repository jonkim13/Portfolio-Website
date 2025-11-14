import { useState, useEffect } from 'react'
import { X, Play, Heart, MoreHorizontal, ExternalLink, Github, Calendar, Code, Star, ArrowRight } from 'lucide-react'
import './InfoPanel.css'

const InfoPanel = ({ isOpen, onClose, project, category }) => {
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const displayData = project || {
    title: `${category} Projects`,
    description: `Explore all ${category.toLowerCase()} projects in my portfolio`,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    technologies: category === 'All' ? ['React', 'Node.js', 'Python', 'AI/ML'] : 
                 category === 'Web' ? ['React', 'Vue.js', 'JavaScript', 'CSS'] :
                 category === 'AI' ? ['Python', 'TensorFlow', 'OpenAI', 'ML'] :
                 ['Go', 'Docker', 'Kubernetes', 'APIs'],
    category: category,
    github: "https://github.com",
    live: "https://example.com",
    createdDate: "2024",
    status: "Completed",
    rating: 5
  }

  return (
    <div className={`info-panel-overlay ${isOpen ? 'open' : 'closed'}`}>
      <div className={`info-panel ${isOpen ? 'open' : 'closed'}`}>
        {/* Header */}
        <div className="panel-header">
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Hero Section */}
        <div className="panel-hero">
          <div className="hero-image">
            <img src={displayData.image} alt={displayData.title} />
            <div className="hero-overlay">
              <button 
                className="hero-play-btn"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                <Play size={24} fill="currentColor" />
              </button>
            </div>
          </div>
          
          <div className="hero-info">
            <div className="hero-badge">
              <span>{displayData.category}</span>
            </div>
            <h1>{displayData.title}</h1>
            <p className="hero-description">{displayData.description}</p>
            
            <div className="hero-actions">
              <button className="btn-primary hero-btn">
                <Play size={16} />
                <span>{project ? 'View Demo' : 'Explore Projects'}</span>
              </button>
              <button className="btn-secondary hero-btn">
                <Heart size={16} />
                <span>Like</span>
              </button>
              <button className="btn-secondary hero-btn">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="panel-content">
          {project && (
            <>
              {/* Tech Stack */}
              <div className="content-section">
                <h3>Technologies</h3>
                <div className="tech-stack">
                  {displayData.technologies.map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>

              {/* Project Info */}
              <div className="content-section">
                <h3>Project Details</h3>
                <div className="project-details">
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>Created: {displayData.createdDate}</span>
                  </div>
                  <div className="detail-item">
                    <Code size={16} />
                    <span>Status: {displayData.status}</span>
                  </div>
                  <div className="detail-item">
                    <Star size={16} />
                    <span>Rating: {displayData.rating}/5</span>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="content-section">
                <h3>Links</h3>
                <div className="project-links">
                  <a href={displayData.github} target="_blank" rel="noopener noreferrer" className="link-item">
                    <Github size={20} />
                    <div className="link-content">
                      <span className="link-title">GitHub Repository</span>
                      <span className="link-subtitle">View source code</span>
                    </div>
                    <ArrowRight size={16} className="arrow-right" />
                  </a>
                  <a href={displayData.live} target="_blank" rel="noopener noreferrer" className="link-item">
                    <ExternalLink size={20} />
                    <div className="link-content">
                      <span className="link-title">Live Demo</span>
                      <span className="link-subtitle">Try it yourself</span>
                    </div>
                    <ArrowRight size={16} className="arrow-right" />
                  </a>
                </div>
              </div>
            </>
          )}

          {!project && (
            <>
              {/* Category Overview */}
              <div className="content-section">
                <h3>About {category} Development</h3>
                <p className="category-description">
                  {category === 'All' && "A comprehensive collection of projects spanning web development, artificial intelligence, and backend systems. Each project represents a different aspect of modern software development."}
                  {category === 'Web' && "Frontend and full-stack web applications built with modern frameworks and best practices. Focus on user experience, performance, and responsive design."}
                  {category === 'AI' && "Machine learning and artificial intelligence projects exploring computer vision, natural language processing, and predictive analytics."}
                  {category === 'Backend' && "Scalable backend systems, APIs, and infrastructure projects built with microservices architecture and cloud technologies."}
                </p>
              </div>

              {/* Tech Stack */}
              <div className="content-section">
                <h3>Technologies Used</h3>
                <div className="tech-stack">
                  {displayData.technologies.map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default InfoPanel
