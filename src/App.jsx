import Form from './components/Form'
import Notification from './components/Notification'
import { useState, useEffect } from 'react'

function App () {
  const [dataCountries, setDataCountries] = useState(null)
  const [isSucess, setIsSucess] = useState(false)

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

  useEffect(() => {
    setTimeout(() => {
      setIsSucess(false)
    }, 3000)
  }, [isSucess])

  return (
    <main className='relative grid items-center justify-center w-screen h-screen overflow-x-hidden'>
      <section className='w-[400px] h-min'>
        <Form dataCountries={dataCountries} setIsSucess={setIsSucess} />
        <Notification isSucess={isSucess} />
      </section>
    </main>
  )
}

export default App
