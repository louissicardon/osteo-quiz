'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Question, QuizType } from '../../types/quiz.types'
import styles from './Quiz.module.css'
import { QUIZ_CONFIGS } from '../../config/quiz.config'
import { getAssetPath } from '../../utils/paths'

interface QuizProps {
  type: QuizType
}

export default function Quiz({ type }: QuizProps) {
  const config = QUIZ_CONFIGS[type]
  
  const [quizData, setQuizData] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState<number>(1)
  const [usedIndexes, setUsedIndexes] = useState<number[]>([])
  const [showAnswer, setShowAnswer] = useState(false)
  const [shuffledChoices, setShuffledChoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadQuestions()
  }, [type])

  const loadQuestions = async () => {
    try {
      const response = await fetch(getAssetPath(`/${config.filename}`))
      if (!response.ok) {
        throw new Error('Erreur lors du chargement du fichier JSON')
      }
      const data = await response.json()
      setQuizData(data)
      setLoading(false)
    } catch (error) {
      console.error('Erreur:', error)
      setError(`Impossible de charger les questions du Quiz ${config.title}.`)
      setLoading(false)
    }
  }

  const getRandomIndex = (): number => {
    if (usedIndexes.length === quizData.length) {
      setUsedIndexes([])
      setCurrentQuestionNumber(1)
    }
    let index: number
    const currentUsedIndexes = usedIndexes.length === quizData.length ? [] : usedIndexes
    do {
      index = Math.floor(Math.random() * quizData.length)
    } while (currentUsedIndexes.includes(index))
    
    setUsedIndexes(prev => {
      const newUsed = prev.length === quizData.length ? [index] : [...prev, index]
      setCurrentQuestionNumber(newUsed.length)
      return newUsed
    })
    return index
  }

  const showQuestion = () => {
    if (quizData.length === 0) return
    
    const qIndex = getRandomIndex()
    const question = quizData[qIndex]
    setCurrentQuestion(question)
    setShowAnswer(false)
    
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

  // États de chargement et d'erreur
  if (loading) {
    return (
      <div className={styles.container} style={{ background: config.theme.background }}>
        <div className={styles.questionContainer}>
          <div>Chargement des questions du Quiz {config.title}...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container} style={{ background: config.theme.background }}>
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
      <div className={styles.container} style={{ background: config.theme.background }}>
        <div className={styles.questionContainer}>
          <div>Aucune question disponible pour le Quiz {config.title}.</div>
          <Link href="../" className={styles.homeLink}>
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container} style={{ background: config.theme.background }}>
      <div className={styles.header}>
        <Link href="../" className={styles.homeLink}>
          ← Retour à l'accueil
        </Link>
        <h2 className={styles.quizTitle}>{config.title}</h2>
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
              style={{
                '--primary-color': config.theme.primary,
                '--secondary-color': config.theme.secondary
              } as React.CSSProperties}
            >
              {choice.text}
            </button>
          ))}
        </div>

        {showAnswer && (
          <div className={styles.source} style={{ borderLeftColor: config.theme.primary }}>
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
          <button 
            className={styles.nextButton} 
            onClick={handleNextQuestion}
            style={{ background: `linear-gradient(135deg, ${config.theme.primary} 0%, ${config.theme.secondary} 100%)` }}
          >
            Question suivante
          </button>
        )}
      </div>

      <div className={styles.progressContainer}>
        <span className={styles.progressText}>
          Question {currentQuestionNumber} / {quizData.length}
        </span>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ 
              width: `${(currentQuestionNumber / quizData.length) * 100}%`,
              background: `linear-gradient(135deg, ${config.theme.primary} 0%, ${config.theme.secondary} 100%)`
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}