import React from 'react';
import styles from './index.module.css';

interface ProgressProps {
  value: number;
}

const Progress: React.FC<ProgressProps> = ({ value }) => {
  return (
    <div className={styles.Progress}>
      <div className={styles.ProgressBar} style={{ width: `${value}%` }}></div>
    </div>
  );
};

export default Progress;