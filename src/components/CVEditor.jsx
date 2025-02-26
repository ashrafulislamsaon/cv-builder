// components/CVEditor.jsx
import React, { useState, useEffect } from 'react';

const CVEditor = ({ section, onUpdate, onCancel }) => {
  const [editedSection, setEditedSection] = useState({ ...section });
  const [isDirty, setIsDirty] = useState(false);

  // Reset editor when section changes
  useEffect(() => {
    setEditedSection({ ...section });
    setIsDirty(false);
  }, [section]);

  const handleTextChange = (e) => {
    setIsDirty(true);
    setEditedSection({
      ...editedSection,
      title: e.target.name === 'title' ? e.target.value : editedSection.title,
      content: e.target.name === 'content' ? e.target.value : editedSection.content
    });
  };

  const handlePersonalInfoChange = (e) => {
    setIsDirty(true);
    setEditedSection({
      ...editedSection,
      content: {
        ...editedSection.content,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleListItemChange = (index, field, value) => {
    setIsDirty(true);
    const updatedContent = [...editedSection.content];
    updatedContent[index] = {
      ...updatedContent[index],
      [field]: value
    };

    setEditedSection({
      ...editedSection,
      content: updatedContent
    });
  };

  const handleAddListItem = () => {
    setIsDirty(true);
    const newItem = {};
    
    // Determine fields based on section type
    if (editedSection.id === 'education') {
      newItem.title = '';
      newItem.institution = '';
      newItem.period = '';
      newItem.description = '';
    } else {
      newItem.title = '';
      newItem.company = '';
      newItem.period = '';
      newItem.description = '';
    }
    
    setEditedSection({
      ...editedSection,
      content: [...editedSection.content, newItem]
    });
  };

  const handleRemoveListItem = (index) => {
    setIsDirty(true);
    setEditedSection({
      ...editedSection,
      content: editedSection.content.filter((_, i) => i !== index)
    });
  };

  const handleTagsChange = (e) => {
    setIsDirty(true);
    const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    setEditedSection({
      ...editedSection,
      content: tagsArray
    });
  };

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editedSection);
    setIsDirty(false);
  };

  const renderEditor = () => {
    switch (editedSection.type) {
      case 'personal':
        return (
          <>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={editedSection.content.name || ''}
                onChange={handlePersonalInfoChange}
                className="form-input"
                placeholder="Your full name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={editedSection.content.email || ''}
                onChange={handlePersonalInfoChange}
                className="form-input"
                placeholder="your.email@example.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="text"
                name="phone"
                value={editedSection.content.phone || ''}
                onChange={handlePersonalInfoChange}
                className="form-input"
                placeholder="(123) 456-7890"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="address"
                value={editedSection.content.address || ''}
                onChange={handlePersonalInfoChange}
                className="form-input"
                placeholder="City, State, Country"
              />
            </div>
          </>
        );
      case 'text':
        return (
          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              name="content"
              value={editedSection.content || ''}
              onChange={handleTextChange}
              className="form-textarea"
              placeholder="Enter your content here..."
              rows="5"
            />
          </div>
        );
      case 'list':
        return (
          <>
            {editedSection.content.map((item, index) => (
              <div key={index} className="form-group list-item-editor">
                <div className="list-item-header">
                  <div className="form-label">Item {index + 1}</div>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveListItem(index)}
                    className="delete-button"
                    disabled={editedSection.content.length <= 1}
                  >
                    Remove
                  </button>
                </div>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    value={item.title || ''}
                    onChange={(e) => handleListItemChange(index, 'title', e.target.value)}
                    className="form-input"
                    placeholder="Position title or degree"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    {editedSection.id === 'education' ? 'Institution' : 'Company'}
                  </label>
                  <input
                    type="text"
                    value={item.company || item.institution || ''}
                    onChange={(e) => handleListItemChange(index, editedSection.id === 'education' ? 'institution' : 'company', e.target.value)}
                    className="form-input"
                    placeholder={editedSection.id === 'education' ? 'University or School' : 'Company name'}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Period</label>
                  <input
                    type="text"
                    value={item.period || ''}
                    onChange={(e) => handleListItemChange(index, 'period', e.target.value)}
                    className="form-input"
                    placeholder="e.g., 2020-Present or Jan 2020 - Dec 2022"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    value={item.description || ''}
                    onChange={(e) => handleListItemChange(index, 'description', e.target.value)}
                    className="form-textarea"
                    placeholder="Describe your responsibilities, achievements, or qualifications"
                    rows="3"
                  />
                </div>
              </div>
            ))}
            <button 
              type="button" 
              onClick={handleAddListItem}
              className="add-button"
            >
              Add Item
            </button>
          </>
        );
      case 'tags':
        return (
          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input
              type="text"
              value={editedSection.content.join(', ')}
              onChange={handleTagsChange}
              className="form-input"
              placeholder="JavaScript, React, CSS, etc."
            />
            <div className="form-help">Enter skills or keywords separated by commas</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Section Title</label>
        <input
          type="text"
          name="title"
          value={editedSection.title}
          onChange={handleTextChange}
          className="form-input"
          placeholder="e.g., Work Experience, Education, Skills"
        />
      </div>
      
      {renderEditor()}
      
      <div className="form-actions">
        <button type="button" onClick={handleCancel} className="cancel-button">
          Cancel
        </button>
        <button 
          type="submit" 
          className="save-button"
          disabled={!isDirty}
        >
          {isDirty ? 'Save Changes' : 'Saved'}
        </button>
      </div>
    </form>
  );
};

export default CVEditor;