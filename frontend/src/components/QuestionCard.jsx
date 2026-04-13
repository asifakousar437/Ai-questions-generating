import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const QuestionCard = ({ question, index }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const markdownComponents = {
    code({ inline, className, children, ...props }) {
      return inline ? (
        <code className={className} {...props}>
          {children}
        </code>
      ) : (
        <pre {...props}>
          <code className={className}>{children}</code>
        </pre>
      );
    },
  };

  return (
    <div className="question-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="question-header">
        <h3 className="question-text">
          <span style={{ color: 'var(--primary-color)', marginRight: '8px' }}>Q{index + 1}.</span>
          {question.question}
        </h3>
        <div className="badges">
          <span className={`badge type-${question.type.toLowerCase()}`}>
            {question.type}
          </span>
          <span className={`badge diff-${question.difficulty.toLowerCase()}`}>
            {question.difficulty}
          </span>
        </div>
      </div>

      <div className="answer-section">
        {!isRevealed ? (
          <button 
            className="btn-reveal" 
            onClick={() => setIsRevealed(true)}
          >
            <Eye size={20} />
            Show Answer
          </button>
        ) : (
          <div>
            <button 
              className="btn-reveal" 
              onClick={() => setIsRevealed(false)}
              style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
            >
              <EyeOff size={20} />
              Hide Answer
            </button>
            <div className="answer-content">
              <ReactMarkdown components={markdownComponents}>
                {question.answer}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
