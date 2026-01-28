export function cn(...inputs) {
  const classes = []

  const pushValue = (value) => {
    if (!value) return

    if (typeof value === 'string' || typeof value === 'number') {
      classes.push(String(value))
      return
    }

    if (Array.isArray(value)) {
      value.forEach(pushValue)
      return
    }

    if (typeof value === 'object') {
      for (const [key, isEnabled] of Object.entries(value)) {
        if (isEnabled) classes.push(key)
      }
    }
  }

  inputs.forEach(pushValue)
  return classes.join(' ')
}

