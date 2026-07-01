import React from 'react';
import './Card.css';

export default function Card({ children, title, className = '', noPadding = false, headerAction }) {
  return (
    <div className={`card glass-panel ${className}`}>
      {(title || headerAction) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {headerAction && <div className="card-action">{headerAction}</div>}
        </div>
      )}
      <div className={`card-content ${noPadding ? 'no-padding' : ''}`}>
        {children}
      </div>
    </div>
  );
}
