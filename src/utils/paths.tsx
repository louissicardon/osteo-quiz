export function getAssetPath(path: string): string {
  // En développement local ou si pas de basePath configuré
  if (process.env.NODE_ENV === 'development') {
    return path;
  }
  
  // En production avec GitHub Pages
  const basePath = '/osteo-quiz';
  return `${basePath}${path}`;
}