'use client'

import { useState, useEffect, useMemo } from 'react'
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
  
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [usedIndexes, setUsedIndexes] = useState<number[]>([])
  const [showAnswer, setShowAnswer] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Questions mélangées une seule fois
  const shuffledQuestions = useMemo(() => 
    [...questions].sort(() => Math.random() - 0.5), 
    [questions]
  )

  const currentQuestion = shuffledQuestions[questionIndex]
  
  // Réponses mélangées à chaque nouvelle question
  const shuffledChoices = useMemo(() => 
    currentQuestion ? [...currentQuestion.choices].sort(() => Math.random() - 0.5) : [],
    [currentQuestion]
  )

  // Chargement des questions
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch(getAssetPath(`/${config.filename}`))
        const data = await response.json()
        setQuestions(data)
      } catch {
        setError(`Impossible de charger les questions du Quiz ${config.title}.`)
      } finally {
        setLoading(false)
      }
    }
    loadQuestions()
  }, [config.filename, config.title])

  const nextQuestion = () => {
    // Choisir un index aléatoire parmi ceux non utilisés
    const availableIndexes = shuffledQuestions
      .map((_, index) => index)
      .filter(index => !usedIndexes.includes(index))
    
    if (availableIndexes.length === 0) return // Plus de questions disponibles
    
    const randomIndex = Math.floor(Math.random() * availableIndexes.length)
    const newIndex = availableIndexes[randomIndex]
    
    setUsedIndexes(prev => [...prev, newIndex])
    setQuestionIndex(newIndex)
    setShowAnswer(false)
  }

  // Initialiser la première question
  useEffect(() => {
    if (shuffledQuestions.length > 0 && usedIndexes.length === 0) {
      const firstIndex = Math.floor(Math.random() * shuffledQuestions.length)
      setQuestionIndex(firstIndex)
      setUsedIndexes([firstIndex])
    }
  }, [shuffledQuestions.length, usedIndexes.length])

  // États d'erreur et de chargement
  if (loading || error || (shuffledQuestions.length === 0 && !loading)) {
    return (
      <div className={styles.container} style={{ background: config.theme.background }}>
        <div className={styles.questionContainer}>
          {loading && <div>Chargement des questions du Quiz {config.title}...</div>}
          {error && <div>{error}</div>}
          {!loading && !error && shuffledQuestions.length === 0 && <div>Aucune question disponible.</div>}
          {(error || (!loading && shuffledQuestions.length === 0)) && (
            <Link href="../" className={styles.homeLink}>Retour à l'accueil</Link>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container} style={{ background: config.theme.background }}>
      <div className={styles.header}>
        <Link href="../" className={styles.homeLink}>← Retour à l'accueil</Link>
        <h2 className={styles.quizTitle}>{config.title}</h2>
      </div>
      
      <div className={styles.questionContainer}>
        <div className={styles.question}>{currentQuestion.question}</div>
        
        <div className={styles.answers}>
          {shuffledChoices.map((choice, index) => (
            <button
              key={index}
              className={`${styles.answerButton} ${
                showAnswer ? (choice.correct ? styles.correct : styles.incorrect) : ''
              }`}
              onClick={() => setShowAnswer(true)}
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
          <>
            <div className={styles.source} style={{ borderLeftColor: config.theme.primary }}>
              <strong>Source{Array.isArray(currentQuestion.source) ? 's' : ''} :</strong>
              {Array.isArray(currentQuestion.source) ? (
                <ul className={styles.sourceList}>
                  {currentQuestion.source.map((src, i) => (
                    <li key={i}>
                      <a href={src} target="_blank" rel="noopener noreferrer">{src}</a>
                    </li>
                  ))}
                </ul>
              ) : (
                <a href={currentQuestion.source} target="_blank" rel="noopener noreferrer">
                  {currentQuestion.source}
                </a>
              )}
            </div>

            {showAnswer && usedIndexes.length < shuffledQuestions.length && (
              <button 
                className={styles.nextButton} 
                onClick={nextQuestion}
                style={{ background: `linear-gradient(135deg, ${config.theme.primary} 0%, ${config.theme.secondary} 100%)` }}
              >
                Question suivante
              </button>
            )}
          </>
        )}
      </div>

      <div className={styles.progressContainer}>
        <span className={styles.progressText}>
          Question {usedIndexes.length} / {shuffledQuestions.length}
        </span>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ 
              width: `${(usedIndexes.length / shuffledQuestions.length) * 100}%`,
              background: `linear-gradient(135deg, ${config.theme.primary} 0%, ${config.theme.secondary} 100%)`
            }}
          />
        </div>
      </div>
    </div>
  )
}