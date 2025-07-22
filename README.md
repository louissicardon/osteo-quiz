# Quiz Législation Ostéopathie Animale

Application Next.js pour un quiz interactif sur la législation de l'ostéopathie animale en France.

## Fonctionnalités

- Questions à choix multiples avec réponses mélangées
- Affichage des bonnes/mauvaises réponses
- Sources pour chaque question
- Questions présentées de manière aléatoire
- Interface responsive

## Installation et développement

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Déploiement

### GitHub Pages (Automatique)
Le projet est configuré pour un déploiement automatique sur GitHub Pages via GitHub Actions.

1. Pushez votre code sur la branche `main`
2. GitHub Actions va automatiquement builder et déployer l'application
3. L'application sera disponible sur `https://votre-username.github.io/quiz-legislation-osteopathie/`

### Configuration GitHub Pages
1. Allez dans Settings > Pages de votre repository
2. Source: "Deploy from a branch"
3. Branch: `gh-pages` / `/ (root)`

## Structure du projet

```
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── page.module.css
├── public/
│   └── questions.json
├── .github/
│   └── workflows/
│       └── deploy.yml
├── next.config.js
├── package.json
└── README.md
```

## Personnalisation

### Ajouter des questions
Modifiez le fichier `public/questions.json` avec vos propres questions :

```json
[
  {
    "question": "Votre question ici ?",
    "choices": [
      { "text": "Réponse A", "correct": false },
      { "text": "Réponse B", "correct": true },
      { "text": "Réponse C", "correct": false },
      { "text": "Réponse D", "correct": false }
    ],
    "source": "https://source-url.com"
  }
]
```

### Personnaliser le style
Les styles sont dans `src/app/page.module.css` et peuvent être modifiés selon vos besoins.

## Technologies utilisées

- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **CSS Modules** - Styles isolés
- **GitHub Actions** - CI/CD automatique
- **GitHub Pages** - Hébergement gratuit

## Licence

Ce projet est open source et disponible sous licence MIT.