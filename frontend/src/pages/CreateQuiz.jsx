import React, { useState } from "react";
import { generateQuiz } from "../api/index";
import { useNavigate } from "react-router-dom";


export default function CreateQuiz() {
    const [topic, setTopic] = useState("");
    const [difficulty, setDifficulty] = useState("medium");
    const [numQuestions, setNumQuestions] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const data = await generateQuiz({ topic, difficulty, numQuestions });
            // backend returns { ok: true, quiz }
            const q = data && data.quiz ? data.quiz : data;
            // if the quiz was saved server-side it should have an _id — navigate to attempt page
            if (q && (q._id || q.id)) {
                const id = q._id || q.id;
                navigate(`/quiz/${id}`);
            }
        } catch (err) {
            setError(err && err.error ? err.error : 'Failed to generate quiz');
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Create Quiz</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input className="border p-2" placeholder="Topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
                <select className="border p-2" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
                <input className="border p-2" type="number" min="1" max="50" value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)} />
                <button type="submit" disabled={isLoading} className={`inline-flex items-center justify-center gap-2 bg-purple-600 text-white p-2 rounded ${isLoading ? 'opacity-70 cursor-wait' : ''}`}>
                    {isLoading && (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                    )}
                    {isLoading ? 'Generating...' : 'Generate'}
                </button>
            </form>

            {error && <div className="mt-4 text-red-600">{error}</div>}

            {/* Preview removed: generated quiz opens on its own page at /quiz/:id */}
        </div>
    );
}