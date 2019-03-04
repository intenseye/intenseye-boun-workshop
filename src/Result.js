import React from 'react';
import './Result.css';

const Result = ({ label, value }) => (
  <div className="result">
    <span className="result__label">{label}</span>
    <div style={{ width: value > 0.01 ? value * 150 : 0 }} className="result__value" />
  </div>
);

export default Result;
