import { ADD_PERSON } from './graphql-mutation'
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import DataListInput from 'react-datalist-input'
import Loader from '../Loader'

const initialData = {
  name: '',
  country: ''
}

export default function Form ({ dataCountries }) {
  const [addPerson] = useMutation(ADD_PERSON)
  const [data, setData] = useState(initialData)
  const [isSending, setIsSending] = useState(false)

  /* useEffect(() => {
    const addingPerson = async () => {
      c
    }

    addingPerson()
  }, [])
 */
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsSending(true)
      const dataSend = await addPerson({
        variables: {
          name: data.name,
          country: data.country
        }
      })
      console.log(dataSend)
      setIsSending(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  return (
    <form className='flex flex-col w-full py-4 px-4 border border-slate-900 bg-slate-200 rounded-md'>
      <h1 className='font-semibold text-xl'>
        Ingresa tus datos para enviar:
      </h1>
      <label className='mt-2'>
        <span className='text-sm font-semibold'>Introduce tu nombre:</span>
        <input
          type='text'
          name='name'
          onChange={handleChange}
          value={data.name}
          className='w-full outline-none p-1 text-base border-b border-b-slate-700 bg-transparent'
          placeholder='Introduce tu nombre'
        />
      </label>
      {
        dataCountries
          ? (
            <DataListInput
              placeholder='Introduce el nombre de tu país y seleccionalo'
              label='Selecciona el país:'
              onSelect={(item) => setData({
                ...data,
                country: item.value
              })}
              items={dataCountries}
              className='w-full mt-4'
              listboxProps={{
                className: 'absolute max-h-[200px] h-min overflow-y-scroll outline-none bg-white w-[366px] border border-gray-500'
              }}
              labelProps={{
                className: 'text-sm font-semibold'
              }}
              inputProps={{
                className: 'relative w-full outline-none p-1 text-base border-b border-b-slate-700 bg-transparent',
                name: 'country',
                value: data.value,
                onChange: (e) => { handleChange(e) }
              }}
              listboxOptionProps={{
                className: 'hover:bg-gray-400 cursor-pointer',
                onClick: (e) => {
                  setData({
                    ...data,
                    country: e.target.id
                  })
                }
              }}
            />
            )
          : (<div>Cargando</div>)
      }
      <button onClick={handleSubmit} className='transition mt-6 mb-4 mx-8 px-2 py-2 font-semibold border border-slate-700 rounded-lg bg-slate-300 hover:bg-slate-400'>
        {
          isSending ? <Loader width={40} height={40} /> : 'Enviar datos'
        }

      </button>
    </form>
  )
}
