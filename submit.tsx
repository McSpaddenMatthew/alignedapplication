import { useState } from 'react';
import axios from 'axios';

export default function SubmitPage() {
  const [candidateName, setCandidateName] = useState('Jane Doe');
  const [recruiterNotes, setRecruiterNotes] = useState('Led data migration, improved pipeline by 30%.');
  const [jdBullets, setJdBullets] = useState('- Strategic execution\n- BI/analytics\n- Value-based care');
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post('/api/generateReport', {
        candidateName,
        recruiterNotes,
        jdBullets: jdBullets.split('\n')
      });
      setResult(data.report);
    } catch (err) {
      setResult('Error generating report.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Submit Candidate</h2>
      <input className="w-full border mb-2 p-2" placeholder="Candidate Name" value={candidateName} onChange={e => setCandidateName(e.target.value)} />
      <textarea className="w-full border mb-2 p-2" rows={4} placeholder="Recruiter Notes" value={recruiterNotes} onChange={e => setRecruiterNotes(e.target.value)} />
      <textarea className="w-full border mb-2 p-2" rows={3} placeholder="Job Description Bullets (one per line)" value={jdBullets} onChange={e => setJdBullets(e.target.value)} />
      <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded">Generate Report</button>
      {result && (
        <div className="mt-4 whitespace-pre-wrap border p-4 bg-gray-100">{result}</div>
      )}
    </div>
  );
}
