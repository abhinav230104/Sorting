import { useState, useEffect } from 'react'
import './App.css'
import SortingVisualizer from './components/SortingVisualizer'

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Sorting Algorithm Visualizer</h1>
        <p>Watch how different sorting algorithms work in real-time!</p>
      </header>
      <SortingVisualizer />
    </div>
  )
}

export default App
