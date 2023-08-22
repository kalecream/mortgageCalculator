import { useState } from 'react'
import Form from './components/form';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Form />
    </>
  )
}

export default App
