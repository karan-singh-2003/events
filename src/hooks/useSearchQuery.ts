import { useState, useEffect } from 'react'

const useSearchQuery = <T>(query: string, apiUrl: string, delay = 500) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query)
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query)
    }, delay)

    return () => clearTimeout(handler)
  }, [query, delay])

  useEffect(() => {
    if (!debouncedQuery) {
      setData(null)
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        console.log(`Fetching: ${apiUrl}?id=${debouncedQuery}`)
        const response = await fetch(`${apiUrl}?id=${debouncedQuery}`)
        const result = await response.json()
        console.log('API Response:', result)
        setData(result)
      } catch (err) {
        setError('Error fetching data')
        console.error('Fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [debouncedQuery, apiUrl])

  return { data, isLoading, error }
}

export default useSearchQuery
