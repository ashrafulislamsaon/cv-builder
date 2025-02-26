import React, { useState } from 'react';

const ExportOptions = ({ onExport, onCancel }) => {
  const [filename, setFilename] = useState('my-cv');
  const [format, setFormat] = useState('A4');
  const [margins, setMargins] = useState(10); // mm
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Call parent's export function with the options
      await onExport({
        filename: filename.endsWith('.pdf') ? filename : `${filename}.pdf`,
        format,
        margins: `${margins}mm`,
      });
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="export-options-overlay">
      <div className="export-options-container">
        <h3>Export CV as PDF</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="filename">Filename</label>
            <input
              type="text"
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="my-cv.pdf"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="format">Page Format</label>
            <select
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="form-select"
            >
              <option value="A4">A4</option>
              <option value="letter">US Letter</option>
              <option value="legal">Legal</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="margins">Margins (mm)</label>
            <input
              type="number"
              id="margins"
              min="0"
              max="50"
              value={margins}
              onChange={(e) => setMargins(parseInt(e.target.value))}
              className="form-input"
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="button"
              onClick={onCancel}
              className="cancel-button"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="export-button"
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Export PDF'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExportOptions;