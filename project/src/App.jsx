import { useState, useEffect } from 'react'
import Monetization from './components/monetization/Monetization'
import FruitApp from './components/FruitApp'

function App() {

  return (
    <Monetization>
      <FruitApp />
    </Monetization>
  )
}

export default App