// components/CVSection.jsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const CVSection = ({ id, title, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Prevent event propagation to avoid triggering drag when clicking buttons
  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit();
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="section-item"
      id={id}
    >
      <span className="section-item-title">{title}</span>
      <div className="section-actions">
        <button 
          onClick={handleEditClick}
          className="edit-button"
          aria-label="Edit section"
        >
          ✏️
        </button>
        <button 
          onClick={handleDeleteClick}
          className="delete-button"
          aria-label="Delete section"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default CVSection;