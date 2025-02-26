// App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { usePDF } from 'react-to-pdf';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import CVSection from './components/CVSection';
import CVEditor from './components/CVEditor';
import CVPreview from './components/CVPreview';
import ExportOptions from './components/ExportOptions';
import './styles.css'; // Import the custom CSS file

const App = () => {
  const [sections, setSections] = useState([
    { id: 'personal', type: 'personal', title: 'Personal Information', content: { name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', address: '123 Main St' } },
    { id: 'summary', type: 'text', title: 'Professional Summary', content: 'Experienced developer with a passion for building user-friendly applications.' },
    {
      id: 'experience', type: 'list', title: 'Work Experience', content: [
        { title: 'Software Developer', company: 'Tech Co', period: '2020-Present', description: 'Developed web applications using React.' },
        { title: 'Junior Developer', company: 'Startup Inc', period: '2018-2020', description: 'Assisted in the development of mobile applications.' }
      ]
    },
    {
      id: 'education', type: 'list', title: 'Education', content: [
        { title: 'Bachelor of Science in Computer Science', institution: 'University', period: '2014-2018', description: 'GPA: 3.8/4.0' }
      ]
    },
    { id: 'skills', type: 'tags', title: 'Skills', content: ['JavaScript', 'React', 'Node.js', 'CSS', 'HTML'] }
  ]);

  const [activeId, setActiveId] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const [activeTab, setActiveTab] = useState('editor');
  const [isDragging, setIsDragging] = useState(false);

  const [showExportOptions, setShowExportOptions] = useState(false);
  // Add state for PDF options
  const [pdfOptions, setPdfOptions] = useState({
    filename: 'my-cv.pdf',
    format: 'A4',
    margins: '10mm'
  });
  
  // Use the usePDF hook with dynamic options
  const { toPDF, targetRef } = usePDF({
    filename: pdfOptions.filename,
    page: {
      margin: pdfOptions.margins,
      format: pdfOptions.format,
    },
    canvas: {
      scale: 2,
      useCORS: true
    }
  });
  const pdfRef = useRef(null);

  // Automatically switch to editor tab when selecting a section to edit
  useEffect(() => {
    if (currentSection) {
      setActiveTab('editor');
    }
  }, [currentSection]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Increase activation constraint to avoid accidental drags
      activationConstraint: {
        distance: 8, // 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    setIsDragging(true);

    // Add dragging class to the active element
    const element = document.getElementById(event.active.id);
    if (element) {
      element.classList.add('dragging');
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSections((sections) => {
        const oldIndex = sections.findIndex((section) => section.id === active.id);
        const newIndex = sections.findIndex((section) => section.id === over.id);

        return arrayMove(sections, oldIndex, newIndex);
      });
    }

    // Remove dragging class
    const element = document.getElementById(active.id);
    if (element) {
      element.classList.remove('dragging');
    }

    setActiveId(null);
    setIsDragging(false);
  };

  const handleAddSection = (type) => {
    const newId = `section-${Date.now()}`;
    let newSection;

    switch (type) {
      case 'text':
        newSection = { id: newId, type: 'text', title: 'New Text Section', content: 'Click to edit this text.' };
        break;
      case 'list':
        newSection = { id: newId, type: 'list', title: 'New List Section', content: [{ title: 'New Item', description: 'Description' }] };
        break;
      case 'tags':
        newSection = { id: newId, type: 'tags', title: 'New Tags Section', content: ['Tag 1', 'Tag 2'] };
        break;
      default:
        return;
    }

    setSections([...sections, newSection]);

    // Auto-select the new section for editing
    setCurrentSection(newSection);
    setActiveTab('editor');
  };

  const handleEditSection = (id) => {
    const section = sections.find(section => section.id === id);
    if (section) {
      setCurrentSection(section);
      setActiveTab('editor');
    }
  };

  const handleUpdateSection = (updatedSection) => {
    setSections(sections.map(section =>
      section.id === updatedSection.id ? updatedSection : section
    ));
    setCurrentSection(null);
  };

  const handleDeleteSection = (id) => {
    // Show confirmation dialog
    if (window.confirm(`Are you sure you want to delete "${sections.find(s => s.id === id)?.title}"?`)) {
      setSections(sections.filter(section => section.id !== id));

      // Clear current section if it's the one being deleted
      if (currentSection && currentSection.id === id) {
        setCurrentSection(null);
      }
    }
  };

  const handleExportPDF = async (options = {}) => {
    try {
      const exportButton = document.querySelector('.export-button');
      if (exportButton) {
        exportButton.textContent = 'Generating...';
        exportButton.disabled = true;
      }
      
      // Update PDF options
      if (Object.keys(options).length > 0) {
        setPdfOptions({
          filename: options.filename,
          format: options.format,
          margins: options.margins
        });
      }
      
      // Generate and download the PDF
      await toPDF();
      
      setShowExportOptions(false);
      alert('CV exported successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      const exportButton = document.querySelector('.export-button');
      if (exportButton) {
        exportButton.textContent = 'Export PDF';
        exportButton.disabled = false;
      }
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="header-title">Drag & Drop CV Builder</h1>
      </header>

      <div className="main-content">
        <div className="sections-panel">
          <h2 className="sections-title">Sections</h2>
          <div className="button-group">
            <button
              onClick={() => handleAddSection('text')}
              className="add-button"
            >
              Add Text
            </button>
            <button
              onClick={() => handleAddSection('list')}
              className="add-button"
            >
              Add List
            </button>
            <button
              onClick={() => handleAddSection('tags')}
              className="add-button"
            >
              Add Tags
            </button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map(section => section.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="section-list">
                {sections.map((section) => (
                  <CVSection
                    key={section.id}
                    id={section.id}
                    title={section.title}
                    onEdit={() => handleEditSection(section.id)}
                    onDelete={() => handleDeleteSection(section.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="editor-panel">
          <div className="tab-navigation">
            <button
              className={`tab-button ${activeTab === 'editor' ? 'active' : ''}`}
              onClick={() => setActiveTab('editor')}
            >
              Editor
            </button>
            <button
              className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </button>
          </div>

          {activeTab === 'editor' ? (
            currentSection ? (
              <CVEditor
                section={currentSection}
                onUpdate={handleUpdateSection}
                onCancel={() => setCurrentSection(null)}
              />
            ) : (
              <div className="editor-empty">
                Select a section to edit or add a new section
              </div>
            )
          ) : (
            <div>
              <div className="preview-actions">
                <button 
                  onClick={() => setShowExportOptions(true)}
                  className="export-button"
                >
                  Export PDF
                </button>
              </div>
              
              {/* Add the export options dialog */}
              {showExportOptions && (
                <ExportOptions 
                  onExport={handleExportPDF}
                  onCancel={() => setShowExportOptions(false)}
                />
              )}
              
              {/* Use the ref from usePDF */}
              <div ref={targetRef}>
                <CVPreview sections={sections} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;