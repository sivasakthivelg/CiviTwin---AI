import React, { useState, useEffect } from 'react';
import { 
  Landmark, UserCircle, Activity, Map, LayoutDashboard, 
  Send, AlertTriangle, CheckCircle, TrendingUp, DollarSign
} from 'lucide-react';

const API_BASE = import.meta.env.PROD ? "/api" : "http://localhost:8000/api";

function App() {
  const [view, setView] = useState('citizen'); // 'citizen' or 'official'

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-[#0b1f41] text-white p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Landmark className="w-8 h-8 text-yellow-500" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">CiviTwin AI</h1>
              <p className="text-xs text-blue-200 uppercase tracking-widest">Digital Twin Governance System</p>
            </div>
          </div>
          <div className="flex bg-[#162f59] rounded-lg p-1">
            <button 
              onClick={() => setView('citizen')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${view === 'citizen' ? 'bg-white text-[#0b1f41] shadow' : 'text-slate-300 hover:text-white'}`}
            >
              <UserCircle className="w-4 h-4" />
              Citizen Portal
            </button>
            <button 
              onClick={() => setView('official')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${view === 'official' ? 'bg-white text-[#0b1f41] shadow' : 'text-slate-300 hover:text-white'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Official Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {view === 'citizen' ? <CitizenView /> : <OfficialView />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-200 border-t border-slate-300 py-6 text-center text-sm text-slate-500">
        <p>CiviTwin AI - Google Hackathon MVP &copy; {new Date().getFullYear()}</p>
        <p className="mt-1">Empowering Evidence-Based Governance.</p>
      </footer>
    </div>
  );
}

function CitizenView() {
  const [formData, setFormData] = useState({ category: 'Water', description: '', location: '' });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if(res.ok) {
        setStatus('success');
        setFormData({ category: 'Water', description: '', location: '' });
      } else {
        setStatus('error');
      }
    } catch(err) {
      setStatus('error');
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-6 py-12">
      <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="bg-blue-600 p-6 text-white text-center">
          <h2 className="text-3xl font-bold mb-2">Submit a Priority Request</h2>
          <p className="text-blue-100">Your voice drives our development priorities.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <strong className="block font-semibold">Submission Received!</strong>
                <span className="text-sm">The AI has analyzed and prioritized your request.</span>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Issue Category</label>
            <select 
              className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option>Water Supply</option>
              <option>Roads & Transport</option>
              <option>Healthcare</option>
              <option>Education</option>
              <option>Sanitation & Drainage</option>
              <option>Electricity</option>
              <option>Other / Query</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Location / Ward</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Ward 12, Main Market"
              className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Detailed Description</label>
            <textarea 
              required
              rows="4"
              placeholder="Describe the issue in detail..."
              className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={status === 'submitting'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
          >
            {status === 'submitting' ? 'Processing...' : (
              <>
                <Send className="w-5 h-5" />
                Submit to CiviTwin AI
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function OfficialView() {
  const [complaints, setComplaints] = useState([]);
  const [simulationResult, setSimulationResult] = useState(null);
  const [budget, setBudget] = useState(20000000); // 20 Cr
  
  const [interventions] = useState([
    { id: '1', name: 'Jal Jeevan Mission Pipeline', category: 'Water', budget: 5000000 },
    { id: '2', name: 'PMGSY Road Upgrade', category: 'Roads', budget: 8000000 },
    { id: '3', name: 'New PHC Hospital', category: 'Healthcare', budget: 12000000 },
    { id: '4', name: 'Smart School Renovation', category: 'Education', budget: 4000000 },
    { id: '5', name: 'Solar Street Lights', category: 'Electricity', budget: 1500000 },
  ]);
  
  const [selectedInterventions, setSelectedInterventions] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/complaints`)
      .then(res => res.json())
      .then(data => setComplaints(data))
      .catch(console.error);
  }, []);

  const runSimulation = async () => {
    if(selectedInterventions.length === 0) return;
    try {
      const res = await fetch(`${API_BASE}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interventions: selectedInterventions,
          budget_constraint: budget
        })
      });
      const data = await res.json();
      setSimulationResult(data);
    } catch(err) {
      console.error(err);
    }
  };

  const toggleIntervention = (inv) => {
    if (selectedInterventions.find(i => i.id === inv.id)) {
      setSelectedInterventions(selectedInterventions.filter(i => i.id !== inv.id));
    } else {
      setSelectedInterventions([...selectedInterventions, inv]);
    }
  };

  const currentSpend = selectedInterventions.reduce((sum, i) => sum + i.budget, 0);

  return (
    <div className="container mx-auto p-6 h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
      
      {/* Left Column: AI Priorities & Map Simulation */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        
        {/* Digital Twin View */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 flex-1 flex flex-col overflow-hidden">
          <div className="bg-slate-100 p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <Map className="w-5 h-5 text-blue-600" />
              Constituency Digital Twin
            </h3>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium border border-green-200">
              Live Status
            </span>
          </div>
          
          {/* Mock Map / Twin Area */}
          <div className="flex-1 bg-slate-800 relative p-6 overflow-y-auto">
            <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
            
            <div className="relative z-10">
              <h4 className="text-white/80 font-semibold mb-4 text-sm uppercase tracking-widest border-b border-white/10 pb-2">Top AI-Prioritized Issues</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complaints.map(c => (
                  <div key={c.id} className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg backdrop-blur-md">
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">{c.category}</span>
                      <span className="text-red-300 text-xs font-mono">Severity: {c.severity}/100</span>
                    </div>
                    <p className="text-slate-200 text-sm mb-1">"{c.description}"</p>
                    <p className="text-slate-400 text-xs flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                      {c.location}
                    </p>
                  </div>
                ))}
                {complaints.length === 0 && <p className="text-slate-400 text-sm">No complaints logged yet.</p>}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: Simulation Engine */}
      <div className="w-full md:w-96 flex flex-col gap-6 overflow-y-auto pr-2 pb-4">
        
        {/* Budget Manager */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Budget Constraint
          </h3>
          <p className="text-3xl font-mono font-bold text-slate-700 mb-1">₹{(budget / 10000000).toFixed(1)} Cr</p>
          <p className="text-xs text-slate-500">Available Funds</p>
          
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">Proposed Spend:</span>
              <span className={`font-mono font-bold ${currentSpend > budget ? 'text-red-600' : 'text-slate-800'}`}>
                ₹{(currentSpend / 10000000).toFixed(1)} Cr
              </span>
            </div>
            {currentSpend > budget && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Exceeds Budget Constraint
              </p>
            )}
          </div>
        </div>

        {/* Development Interventions */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Test Interventions
            </h3>
            <p className="text-xs text-slate-500 mt-1">Select projects to simulate impact.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {interventions.map(inv => {
              const isSelected = selectedInterventions.find(i => i.id === inv.id);
              return (
                <div 
                  key={inv.id}
                  onClick={() => toggleIntervention(inv)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-indigo-500 bg-indigo-50 shadow-sm' 
                      : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-semibold text-sm ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>{inv.name}</h4>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">{inv.category}</span>
                    <span className="font-mono text-slate-600 font-semibold">₹{(inv.budget / 10000000).toFixed(1)} Cr</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <button 
              onClick={runSimulation}
              disabled={selectedInterventions.length === 0}
              className="w-full bg-[#0b1f41] hover:bg-[#162f59] text-white font-bold py-3 rounded-lg shadow disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              Run AI Simulation
            </button>
          </div>
        </div>

        {/* Simulation Results */}
        {simulationResult && (
          <div className={`p-5 rounded-xl shadow-md border ${simulationResult.status === 'success' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            <h3 className={`font-bold flex items-center gap-2 ${simulationResult.status === 'success' ? 'text-emerald-800' : 'text-red-800'}`}>
              {simulationResult.status === 'success' ? <CheckCircle className="w-5 h-5"/> : <AlertTriangle className="w-5 h-5"/>}
              {simulationResult.message}
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white p-3 rounded shadow-sm border border-black/5">
                <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Proj. Satisfaction</span>
                <span className="text-2xl font-mono font-bold text-emerald-600">{simulationResult.metrics.projected_satisfaction}%</span>
              </div>
              <div className="bg-white p-3 rounded shadow-sm border border-black/5">
                <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Infra Index</span>
                <span className="text-2xl font-mono font-bold text-blue-600">{simulationResult.metrics.projected_infra_index}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-black/10">
              <h4 className="text-xs font-bold uppercase text-slate-600 mb-2">AI Reasoning:</h4>
              <ul className="space-y-2">
                {simulationResult.details.map((d, i) => (
                  <li key={i} className="text-xs text-slate-700 flex gap-2">
                    <span className="text-emerald-600 font-bold shrink-0">{d.satisfaction_impact}</span>
                    <span>{d.reasoning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
