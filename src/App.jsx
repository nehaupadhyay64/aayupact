import React, { useState } from 'react';
import {
  HeartPulse, ShieldCheck, Pill, Bell, Volume2, Check, X,
  Plus, PhoneCall, UserCheck, Users, Sparkles, Lock
} from 'lucide-react';

export default function App() {
  const [role, setRole] = useState('senior');
  const [meds, setMeds] = useState([
    { id: 1, name: 'Telma 40 (BP)', dosage: '1 Tablet', time: '08:00 AM', instruction: 'After Breakfast', status: 'taken' },
    { id: 2, name: 'Glycomet GP 1', dosage: '1 Tablet', time: '01:30 PM', instruction: 'Before Lunch', status: 'pending' },
    { id: 3, name: 'Ecosprin 75mg', dosage: '1 Tablet', time: '09:00 PM', instruction: 'After Dinner', status: 'pending' },
  ]);

  const [consent, setConsent] = useState({
    medLogs: true,
    missedAlerts: true,
    appointments: false,
  });

  const [alerts, setAlerts] = useState([
    '08:05 AM — Ramesh ji took Telma 40 (Verified)',
  ]);

  const [newName, setNewName] = useState('');
  const [newTime, setNewTime] = useState('06:00 PM');
  const [aiReply, setAiReply] = useState('Ask me anything about pill timings or food interactions!');
  const [sosActive, setSosActive] = useState(false);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
  };

  const updateStatus = (id, status) => {
    setMeds((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const msg = `${timeNow} — ${m.name} marked as ${status.toUpperCase()}`;
          if (status === 'taken' && consent.medLogs) setAlerts((a) => [msg, ...a]);
          if (status === 'skipped' && consent.missedAlerts) setAlerts((a) => [`🚨 ALERT: ${msg}`, ...a]);
          return { ...m, status };
        }
        return m;
      })
    );
  };

  const addMed = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setMeds((prev) => [
      ...prev,
      { id: Date.now(), name: newName, dosage: '1 Tablet', time: newTime, instruction: 'After Meal', status: 'pending' },
    ]);
    setNewName('');
  };

  const takenCount = meds.filter((m) => m.status === 'taken').length;
  const adherence = Math.round((takenCount / meds.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-teal-800 text-white px-6 py-4 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <HeartPulse className="w-8 h-8 text-emerald-300" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">AayuPact</h1>
            <p className="text-xs text-teal-200">Consent-First Smart Pill & Senior Care</p>
          </div>
        </div>

        <div className="flex bg-teal-900/80 p-1 rounded-xl border border-teal-600">
          <button
            onClick={() => setRole('senior')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              role === 'senior' ? 'bg-white text-teal-900 shadow' : 'text-teal-100 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Senior View (Ramesh, 72)
          </button>
          <button
            onClick={() => setRole('caregiver')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              role === 'caregiver' ? 'bg-white text-teal-900 shadow' : 'text-teal-100 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> Caregiver (Priya)
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {sosActive && (
          <div className="bg-red-600 text-white p-4 rounded-2xl flex items-center justify-between animate-pulse">
            <span className="font-bold text-lg">🚨 EMERGENCY SOS SENT TO PRIYA SHARMA & DR. MEHTA!</span>
            <button onClick={() => setSosActive(false)} className="bg-white text-red-700 px-3 py-1 rounded-lg font-bold text-sm">
              Cancel
            </button>
          </div>
        )}

        {role === 'senior' ? (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Namaste, Ramesh Ji 🙏</h2>
                <p className="text-slate-600">Today's Medication Adherence: <span className="font-bold text-teal-700">{adherence}%</span></p>
              </div>
              <button
                onClick={() => {
                  setSosActive(true);
                  speak('Emergency SOS alert sent to Priya.');
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3.5 rounded-2xl flex items-center gap-2 shadow-md text-lg"
              >
                <PhoneCall className="w-6 h-6" /> Emergency SOS
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {meds.map((med) => (
                <div key={med.id} className="bg-white p-6 rounded-2xl shadow-sm border-2 border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold bg-teal-50 text-teal-800 px-3 py-1 rounded-full">{med.time}</span>
                      <button
                        onClick={() => speak(`Time for ${med.name}, ${med.dosage}, ${med.instruction}`)}
                        className="p-2 bg-slate-100 hover:bg-teal-100 rounded-full text-teal-700"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-2">{med.name}</h3>
                    <p className="text-slate-600 font-medium">{med.dosage} • {med.instruction}</p>
                  </div>

                  <div className="mt-6">
                    {med.status === 'pending' ? (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => updateStatus(med.id, 'taken')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-1"
                        >
                          <Check className="w-5 h-5" /> Taken
                        </button>
                        <button
                          onClick={() => updateStatus(med.id, 'skipped')}
                          className="bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-700 font-bold py-3 rounded-xl flex items-center justify-center gap-1"
                        >
                          <X className="w-5 h-5" /> Skip
                        </button>
                      </div>
                    ) : (
                      <div
                        className={`text-center py-2.5 rounded-xl font-bold uppercase text-sm ${
                          med.status === 'taken' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {med.status === 'taken' ? '✓ Dose Taken' : '✕ Skipped'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-6 h-6 text-teal-700" />
                <h3 className="text-lg font-bold">My Privacy & Caregiver Consent (AayuPact Vault)</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { key: 'medLogs', label: 'Share Taken Pill Logs' },
                  { key: 'missedAlerts', label: 'Send Missed-Dose Alerts' },
                  { key: 'appointments', label: 'Share Doctor Notes' },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50"
                  >
                    <span className="font-semibold text-sm">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={consent[item.key]}
                      onChange={() => setConsent((c) => ({ ...c, [item.key]: !c[item.key] }))}
                      className="w-5 h-5 accent-teal-700"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Pill className="w-5 h-5 text-teal-700" /> Ramesh's Medication Plan
                </h3>
                <span className="bg-teal-100 text-teal-800 font-bold px-3 py-1 rounded-full text-sm">
                  {adherence}% Adherence
                </span>
              </div>

              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-teal-600 h-full transition-all" style={{ width: `${adherence}%` }} />
              </div>

              <form onSubmit={addMed} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Medicine name (e.g. Dolo 650)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-24 border border-slate-300 rounded-xl px-2 py-2 text-sm"
                />
                <button type="submit" className="bg-teal-700 text-white px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </form>

              <ul className="divide-y divide-slate-100">
                {meds.map((m) => (
                  <li key={m.id} className="py-2.5 flex items-center justify-between text-sm">
                    <div>
                      <span className="font-bold">{m.name}</span> <span className="text-slate-500">({m.time})</span>
                    </div>
                    <span className="uppercase text-xs font-bold px-2 py-0.5 rounded bg-slate-100">{m.status}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                  <Bell className="w-5 h-5 text-teal-700" /> Consent-Gated Live Alerts
                </h3>
                {!consent.medLogs && !consent.missedAlerts ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Senior has paused live log sharing in AayuPact Vault.
                  </div>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {alerts.map((a, idx) => (
                      <li key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">{a}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-teal-700" /> AI Care Co-Pilot
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    onClick={() => setAiReply('Telma 40 is best taken every morning at 8 AM after breakfast to keep BP steady.')}
                    className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold px-3 py-1.5 rounded-lg"
                  >
                    Telma 40 Timing?
                  </button>
                  <button
                    onClick={() => setAiReply('Glycomet GP 1 should be taken 15 mins before lunch to prevent post-meal sugar spikes.')}
                    className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold px-3 py-1.5 rounded-lg"
                  >
                    Glycomet Meal Rule?
                  </button>
                </div>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">{aiReply}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}