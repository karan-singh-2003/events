const colors = [
  '#FF5733', // Red-Orange
  '#3498db', // Blue
  '#2ecc71', // Green
  '#f1c40f', // Yellow
  '#9b59b6', // Purple
  '#e74c3c', // Red
  '#1abc9c', // Teal
]

/**
 * @param {string} text
 * @returns {string}
 */

export const getColorForString = (text: string): string => {
  if (!text) return colors[0]
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}
