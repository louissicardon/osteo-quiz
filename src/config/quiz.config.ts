import { QuizConfig, QuizType } from '../types/quiz.types'

export const QUIZ_CONFIGS: Record<QuizType, QuizConfig> = {
  legislation: {
    title: 'Législation',
    filename: 'legislation.json',
    theme: {
      primary: '#667eea',
      secondary: '#764ba2',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  },
  pharmacologie: {
    title: 'Pharmacologie',
    filename: 'pharmacologie.json',
    theme: {
      primary: '#f093fb',
      secondary: '#f5576c',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    }
  },
  zootechnie: {
    title: 'Zootechnie',
    filename: 'zootechnie.json',
    theme: {
      primary: '#4facfe',
      secondary: '#00f2fe',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
  }
}