import { useState, useEffect } from 'react';
import SpotlightCard from '../components/SpotlightCard';

interface UploadProps {
  onSaveLog: (log: { item: string; prepared: number; consumed: number; date: string }) => void;
  showToast: (msg: string, type?: 'success' | 'danger' | 'warning') => void;
}

export default function Upload({ onSaveLog, showToast }: UploadProps) {
  const [item, setItem] = useState('');
  const [prepared, setPrepared] = useState('');
  const [consumed, setConsumed] = useState('');
  const [date, setDate] = useState('');

  // Default date to today's date
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const preparedNum = parseFloat(prepared);
    const consumedNum = parseFloat(consumed);

    if (!item.trim() || isNaN(preparedNum) || isNaN(consumedNum) || !date) {
      showToast("Please fill in all details correctly.", "danger");
      return;
    }

    if (consumedNum > preparedNum) {
      showToast("Consumed quantity cannot exceed prepared quantity!", "danger");
      return;
    }

    onSaveLog({
      item: item.trim(),
      prepared: preparedNum,
      consumed: consumedNum,
      date: date
    });

    showToast(`Food record for '${item}' saved successfully!`, "success");
    setItem('');
    setPrepared('');
    setConsumed('');
    
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <main className="container">
      <SpotlightCard id="upload-section" style={{ padding: '2.5rem' }}>
        <h2 id="form-heading">Enter Daily Food Log</h2>
        <p style={{ marginBottom: '2rem' }}>
          Please log the exact quantity prepared and consumed. The system will calculate wastage and update reporting metrics instantly.
        </p>
        
        <form id="upload-form" onSubmit={handleSubmit} style={{ border: 'none', background: 'transparent', padding: 0, maxWidth: '100%' }}>
          <label htmlFor="upload-item">Food Item Name</label>
          <input 
            type="text" 
            id="upload-item" 
            placeholder="e.g., Veg Biryani, Roti, Rice" 
            required 
            value={item}
            onChange={(e) => setItem(e.target.value)}
            style={{ marginTop: '0.5rem', marginBottom: '1rem' }}
          />

          <label htmlFor="upload-prepared">Quantity Prepared (kg)</label>
          <input 
            type="number" 
            id="upload-prepared" 
            min="0.1" 
            step="0.1" 
            placeholder="e.g., 55.5" 
            required 
            value={prepared}
            onChange={(e) => setPrepared(e.target.value)}
            style={{ marginTop: '0.5rem', marginBottom: '1rem' }}
          />

          <label htmlFor="upload-consumed">Quantity Consumed (kg)</label>
          <input 
            type="number" 
            id="upload-consumed" 
            min="0.0" 
            step="0.1" 
            placeholder="e.g., 48.2" 
            required 
            value={consumed}
            onChange={(e) => setConsumed(e.target.value)}
            style={{ marginTop: '0.5rem', marginBottom: '1rem' }}
          />

          <label htmlFor="upload-date">Log Date</label>
          <input 
            type="date" 
            id="upload-date" 
            required 
            max={todayStr}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}
          />

          <button type="submit" id="upload-submit" style={{ width: '100%' }}>
            Save Food Record
          </button>
        </form>
      </SpotlightCard>
    </main>
  );
}
