import { generateUUID } from '../utils'

export type ResumeSuggestion = {
  id: string
  section: string
  original: string
  suggested: string
  explanation: string
}

export function parseSuggestions(content: string): ResumeSuggestion[] | null {
  try {
    const jsonMatch = content.trim().match(/^\[\s*\{[\s\S]*\}\s*\]$/)
    if (!jsonMatch) return null

    const jsonStr = jsonMatch[0]
    const suggestions = JSON.parse(jsonStr) as ResumeSuggestion[]

    if (!Array.isArray(suggestions)) return []

    return suggestions.map((suggestion) => ({
      id: suggestion.id ?? generateUUID(),
      section: suggestion.section ?? '',
      original: suggestion.original ?? '',
      suggested: suggestion.suggested ?? '',
      explanation: suggestion.explanation ?? '',
    }))
  } catch {
    console.error('Failed to parse suggestions:', content)
    return []
  }
}
