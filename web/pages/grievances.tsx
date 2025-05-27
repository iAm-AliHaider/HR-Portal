import React, { useState } from 'react';

const initialGrievances = [
  { id: 1, subject: 'Workplace Environment', description: 'The office temperature is too cold.', status: 'Submitted', messages: [{ from: 'You', text: 'The office is too cold.' }], evidence: [], anonymous: false },
  { id: 2, subject: 'Equipment', description: 'My laptop is malfunctioning.', status: 'Resolved', messages: [{ from: 'HR', text: 'We have replaced your laptop.' }], evidence: ['photo.jpg'], anonymous: false },
];

const Grievances = () => {
  const [grievances, setGrievances] = useState(initialGrievances);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [evidence, setEvidence] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [selected, setSelected] = useState(null as null | typeof initialGrievances[0]);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGrievances([
      ...grievances,
      { id: Date.now(), subject, description, status: 'Submitted', messages: [{ from: anonymous ? 'Anonymous' : 'You', text: description }], evidence: evidence ? [evidence] : [], anonymous },
    ]);
    setSubject('');
    setDescription('');
    setEvidence('');
    setAnonymous(false);
    setShowForm(false);
  };
  const sendMessage = () => {
    if (!message.trim() || !selected) return;
    setGrievances(gs => gs.map(g => g.id === selected.id ? { ...g, messages: [...g.messages, { from: 'You', text: message }] } : g));
    setMessage('');
  };
  const addEvidence = () => {
    if (!evidence.trim() || !selected) return;
    setGrievances(gs => gs.map(g => g.id === selected.id ? { ...g, evidence: [...g.evidence, evidence] } : g));
    setEvidence('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center text-[#0a3d91]">Grievances</h1>
        <button
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowForm(true)}
        >
          + New Grievance
        </button>
        <ul className="space-y-4 mb-8">
          {grievances.map((g) => (
            <li key={g.id} className="bg-gray-50 rounded shadow-sm p-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-6 hover:bg-blue-50 transition">
              <span className="font-semibold">{g.subject}</span>
              <span className="text-gray-500 flex-1">{g.description}</span>
              <span className={`px-2 py-1 rounded text-xs ${g.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{g.status}</span>
              <button className="text-blue-600 underline text-xs" onClick={() => setSelected(g)}>Details</button>
            </li>
          ))}
        </ul>
        {/* Modal for details/messages/evidence */}
        {selected && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl"
                onClick={() => setSelected(null)}
              >
                &times;
              </button>
              <h2 className="font-bold text-lg mb-2 text-[#0a3d91]">{selected.subject}</h2>
              <div className="mb-2 text-gray-700">{selected.description}</div>
              <div className="mb-2 text-xs text-gray-500">Status: {selected.status} {selected.anonymous && <span className="ml-2 text-gray-400">(Anonymous)</span>}</div>
              <div className="mb-2">
                <span className="font-medium">Messages:</span>
                <ul className="space-y-1 text-sm text-gray-700 mb-2 max-h-32 overflow-y-auto">
                  {selected.messages.map((m, i) => <li key={i}><span className="font-semibold">{m.from}:</span> {m.text}</li>)}
                </ul>
                <div className="flex gap-2 mt-2">
                  <input
                    className="border rounded px-2 py-1 text-sm flex-1"
                    placeholder="Send a message..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                  <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs" onClick={sendMessage}>Send</button>
                </div>
              </div>
              <div className="mb-2">
                <span className="font-medium">Evidence:</span>
                <ul className="list-disc ml-6 text-sm text-gray-700">
                  {selected.evidence.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
                <div className="flex gap-2 mt-2">
                  <input
                    className="border rounded px-2 py-1 text-sm flex-1"
                    placeholder="Add evidence (URL or file name)..."
                    value={evidence}
                    onChange={ev => setEvidence(ev.target.value)}
                  />
                  <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs" onClick={addEvidence}>Add</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Modal for new grievance */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <form
              className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative"
              onSubmit={handleSubmit}
            >
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl"
                onClick={() => setShowForm(false)}
                type="button"
              >
                &times;
              </button>
              <h2 className="font-bold text-lg mb-4">New Grievance</h2>
              <label className="block mb-2 font-medium">Subject</label>
              <input
                className="w-full border rounded px-3 py-2 mb-4"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                required
              />
              <label className="block mb-2 font-medium">Description</label>
              <textarea
                className="w-full border rounded px-3 py-2 mb-4"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
              <label className="block mb-2 font-medium">Evidence (optional)</label>
              <input
                className="w-full border rounded px-3 py-2 mb-4"
                value={evidence}
                onChange={e => setEvidence(e.target.value)}
                placeholder="URL or file name"
              />
              <label className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={e => setAnonymous(e.target.checked)}
                />
                Submit anonymously
              </label>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
                type="submit"
              >
                Submit Grievance
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grievances; 
