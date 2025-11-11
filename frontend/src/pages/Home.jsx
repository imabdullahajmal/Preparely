import React, { useEffect, useState } from 'react';
import { listAttempts } from '../api/index';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const [attempts, setAttempts] = useState([]);
  const [status, setStatus] = useState('loading');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await listAttempts();
        if (mounted) {
          setAttempts(res.attempts || []);
          setStatus('ready');
        }
      } catch (e) {
        if (mounted) {
          setStatus('error');
        }
      }
    }
    load();
    return () => { mounted = false };
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Your Attempts</h1>
          <p className="text-sm text-slate-500">Recent quizzes you've attempted</p>
        </div>
        <div>
          <button onClick={() => navigate('/create')} className="bg-purple-600 text-white px-4 py-2 rounded">Generate another quiz</button>
        </div>
      </div>

      {status === 'loading' && <div className="text-center py-20">Loading...</div>}
      {status === 'error' && <div className="text-center py-20 text-red-600">Failed to load attempts</div>}

      {status === 'ready' && (
        <div className="space-y-4">
          {attempts.length === 0 && <div className="p-4 border rounded text-slate-600">You have no attempts yet. Create a quiz and try it!</div>}

          {attempts.map((a) => (
            <div key={a._id} className="p-4 bg-white border rounded flex items-center justify-between">
              <div>
                <div className="font-semibold">{a.quiz?.topic || 'Untitled quiz'}</div>
                <div className="text-sm text-slate-500">Score: {typeof a.score === 'number' ? `${a.score}` : 'N/A'}</div>
                <div className="text-sm text-slate-400">{a.takenAt ? new Date(a.takenAt).toLocaleString() : ''}</div>
              </div>
              <div className="flex gap-2">
                <Link to={`/quiz/${a.quiz?._id || a.quiz?.id}`} className="px-3 py-1 bg-green-600 text-white rounded">Open</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
