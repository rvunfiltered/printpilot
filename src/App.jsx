import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  UploadCloud, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  RotateCcw, 
  Info, 
  Layers, 
  Sparkles,
  MapPin,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

const PRICING_RATES = {
  bw: 0.08,        // $0.08 per B&W page
  color: 0.35,     // $0.35 per Color page
  sizes: {
    A4: 1.0,
    Letter: 1.0,
    A3: 1.5,
  },
  duplexDiscount: 0.15 // 15% discount on double-sided
};

const STATIONS = [
  'Central Library — Main Entrance Print Hub',
  'Student Union — 2nd Floor Tech Station',
  'Engineering Building — Quad Lab B10',
  'Dormitory South — Common Area Kiosk'
];

const INITIAL_JOBS = [
  {
    id: 'JOB-8421',
    documentName: 'CS102_Data_Structures_Assignment.pdf',
    pageCount: 14,
    pageRange: 'All',
    copies: 1,
    paperSize: 'A4',
    colorMode: 'bw',
    duplex: true,
    location: 'Central Library — Main Entrance Print Hub',
    status: 'Ready for Pickup',
    estimatedCost: 0.95,
    timestamp: '15 mins ago',
  },
  {
    id: 'JOB-8422',
    documentName: 'Biology_Lab_Cell_Morphology_Posters.pdf',
    pageCount: 4,
    pageRange: '1-4',
    copies: 2,
    paperSize: 'A3',
    colorMode: 'color',
    duplex: false,
    location: 'Student Union — 2nd Floor Tech Station',
    status: 'Printing',
    estimatedCost: 4.20,
    timestamp: '5 mins ago',
  },
  {
    id: 'JOB-8423',
    documentName: 'Economics_Midterm_Summary_Notes.docx',
    pageCount: 22,
    pageRange: 'All',
    copies: 1,
    paperSize: 'Letter',
    colorMode: 'bw',
    duplex: true,
    location: 'Engineering Building — Quad Lab B10',
    status: 'Queued',
    estimatedCost: 1.50,
    timestamp: 'Just now',
  },
];

