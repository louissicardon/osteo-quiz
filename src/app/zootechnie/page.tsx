'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './quiz.module.css'

interface Choice {
  text: string
  correct: boolean
}

interface Question {
  question: string
  choices: Choice[]
  source: string | string[]
}

export default function Quiz2() {
  const [quizData, setQuizData] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [usedIndexes, setUsedIndexes] = useState<number[]>([])
  const [showAnswer, setShowAnswer] = useState(false)
  const [shuffledChoices, setShuffledChoices] = useState<Choice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      const response = await fetch(`${process.env.NODE_ENV === 'production' ? '/osteo-quiz' : ''}/zootechnie.json`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement du fichier JSON')
      }
      const data = await response.json()
      setQuizData(data)
      setLoading(false)
    } catch (error) {
      console.error('Erreur:', error)
      setError('Impossible de charger les questions du Quiz 2.')
      setLoading(false)
    }
  }

  const getRandomIndex = (): number => {
    if (usedIndexes.length === quizData.length) {
      setUsedIndexes([])
    }
    let index: number
    const currentUsedIndexes = usedIndexes.length === quizData.length ? [] : usedIndexes
    do {
      index = Math.floor(Math.random() * quizData.length)
    } while (currentUsedIndexes.includes(index))
    
    setUsedIndexes(prev => prev.length === quizData.length ? [index] : [...prev, index])
    return index
  }

  const showQuestion = () => {
    if (quizData.length === 0) return
    
    const qIndex = getRandomIndex()
    const question = quizData[qIndex]
    setCurrentQuestion(question)
    setShowAnswer(false)
    
    // Mélanger les réponses
    const shuffled = [...question.choices].sort(() => Math.random() - 0.5)
    setShuffledChoices(shuffled)
  }

  const handleAnswerClick = () => {
    setShowAnswer(true)
  }

  const handleNextQuestion = () => {
    showQuestion()
  }

  useEffect(() => {
    if (quizData.length > 0) {
      showQuestion()
    }
  }, [quizData])

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.questionContainer}>
          <div>Chargement des questions du Quiz 2...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.questionContainer}>
          <div>{error}</div>
          <Link href="../" className={styles.homeLink}>
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className={styles.container}>
        <div className={styles.questionContainer}>
          <div>Aucune question disponible pour le Quiz 2.</div>
          <Link href="../" className={styles.homeLink}>
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.homeLink}>
          ← Retour à l'accueil
        </Link>
        <h2 className={styles.quizTitle}>Quiz 2 - Pratique</h2>
      </div>
      <div className={styles.questionContainer}>
        <div className={styles.question}>{currentQuestion.question}</div>
        <div className={styles.answers}>
          {shuffledChoices.map((choice, index) => (
            <button
              key={index}
              className={`${styles.answerButton} ${
                showAnswer
                  ? choice.correct
                    ? styles.correct
                    : styles.incorrect
                  : ''
              }`}
              onClick={handleAnswerClick}
              disabled={showAnswer}
            >
              {choice.text}
            </button>
          ))}
        </div>
        {showAnswer && (
          <div className={styles.source}>
            {Array.isArray(currentQuestion.source) ? (
              <>
                <strong>Sources :</strong>
                <ul className={styles.sourceList}>
                  {currentQuestion.source.map((src, index) => (
                    <li key={index}>
                      <a href={src} target="_blank" rel="noopener noreferrer">
                        {src}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                Source : <a href={currentQuestion.source} target="_blank" rel="noopener noreferrer">
                  {currentQuestion.source}
                </a>
              </>
            )}
          </div>
        )}
        {showAnswer && (
          <button className={styles.nextButton} onClick={handleNextQuestion}>
            Question suivante
          </button>
        )}
      </div>
    </div>
  )
}