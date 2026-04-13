import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Sparkles } from 'lucide-react';

const SKILLS_LIST = [
  "React.js",
  "Java Spring Boot",
  "Python (Django/FastAPI)",
  "Node.js & Express",
  "Angular",
  "Vue.js",
  "System Design",
  "Data Structures & Algorithms",
  "SQL & Relational Databases",
  "NoSQL (MongoDB, DynamoDB)",
  "Docker & Kubernetes",
  "AWS (Cloud Architecture)",
  "Cybersecurity Basics",
  "Machine Learning",
  "Deep Learning",
  "Natural Language Processing (NLP)",
  "Computer Vision",
  "Data Science",
  "Machine Learning / AI Engineers",
  "C++ / Embedded Systems",
  "Go (Golang)",
  "Ruby on Rails",
  "Mobile Dev (React Native / Flutter)",
  "iOS (Swift)",
  "Android (Kotlin)"
];

function HomePage() {
  const [skill, setSkill] = useState(SKILLS_LIST[0]);
  const [company, setCompany] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const navigate = useNavigate();

  const COMPANY_LIST = [
    '',
    'Google',
    'Amazon',
    'Microsoft',
    'Meta',
    'Apple',
    'Netflix',
    'Tesla',
    'NVIDIA',
    'IBM',
    'Spotify'
  ];

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!skill.trim()) return;

    const query = new URLSearchParams({
      skill,
      difficulty
    });

    if (company.trim()) {
      query.set('company', company);
    }

    navigate(`/results?${query.toString()}`);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>
          <BrainCircuit size={48} color="var(--primary-color)" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '1rem' }} />
          Skill-Based <span>AI Interview Tracker</span>
        </h1>
        <p>Master your upcoming interview with dynamically generated, targeted questions tailored to your tech stack.</p>
      </header>

      <form className="form-card" onSubmit={handleGenerate}>
        <div className="input-group">
          <label htmlFor="skill">Topic / Skill</label>
          <select
            id="skill"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            required
          >
            {SKILLS_LIST.map((s, idx) => (
              <option key={idx} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="company">Company (optional)</label>
          <select
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          >
            {COMPANY_LIST.map((c, idx) => (
              <option key={idx} value={c}>
                {c || 'Any company (optional)'}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="difficulty">Difficulty Level</label>
          <select 
            id="difficulty" 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="Easy">Beginner / Easy</option>
            <option value="Medium">Intermediate / Medium</option>
            <option value="Hard">Advanced / Hard</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="btn-generate"
          disabled={!skill.trim()}
        >
          <Sparkles size={24} />
          Generate Questions
        </button>
      </form>
    </div>
  );
}

export default HomePage;
