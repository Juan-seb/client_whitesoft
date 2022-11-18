import Form from './components/Form'
import { useState, useEffect } from 'react'

function App () {
  const [dataCountries, setDataCountries] = useState(null)
  const [isSend, setIsSend] = useState(false)

  useEffect(() => {
    const getDataCountries = async () => {
      try {
        const res = await fetch('https://restcountries.com/v3.1/all')
        const json = await res.json()

        const dataCountries = json.map(country => {
          return {
            id: country.name.common,
            value: country.name.common
          }
        })

        setDataCountries(dataCountries)
      } catch (error) {
        console.log(error)
      }
    }

    getDataCountries()
  }, [])

  return (
    <main className='grid items-center justify-center w-screen h-screen'>
      <section className='w-[400px] h-min'>
        <Form dataCountries={dataCountries} />
      </section>
    </main>
  )
}

export default App