export default function App() {
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem('printpilot_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  // Print form state
  const [docName, setDocName] = useState('Physics_Lab_Report_Draft.pdf');
  const [pageCount, setPageCount] = useState(8);
  const [rangeType, setRangeType] = useState('All'); // 'All' | 'Custom'
  const [customRange, setCustomRange] = useState('');
  const [copies, setCopies] = useState(1);
  const [paperSize, setPaperSize] = useState('A4');
  const [colorMode, setColorMode] = useState('bw'); // 'bw' | 'color'
  const [duplex, setDuplex] = useState(true);
  const [selectedStation, setSelectedStation] = useState(STATIONS[0]);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    localStorage.setItem('printpilot_jobs', JSON.stringify(jobs));
  }, [jobs]);

  // Calculate pages actually printed
  let effectivePages = pageCount;
  if (rangeType === 'Custom' && customRange.trim()) {
    // Basic estimation of range count
    const parts = customRange.split(',').map(s => s.trim());
    let count = 0;
    parts.forEach(p => {
      if (p.includes('-')) {
        const [start, end] = p.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end) && end >= start) {
          count += (end - start + 1);
        } else {
          count += 1;
        }
      } else if (!isNaN(Number(p))) {
        count += 1;
      }
    });
    effectivePages = count > 0 ? count : pageCount;
  }

  // Cost calculation
  const baseRate = colorMode === 'color' ? PRICING_RATES.color : PRICING_RATES.bw;
  const sizeMultiplier = PRICING_RATES.sizes[paperSize] || 1.0;
  const rawSubtotal = effectivePages * baseRate * sizeMultiplier * copies;
  const finalCost = duplex ? rawSubtotal * (1 - PRICING_RATES.duplexDiscount) : rawSubtotal;

  const handleSubmitJob = (e) => {
    e.preventDefault();
    if (!docName.trim()) return;

    const newJob = {
      id: `JOB-${Math.floor(1000 + Math.random() * 9000)}`,
      documentName: docName,
      pageCount: effectivePages,
      pageRange: rangeType === 'All' ? 'All' : (customRange || `1-${effectivePages}`),
      copies: Number(copies),
      paperSize,
      colorMode,
      duplex,
      location: selectedStation,
      status: 'Queued',
      estimatedCost: parseFloat(finalCost.toFixed(2)),
      timestamp: 'Just now',
    };

    setJobs([newJob, ...jobs]);
    alert(`Print job ${newJob.id} successfully queued! Ready for collection at ${selectedStation}.`);
  };

  const handleAdvanceStatus = (jobId) => {
    setJobs(jobs.map(job => {
      if (job.id === jobId) {
        if (job.status === 'Queued') return { ...job, status: 'Printing' };
        if (job.status === 'Printing') return { ...job, status: 'Ready for Pickup' };
        if (job.status === 'Ready for Pickup') return { ...job, status: 'Completed' };
      }
      return job;
    }));
  };

  const handleDeleteJob = (jobId) => {
    setJobs(jobs.filter(j => j.id !== jobId));
  };

  const handleReset = () => {
    if (window.confirm('Reset all print jobs to demo samples?')) {
      setJobs(INITIAL_JOBS);
      localStorage.removeItem('printpilot_jobs');
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filterStatus === 'All') return true;
    return job.status === filterStatus;
  });

  return (
    <div className="app-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="nav-content">
          <div className="nav-brand">
            <div className="nav-brand-icon">
              <Printer size={22} />
            </div>
            <span>PrintPilot</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.825rem', color: '#64748b' }}>
              Campus Print Credit: <strong style={{ color: '#0284c7' }}>$15.00</strong>
            </span>
            <button className="btn btn-secondary btn-sm" onClick={handleReset}>
              <RotateCcw size={14} />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="main-content">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a' }}>Campus Printing Assistant</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Prepare files, configure page layouts, calculate print costs upfront, and track job queues in real time.
          </p>
        </div>

        <div className="print-grid">
          {/* Left: Print Job Submission Form */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <UploadCloud size={18} color="#0284c7" />
                Submit New Print Job
              </h2>
            </div>
            <form onSubmit={handleSubmitJob} className="card-body">
              {/* Document selection */}
              <div className="form-group">
                <label className="form-label">Document Name / File</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Research_Paper_Final.pdf"
                />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm"
                    onClick={() => { setDocName('CS102_Lab_Manual.pdf'); setPageCount(16); }}
                  >
                    Load Sample Lab.pdf
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm"
                    onClick={() => { setDocName('History_Essay_Draft.docx'); setPageCount(5); }}
                  >
                    Load Essay.docx
                  </button>
                </div>
              </div>

              {/* Total Document Pages */}
              <div className="form-group">
                <label className="form-label">Total Document Pages</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  required
                  className="form-input"
                  value={pageCount}
                  onChange={(e) => setPageCount(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>

              {/* Page Range */}
              <div className="form-group">
                <label className="form-label">Page Selection Range</label>
                <div className="radio-group" style={{ marginBottom: '0.5rem' }}>
                  <div 
                    className={`radio-card ${rangeType === 'All' ? 'selected' : ''}`}
                    onClick={() => setRangeType('All')}
                  >
                    All Pages (1-{pageCount})
                  </div>
                  <div 
                    className={`radio-card ${rangeType === 'Custom' ? 'selected' : ''}`}
                    onClick={() => setRangeType('Custom')}
                  >
                    Custom Range
                  </div>
                </div>
                {rangeType === 'Custom' && (
                  <input
                    type="text"
                    placeholder="e.g. 1-3, 5, 8"
                    className="form-input"
                    value={customRange}
                    onChange={(e) => setCustomRange(e.target.value)}
                  />
                )}
              </div>

              {/* Color Mode */}
              <div className="form-group">
                <label className="form-label">Color Mode</label>
                <div className="radio-group">
                  <div 
                    className={`radio-card ${colorMode === 'bw' ? 'selected' : ''}`}
                    onClick={() => setColorMode('bw')}
                  >
                    Black & White ($0.08/pg)
                  </div>
                  <div 
                    className={`radio-card ${colorMode === 'color' ? 'selected' : ''}`}
                    onClick={() => setColorMode('color')}
                  >
                    Full Color ($0.35/pg)
                  </div>
                </div>
              </div>

              {/* Paper Size & Copies */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Paper Size</label>
                  <select 
                    className="form-select"
                    value={paperSize}
                    onChange={(e) => setPaperSize(e.target.value)}
                  >
                    <option value="A4">A4 (Standard)</option>
                    <option value="Letter">US Letter</option>
                    <option value="A3">A3 (1.5x Poster)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Number of Copies</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    className="form-input"
                    value={copies}
                    onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>
              </div>

              {/* Duplex (Double Sided) */}
              <div className="form-group">
                <label className="form-label">Two-Sided (Duplex) Printing</label>
                <div className="radio-group">
                  <div 
                    className={`radio-card ${duplex ? 'selected' : ''}`}
                    onClick={() => setDuplex(true)}
                  >
                    Double-Sided (Save 15%)
                  </div>
                  <div 
                    className={`radio-card ${!duplex ? 'selected' : ''}`}
                    onClick={() => setDuplex(false)}
                  >
                    Single-Sided
                  </div>
                </div>
              </div>

              {/* Pickup Location */}
              <div className="form-group">
                <label className="form-label">Campus Collection Station</label>
                <select
                  className="form-select"
                  value={selectedStation}
                  onChange={(e) => setSelectedStation(e.target.value)}
                >
                  {STATIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Cost Calculation Callout */}
              <div className="cost-calculator-box">
                <div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Estimated Total Cost</div>
                  <div className="cost-amount">${finalCost.toFixed(2)}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>
                    {effectivePages} pgs × {copies} copy • {colorMode === 'bw' ? 'B&W' : 'Color'} {duplex ? '(Duplex -15%)' : ''}
                  </div>
                </div>
                <Printer size={32} opacity={0.6} />
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <button type="submit" className="btn btn-primary">
                  Send to Print Queue
                </button>
              </div>
            </form>
          </div>

          {/* Right: Submitted Jobs List */}
          <div>
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <Clock size={18} color="#0284c7" />
                  Active Print Queues ({filteredJobs.length})
                </h2>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {['All', 'Queued', 'Printing', 'Ready for Pickup'].map(status => (
                    <button
                      key={status}
                      className={`btn btn-secondary btn-sm ${filterStatus === status ? 'btn-primary' : ''}`}
                      onClick={() => setFilterStatus(status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="card-body">
                {filteredJobs.length === 0 ? (
                  <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94a3b8' }}>
                    <Printer size={40} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                    <p>No print jobs found in this queue category.</p>
                  </div>
                ) : (
                  <div>
                    {filteredJobs.map(job => (
                      <div key={job.id} className="job-item">
                        <div className="job-header">
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                              <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{job.documentName}</strong>
                              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>#{job.id}</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <MapPin size={13} color="#0284c7" />
                              <span>{job.location}</span>
                            </div>
                          </div>
                          <span className={`badge ${
                            job.status === 'Queued' ? 'badge-queued' :
                            job.status === 'Printing' ? 'badge-printing' :
                            job.status === 'Ready for Pickup' ? 'badge-ready' : 'badge-completed'
                          }`}>
                            {job.status}
                          </span>
                        </div>

                        <div className="job-details-row">
                          <div><strong>Pages:</strong> {job.pageCount} ({job.pageRange})</div>
                          <div><strong>Copies:</strong> {job.copies}</div>
                          <div><strong>Paper:</strong> {job.paperSize}</div>
                          <div><strong>Mode:</strong> {job.colorMode === 'bw' ? 'B&W' : 'Color'}</div>
                          <div><strong>Duplex:</strong> {job.duplex ? 'Yes' : 'No'}</div>
                          <div><strong>Total:</strong> ${job.estimatedCost.toFixed(2)}</div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Submitted {job.timestamp}</span>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {job.status !== 'Completed' && (
                              <button 
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleAdvanceStatus(job.id)}
                                title="Simulate print progression"
                              >
                                {job.status === 'Queued' && 'Start Printing →'}
                                {job.status === 'Printing' && 'Mark Ready →'}
                                {job.status === 'Ready for Pickup' && 'Mark Collected ✓'}
                              </button>
                            )}
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleDeleteJob(job.id)}
                              style={{ color: '#ef4444' }}
                              title="Cancel / remove job"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Print Shop Rate Reference */}
            <div style={{ marginTop: '1.5rem', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Info size={16} color="#0284c7" />
                Campus Print Shop Official Rates
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.8rem', color: '#475569' }}>
                <div>• B&W Standard: <strong>$0.08 / page</strong></div>
                <div>• Full Color Photo: <strong>$0.35 / page</strong></div>
                <div>• Two-Sided (Duplex): <strong>15% Discount</strong></div>
                <div>• Large Format A3: <strong>1.5x Surcharge</strong></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>PrintPilot &copy; 2026 — University Student IT & Campus Printing Services</p>
      </footer>
    </div>
  );
}

