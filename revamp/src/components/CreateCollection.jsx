import { useState } from 'react'
import { X, Plus, Link, Share2, Copy, Check } from 'lucide-react'
import './CreateCollection.css'

const CreateCollection = ({ isOpen, onClose, projects = [] }) => {
  const [selectedProjects, setSelectedProjects] = useState([])
  const [collectionName, setCollectionName] = useState('')
  const [collectionDescription, setCollectionDescription] = useState('')
  const [shareLink, setShareLink] = useState('')
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleProjectToggle = (project) => {
    setSelectedProjects(prev => 
      prev.find(p => p.id === project.id)
        ? prev.filter(p => p.id !== project.id)
        : [...prev, project]
    )
  }

  const handleCreateCollection = () => {
    if (selectedProjects.length === 0 || !collectionName.trim()) return
    
    // Generate share link (in real app, this would be sent to backend)
    const link = `${window.location.origin}/collection/${Date.now()}`
    setShareLink(link)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const handleClose = () => {
    setSelectedProjects([])
    setCollectionName('')
    setCollectionDescription('')
    setShareLink('')
    setCopied(false)
    onClose()
  }

  return (
    <div className="create-collection-overlay" onClick={handleClose}>
      <div className="create-collection-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>Create Collection</h2>
          <button className="close-btn" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        {!shareLink ? (
          <>
            {/* Collection Details */}
            <div className="collection-form">
              <div className="form-group">
                <label>Collection Name</label>
                <input
                  type="text"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  placeholder="e.g., Frontend Showcase, AI Projects"
                  maxLength={50}
                />
              </div>
              
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  value={collectionDescription}
                  onChange={(e) => setCollectionDescription(e.target.value)}
                  placeholder="Brief description of this collection..."
                  maxLength={200}
                  rows={3}
                />
              </div>
            </div>

            {/* Project Selection */}
            <div className="project-selection">
              <h3>Select Projects ({selectedProjects.length}/5)</h3>
              <div className="projects-grid">
                {projects.slice(0, 12).map((project) => (
                  <div
                    key={project.id}
                    className={`project-option ${selectedProjects.find(p => p.id === project.id) ? 'selected' : ''}`}
                    onClick={() => handleProjectToggle(project)}
                  >
                    <div className="project-image">
                      <img src={project.image} alt={project.title} />
                      <div className="selection-indicator">
                        {selectedProjects.find(p => p.id === project.id) ? (
                          <Check size={16} />
                        ) : (
                          <Plus size={16} />
                        )}
                      </div>
                    </div>
                    <div className="project-details">
                      <h4>{project.title}</h4>
                      <p>{project.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleCreateCollection}
                disabled={selectedProjects.length === 0 || !collectionName.trim()}
              >
                <Plus size={16} />
                Create Collection
              </button>
            </div>
          </>
        ) : (
          /* Share Link */
          <div className="share-section">
            <div className="success-icon">
              <Check size={48} />
            </div>
            <h3>Collection Created!</h3>
            <p>Share this link to showcase your curated projects:</p>
            
            <div className="share-link-container">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="share-link-input"
              />
              <button 
                className="copy-btn"
                onClick={handleCopyLink}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="share-actions">
              <button className="btn-secondary" onClick={handleClose}>
                Close
              </button>
              <button 
                className="btn-primary"
                onClick={() => window.open(shareLink, '_blank')}
              >
                <Share2 size={16} />
                Open Collection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateCollection
