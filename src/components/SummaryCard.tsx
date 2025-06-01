import React from 'react';
import './SummaryCard.css';

export interface SummaryCardProps {
  label: string;
  value: string;
  unit: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, unit }) => {
  return (
    <div className="summary-card" aria-labelledby={`summary-label-${label.toLowerCase().replace(/\s+/g, '-')}`} aria-describedby={`summary-value-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <h3 id={`summary-label-${label.toLowerCase().replace(/\s+/g, '-')}`}>{label}</h3>
      <p id={`summary-value-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        <span className="summary-value">{value}</span>
        {unit && <span className="summary-unit"> {unit}</span>}
      </p>
    </div>
  );
};

export default SummaryCard;
