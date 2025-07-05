// Bubble Sort
export function bubbleSort(array) {
  const animations = []
  const arr = array.map(item => item.value)
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      // Compare animation
      animations.push({
        type: 'compare',
        indices: [j, j + 1]
      })

      if (arr[j] > arr[j + 1]) {
        // Swap animation
        animations.push({
          type: 'swap',
          indices: [j, j + 1]
        })
        
        // Actual swap
        const temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
  }

  return animations
}

// Selection Sort
export function selectionSort(array) {
  const animations = []
  const arr = array.map(item => item.value)
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i

    for (let j = i + 1; j < n; j++) {
      // Compare animation
      animations.push({
        type: 'compare',
        indices: [minIndex, j]
      })

      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }

    if (minIndex !== i) {
      // Swap animation
      animations.push({
        type: 'swap',
        indices: [i, minIndex]
      })

      // Actual swap
      const temp = arr[i]
      arr[i] = arr[minIndex]
      arr[minIndex] = temp
    }
  }

  return animations
}

// Insertion Sort
export function insertionSort(array) {
  const animations = []
  const arr = array.map(item => item.value)
  const n = arr.length

  for (let i = 1; i < n; i++) {
    const key = arr[i]
    let j = i - 1

    while (j >= 0) {
      // Compare animation
      animations.push({
        type: 'compare',
        indices: [j, j + 1]
      })

      if (arr[j] > key) {
        // Move element
        animations.push({
          type: 'overwrite',
          index: j + 1,
          value: arr[j]
        })
        arr[j + 1] = arr[j]
        j--
      } else {
        break
      }
    }

    // Insert key
    if (j + 1 !== i) {
      animations.push({
        type: 'overwrite',
        index: j + 1,
        value: key
      })
      arr[j + 1] = key
    }
  }

  return animations
}

// Merge Sort
export function mergeSort(array) {
  const animations = []
  const arr = array.map(item => item.value)
  const auxiliaryArray = arr.slice()

  mergeSortHelper(arr, 0, arr.length - 1, auxiliaryArray, animations)
  return animations
}

function mergeSortHelper(mainArray, startIdx, endIdx, auxiliaryArray, animations) {
  if (startIdx === endIdx) return

  const middleIdx = Math.floor((startIdx + endIdx) / 2)
  mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations)
  mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations)
  doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations)
}

function doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations) {
  let k = startIdx
  let i = startIdx
  let j = middleIdx + 1

  while (i <= middleIdx && j <= endIdx) {
    // Compare animation
    animations.push({
      type: 'compare',
      indices: [i, j]
    })

    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      // Overwrite animation
      animations.push({
        type: 'overwrite',
        index: k,
        value: auxiliaryArray[i]
      })
      mainArray[k++] = auxiliaryArray[i++]
    } else {
      // Overwrite animation
      animations.push({
        type: 'overwrite',
        index: k,
        value: auxiliaryArray[j]
      })
      mainArray[k++] = auxiliaryArray[j++]
    }
  }

  while (i <= middleIdx) {
    animations.push({
      type: 'overwrite',
      index: k,
      value: auxiliaryArray[i]
    })
    mainArray[k++] = auxiliaryArray[i++]
  }

  while (j <= endIdx) {
    animations.push({
      type: 'overwrite',
      index: k,
      value: auxiliaryArray[j]
    })
    mainArray[k++] = auxiliaryArray[j++]
  }
}

// Quick Sort
export function quickSort(array) {
  const animations = []
  const arr = array.map(item => item.value)

  quickSortHelper(arr, 0, arr.length - 1, animations)
  return animations
}

function quickSortHelper(array, low, high, animations) {
  if (low < high) {
    const pi = partition(array, low, high, animations)
    quickSortHelper(array, low, pi - 1, animations)
    quickSortHelper(array, pi + 1, high, animations)
  }
}

function partition(array, low, high, animations) {
  const pivot = array[high]
  let i = low - 1

  for (let j = low; j < high; j++) {
    // Compare animation
    animations.push({
      type: 'compare',
      indices: [j, high]
    })

    if (array[j] < pivot) {
      i++
      if (i !== j) {
        // Swap animation
        animations.push({
          type: 'swap',
          indices: [i, j]
        })

        // Actual swap
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }
    }
  }

  // Final swap with pivot
  if (i + 1 !== high) {
    animations.push({
      type: 'swap',
      indices: [i + 1, high]
    })

    const temp = array[i + 1]
    array[i + 1] = array[high]
    array[high] = temp
  }

  return i + 1
}

// Heap Sort
export function heapSort(array) {
  const animations = []
  const arr = array.map(item => item.value)
  const n = arr.length

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i, animations)
  }

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    animations.push({
      type: 'swap',
      indices: [0, i]
    })

    const temp = arr[0]
    arr[0] = arr[i]
    arr[i] = temp

    // Call heapify on the reduced heap
    heapify(arr, i, 0, animations)
  }

  return animations
}

function heapify(arr, n, i, animations) {
  let largest = i
  const left = 2 * i + 1
  const right = 2 * i + 2

  // Compare with left child
  if (left < n) {
    animations.push({
      type: 'compare',
      indices: [left, largest]
    })

    if (arr[left] > arr[largest]) {
      largest = left
    }
  }

  // Compare with right child
  if (right < n) {
    animations.push({
      type: 'compare',
      indices: [right, largest]
    })

    if (arr[right] > arr[largest]) {
      largest = right
    }
  }

  // If largest is not root
  if (largest !== i) {
    animations.push({
      type: 'swap',
      indices: [i, largest]
    })

    const temp = arr[i]
    arr[i] = arr[largest]
    arr[largest] = temp

    // Recursively heapify the affected sub-tree
    heapify(arr, n, largest, animations)
  }
}
