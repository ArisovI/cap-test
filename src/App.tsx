import { useState, useEffect, useRef } from 'react'
import './App.css'
import { api } from './api'

function App() {
  const [enabled, setEnabled] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [catUrl, setCatUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const intervalRef = useRef<number | null>(null)

  const fetchCat = async () => {
    setIsLoading(true)
    try {
      await api('search').then((res) => {
        setIsLoading(false)
        if (res.data) {
          setCatUrl(res.data[0].url)
        }
      })
    } catch (error) {
      alert(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
    }

    if (enabled && autoRefresh) {
      fetchCat()
      intervalRef.current = setInterval(fetchCat, 5000)
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, autoRefresh])

  return (
    <div className="app">
      <div className="enabled">
        <input
          type="checkbox"
          id="enabled"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        <label htmlFor="enabled">Enabled</label>
      </div>

      <div className="auto-refresh">
        <input
          type="checkbox"
          id="auto-refresh"
          checked={autoRefresh}
          disabled={!enabled}
          onChange={(e) => setAutoRefresh(e.target.checked)}
        />
        <label htmlFor="auto-refresh">Auto-refresh every 5 seconds</label>
      </div>

      {!autoRefresh && (
        <button onClick={fetchCat} disabled={!enabled && isLoading}>
          Get cat
        </button>
      )}

      {catUrl && (
        <div className="cat-image">
          <img src={catUrl} alt="Cute cat" />
        </div>
      )}
    </div>
  )
}

export default App
