// components/CVPreview.jsx
import React from 'react';

const CVPreview = ({ sections }) => {
  const renderSection = (section) => {
    switch (section.type) {
      case 'personal':
        return (
          <div className="personal-info">
            <h1 className="personal-name">{section.content.name}</h1>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>{section.content.phone}</span>
            </div>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>{section.content.email}</span>
            </div>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>{section.content.address}</span>
            </div>
          </div>
        );
      case 'text':
        return <div className="text-section">{section.content}</div>;
      case 'list':
        return (
          <div className="list-section">
            {section.content.map((item, index) => (
              <div key={index} className="list-item">
                <div className="list-item-header">
                  <span className="list-item-title">{item.title}</span>
                  <span className="list-item-period">{item.period}</span>
                </div>
                <div className="list-item-company">
                  {item.company || item.institution}
                </div>
                <div className="list-item-description">{item.description}</div>
              </div>
            ))}
          </div>
        );
      case 'tags':
        return (
          <div className="tags-container">
            {section.content.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="cv-preview">
      {sections.map((section) => (
        <div key={section.id} className="cv-section">
          {section.type !== 'personal' && (
            <h2 className="cv-section-title">{section.title}</h2>
          )}
          {renderSection(section)}
        </div>
      ))}
    </div>
  );
};

export default CVPreview;