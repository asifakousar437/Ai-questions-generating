import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, ArrowLeft } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import ChatBot from '../components/ChatBot';

const API_URL = 'http://localhost:8080/api/ai/interview-questions';

function ResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const skill = searchParams.get('skill') || '';
  const difficulty = searchParams.get('difficulty') || 'Medium';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const hasFetched = React.useRef(false);
  const company = searchParams.get('company') || '';

  useEffect(() => {
    // If someone navigated here directly without a skill, send them home
    if (!skill) {
      navigate('/');
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const requestBody = { skill, difficulty };
        if (company.trim()) {
          requestBody.company = company;
        }

        const response = await axios.post(API_URL, requestBody);
        setQuestions(response.data);
      } catch (err) {
        let msg = 'Failed to generate questions. Please make sure the Java backend is running on port 8080.';
        if (err.response?.data?.message?.includes('RATE_LIMIT_EXCEEDED')) {
          msg = '⚠️ Groq AI Rate Limit Reached. Please wait about 60 seconds and try again. The free tier has strict limits.';
        } else if (err.response?.data?.message?.includes('GENERATION_FAILED')) {
          msg = 'The AI struggled to format the questions this time. Please try clicking Generate again!';
        }
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [skill, difficulty, navigate]);

  return (
    <div className="app-container">
      <button 
        className="btn-reveal" 
        onClick={() => navigate('/')}
        style={{ width: 'fit-content', marginBottom: '1rem', background: 'transparent', color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}
      >
        <ArrowLeft size={20} /> Back to Setup
      </button>

      {loading && (
        <div className="loader-container" style={{ marginTop: '5rem' }}>
          <div className="spinner"></div>
          <h3 style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '1rem' }}>
            AI is uniquely curating a set of high-quality {difficulty} questions for {skill}...<br/>
            <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>(This takes a few seconds)</span>
          </h3>
        </div>
      )}

      {error && !loading && (
        <div className="error-message" style={{ marginTop: '2rem' }}>
          {error}
        </div>
      )}

      {!loading && !error && questions.length > 0 && (
        <div>
          <div className="results-header">
            <BookOpen size={28} color="var(--primary-color)" />
            <div>
              <h2>Your Custom Interview Set: {skill}</h2>
              {company && <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Company filter: {company}</p>}
            </div>
          </div>
          <div className="questions-grid">
            {questions.map((q, index) => (
              <QuestionCard key={index} question={q} index={index} />
            ))}
          </div>
        </div>
      )}
      <ChatBot />
    </div>
  );
}

export default ResultsPage;
