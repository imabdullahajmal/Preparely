import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getQuiz as apiGetQuiz, saveAttempt as apiSaveAttempt } from '../api'


export default function QuizView() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [status, setStatus] = useState(null);


    useEffect(() => {
        apiGetQuiz(id).then(r => setQuiz(r.quiz)).catch(() => setStatus('Failed to load'));
    }, [id]);


    function select(qIndex, choiceIndex) {
        setAnswers(a => ({ ...a, [qIndex]: choiceIndex }));
    }


    async function submit() {
        const payload = { quizId: id, answers: Object.keys(answers).map(k => ({ questionIndex: Number(k), selectedIndex: answers[k] })) };
        try {
            const res = await apiSaveAttempt(payload);
            setStatus(`Saved attempt — score ${res.attempt?.score ?? 'N/A'}`);
        } catch (e) { setStatus(e.error || 'Failed to save attempt'); }
    }


    if (!quiz) return <div className="text-center py-10">Loading...</div>


    return (
        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">{quiz.topic}</h2>
                    <p className="text-sm text-slate-500">Difficulty: {quiz.difficulty}</p>
                </div>
            </div>

            <ol className="mt-6 space-y-6">
                {quiz.questions.map((q, qi) => (
                    <li key={qi} className="p-4 border rounded">
                        <div className="font-medium mb-2">{q.prompt}</div>
                        <div className="flex flex-col gap-2">
                            {q.choices.map((c, ci) => (
                                <label key={ci} className={`flex items-center gap-3 p-2 rounded cursor-pointer ${answers[qi] === ci ? 'bg-sky-50 border border-sky-200' : 'hover:bg-slate-50'}`}>
                                    <input type="radio" name={`q${qi}`} checked={answers[qi] === ci} onChange={() => select(qi, ci)} />
                                    <span>{c.text}</span>
                                </label>
                            ))}
                        </div>
                    </li>
                ))}
            </ol>
            <div className="mt-6 flex items-center gap-3">
                <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={submit}>Submit attempt</button>
                {status && <div className="text-sm text-slate-600">{status}</div>}
            </div>
        </div>
    )
}