export const bgColor = ['#C90FA7', '#FFDA5F', '#A11313', '#CC6014']

export const textColor = ['#EE97FF', '#FFEC5E', '#FF6262', '#FF8938']

export const getRoleTextColor = (text: string): string => {
  if (text === 'admin') return '#82FF69'
  if (text.trim().toLowerCase().includes('subadmin')) return '#C9BDFF'

  if (text.trim().toLowerCase().includes('admin')) return '#5EFAFF'
  if (!text) return textColor[0]
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash)
  }
  return textColor[Math.abs(hash) % textColor.length]
}

export const getRoleBgColor = (text: string): string => {
  if (text === 'admin') return '#18C023'
  if (text.trim().toLowerCase().includes('subadmin')) return '#3C14EF'
  if (text.trim().toLowerCase().includes('admin')) return '#5FCFFF'

  if (!text) return bgColor[0]
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash)
  }
  return bgColor[Math.abs(hash) % bgColor.length]
}

export const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
