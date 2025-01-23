import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

function App() {
  const [currentProblem, setCurrentProblem] = useState(generateProblem());
  const [previousProblem, setPreviousProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState('');
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef(null);

  function generateProblem() {
    return {
      num1: Math.floor(Math.random() * 10) + 1,
      num2: Math.floor(Math.random() * 10) + 1,
      id: Date.now()
    };
  }

  const [isFirstQuestion, setIsFirstQuestion] = useState(true);

  const handleFirstQuestionTimeout = useCallback(() => {
    setPreviousProblem(currentProblem);
    setCurrentProblem(generateProblem());
    setIsFirstQuestion(false);
  }, [currentProblem]);

  useEffect(() => {
    if (!gameOver && isFirstQuestion) {
      timerRef.current = setTimeout(handleFirstQuestionTimeout, 3000);
      return () => clearTimeout(timerRef.current);
    }
  }, [gameOver, isFirstQuestion, handleFirstQuestionTimeout]);


  const checkAnswer = () => {
    if (!previousProblem) return;

    const correctAnswer = previousProblem.num1 + previousProblem.num2;
    if (parseInt(userAnswer) === correctAnswer) {
      setResult('Correct!');
      setScore(score + 1);
    } else {
      setResult('Incorrect!');
      setWrongAnswers(wrongAnswers + 1);
      if (wrongAnswers >= 4) {
        setGameOver(true);
      }
    }
    setUserAnswer('');
    // Immediately generate next question
    setPreviousProblem(currentProblem);
    setCurrentProblem(generateProblem());
    setResult('');
  };

  const startGame = () => {
    setCurrentProblem(generateProblem());
    setPreviousProblem(null);
    setUserAnswer('');
    setResult('');
    setScore(0);
    setWrongAnswers(0);
    setGameOver(false);
    setIsFirstQuestion(true);
  };

  if (gameOver) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Game Over!</h1>
          <div className="result">You got {score} correct answers</div>
          <button onClick={startGame} className="start-button">
            Play Again
          </button>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Monster Memory Calculation</h1>
        {!isFirstQuestion && (
          <button onClick={startGame} className="reset-button">
            Reset Game
          </button>
        )}
        <div className="problem-container">
          <div className="current-problem">
            Current: {currentProblem.num1} + {currentProblem.num2} = ?
          </div>
          {previousProblem && (
            <div className="previous-problem">
              <span className="question">
                Previous: {previousProblem.num1} + {previousProblem.num2} = 
              </span>
              <span className="answer">{previousProblem.num1 + previousProblem.num2}</span>
            </div>
          )}
        </div>
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
        />
        <button onClick={checkAnswer}>Submit</button>
        <div className="result">{result}</div>
        <div className="score">Score: {score}</div>
        <div className="wrong-answers">Wrong Answers: {wrongAnswers}</div>
      </header>
    </div>
  );
}

export default App;
