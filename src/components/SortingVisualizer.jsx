import { useState, useEffect, useCallback } from 'react'
import './SortingVisualizer.css'
import * as sortingAlgorithms from '../algorithms/sortingAlgorithms'

const SortingVisualizer = () => {
  const [array, setArray] = useState([])
  const [arraySize, setArraySize] = useState(50)
  const [isAnimating, setIsAnimating] = useState(false)
  const [speed, setSpeed] = useState(50)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubbleSort')
  const [comparisons, setComparisons] = useState(0)
  const [swaps, setSwaps] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  // Initialize array
  const generateNewArray = useCallback(() => {
    const newArray = []
    for (let i = 0; i < arraySize; i++) {
      newArray.push({
        value: Math.floor(Math.random() * 400) + 10,
        isComparing: false,
        isSwapping: false,
        isSorted: false
      })
    }
    setArray(newArray)
    setComparisons(0)
    setSwaps(0)
    setCurrentStep(0)
  }, [arraySize])

  useEffect(() => {
    generateNewArray()
  }, [generateNewArray])

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Reset array states
  const resetArrayStates = () => {
    setArray(prev => prev.map(item => ({
      ...item,
      isComparing: false,
      isSwapping: false,
      isSorted: false
    })))
  }

  // Animate sorting
  const animateSort = async () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    resetArrayStates()
    setComparisons(0)
    setSwaps(0)
    setCurrentStep(0)

    // Create a local copy of the array to work with
    let currentArray = array.map(item => ({ ...item }))
    const animations = sortingAlgorithms[selectedAlgorithm](currentArray.map(item => ({ ...item })))
    
    let comparisonCount = 0
    let swapCount = 0

    for (let i = 0; i < animations.length; i++) {
      const animation = animations[i]
      setCurrentStep(i + 1)

      if (animation.type === 'compare') {
        comparisonCount++
        setComparisons(comparisonCount)
        
        // Reset all states first
        currentArray = currentArray.map(item => ({
          ...item,
          isComparing: false,
          isSwapping: false
        }))
        
        // Highlight the compared elements
        animation.indices.forEach(index => {
          currentArray[index].isComparing = true
        })
        
        setArray([...currentArray])
        await new Promise(resolve => setTimeout(resolve, Math.max(50, 101 - speed)))
        
      } else if (animation.type === 'swap') {
        swapCount++
        setSwaps(swapCount)
        
        // Reset all states first
        currentArray = currentArray.map(item => ({
          ...item,
          isComparing: false,
          isSwapping: false
        }))
        
        // Highlight the elements being swapped
        animation.indices.forEach(index => {
          currentArray[index].isSwapping = true
        })
        
        setArray([...currentArray])
        await new Promise(resolve => setTimeout(resolve, Math.max(25, (101 - speed) / 2)))
        
        // Actually swap the values
        const [i, j] = animation.indices
        const temp = currentArray[i].value
        currentArray[i].value = currentArray[j].value
        currentArray[j].value = temp
        
        setArray([...currentArray])
        await new Promise(resolve => setTimeout(resolve, Math.max(25, (101 - speed) / 2)))
        
      } else if (animation.type === 'overwrite') {
        // Reset all states first
        currentArray = currentArray.map(item => ({
          ...item,
          isComparing: false,
          isSwapping: false
        }))
        
        // Highlight the element being overwritten
        currentArray[animation.index].isSwapping = true
        
        setArray([...currentArray])
        await new Promise(resolve => setTimeout(resolve, Math.max(25, (101 - speed) / 2)))
        
        // Update the value
        currentArray[animation.index].value = animation.value
        
        setArray([...currentArray])
        await new Promise(resolve => setTimeout(resolve, Math.max(25, (101 - speed) / 2)))
      }
    }

    // Mark all as sorted
    currentArray = currentArray.map(item => ({
      ...item,
      isComparing: false,
      isSwapping: false,
      isSorted: true
    }))
    
    setArray([...currentArray])
    setIsAnimating(false)
  }

  const algorithms = [
    { value: 'bubbleSort', label: 'Bubble Sort' },
    { value: 'selectionSort', label: 'Selection Sort' },
    { value: 'insertionSort', label: 'Insertion Sort' },
    { value: 'mergeSort', label: 'Merge Sort' },
    { value: 'quickSort', label: 'Quick Sort' },
    { value: 'heapSort', label: 'Heap Sort' }
  ]

  return (
    <div className="sorting-visualizer">
      <div className="controls">
        <div className="control-group">
          <label>Algorithm:</label>
          <select 
            value={selectedAlgorithm} 
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            disabled={isAnimating}
          >
            {algorithms.map(algo => (
              <option key={algo.value} value={algo.value}>
                {algo.label}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Array Size: {arraySize}</label>
          <input
            type="range"
            min="10"
            max="100"
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            disabled={isAnimating}
          />
        </div>

        <div className="control-group">
          <label>Speed: {speed}%</label>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={isAnimating}
          />
        </div>

        <div className="button-group">
          <button 
            onClick={generateNewArray}
            disabled={isAnimating}
            className="btn btn-secondary"
          >
            Generate New Array
          </button>
          
          <button 
            onClick={animateSort}
            disabled={isAnimating}
            className="btn btn-primary"
          >
            {isAnimating ? 'Sorting...' : 'Start Sorting'}
          </button>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <span className="stat-label">Comparisons:</span>
          <span className="stat-value">{comparisons}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Swaps:</span>
          <span className="stat-value">{swaps}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Step:</span>
          <span className="stat-value">{currentStep}</span>
        </div>
      </div>

      <div className="array-container">
        {array.map((item, index) => (
          <div
            key={index}
            className={`array-bar ${item.isComparing ? 'comparing' : ''} ${
              item.isSwapping ? 'swapping' : ''
            } ${item.isSorted ? 'sorted' : ''}`}
            style={{
              height: `${item.value}px`,
              width: `${Math.max((windowWidth * 0.7) / arraySize - 2, 3)}px`
            }}
          >
            <span className="bar-value">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="algorithm-info">
        <h3>Algorithm Information</h3>
        <div className="complexity-info">
          {getAlgorithmInfo(selectedAlgorithm)}
        </div>
      </div>
    </div>
  )
}

const getAlgorithmInfo = (algorithm) => {
  const info = {
    bubbleSort: {
      name: 'Bubble Sort',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.'
    },
    selectionSort: {
      name: 'Selection Sort',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      description: 'Finds the minimum element and places it at the beginning, then repeats for the remaining array.'
    },
    insertionSort: {
      name: 'Insertion Sort',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      description: 'Builds the final sorted array one item at a time by inserting each element into its correct position.'
    },
    mergeSort: {
      name: 'Merge Sort',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      description: 'Divides the array into halves, sorts them separately, then merges them back together.'
    },
    quickSort: {
      name: 'Quick Sort',
      timeComplexity: 'O(n log n) avg, O(n²) worst',
      spaceComplexity: 'O(log n)',
      description: 'Picks a pivot element and partitions the array around it, then recursively sorts the subarrays.'
    },
    heapSort: {
      name: 'Heap Sort',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(1)',
      description: 'Builds a max heap, then repeatedly extracts the maximum element and rebuilds the heap.'
    }
  }

  const algo = info[algorithm]
  return (
    <div>
      <h4>{algo.name}</h4>
      <p><strong>Time Complexity:</strong> {algo.timeComplexity}</p>
      <p><strong>Space Complexity:</strong> {algo.spaceComplexity}</p>
      <p><strong>Description:</strong> {algo.description}</p>
    </div>
  )
}

export default SortingVisualizer
