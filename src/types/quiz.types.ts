export interface Choice {
  text: string
  correct: boolean
}

export interface Question {
  question: string
  choices: Choice[]
  source: string | string[]
}

export interface QuizConfig {
  title: string
  filename: string
  theme: {
    primary: string
    secondary: string
    background: string
  }
}

export type QuizType = 'legislation' | 'pharmacologie' | 'zootechnie'