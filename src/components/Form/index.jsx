import { ADD_PERSON } from './graphql-mutation'
import { useMutation } from '@apollo/client'
import { useState } from 'react'
import DataListInput from 'react-datalist-input'
import Loader from '../Loader'

const initialData = {
  name: '',
  country: ''
}

const errorsInForm = {}

export default function Form ({ dataCountries, setIsSucess }) {
  const [addPerson] = useMutation(ADD_PERSON)

  const [data, setData] = useState(initialData)
  const [errors, setErrors] = useState(errorsInForm)
  const [isSending, setIsSending] = useState(false)
  const [dataInBlank, setDataInBlank] = useState(false)

  const validateName = (value) => {
    const regex = /^[a-zA-Z ,.'-]+$/i
    const errorsInForm = JSON.parse(JSON.stringify(errors))
    setDataInBlank(false)

    //* Evaluate that the name is a valid name
    if (!regex.test(value)) {
      setErrors({
        ...errors,
        name: 'El nombre no es valido'
      })
      return
    }

    if (errorsInForm.name) {
      delete errorsInForm.name
      setErrors(errorsInForm)
    }
  }

  const validateCountry = (value) => {
    //* Create a new object of errors
    const errorsInForm = JSON.parse(JSON.stringify(errors))
    setDataInBlank(false)

    //* Find if the country typing or selected is in the array of countries
    if (!dataCountries.find(country => country.value === value)) {
      setErrors({
        ...errors,
        country: 'Escribiste incorrectamente el país'
      })
      return
    }

    //* Delete the error if the country is in the array
    if (errorsInForm.country) {
      delete errorsInForm.country
      setErrors(errorsInForm)
    }
  }

  const handleChange = (e) => {
    if (e.target.name === 'name') {
      validateName(e.target.value)
    }

    if (e.target.name === 'country') {
      validateCountry(e.target.value)
    }

    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    //* Evaluate that the form has no errors
    if (Object.values(errors).length !== 0) return

    //* Evaluate if a field of the form is empty
    const dataInBlank = Object.values(data).some(valueInObject => {
      if (valueInObject.trim() === '') {
        return true
      }
      return false
    })

    if (dataInBlank) {
      setDataInBlank(true)
      return
    }

    try {
      setIsSending(true)

      //* Adding person to the database
      await addPerson({
        variables: {
          name: data.name,
          country: data.country
        }
      })

      setIsSending(false)
      setIsSucess(true)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form className='flex flex-col w-full py-4 px-4 border border-slate-900 bg-slate-200 rounded-md'>
      <h1 className='font-semibold text-xl'>
        Ingresa tus datos para enviar:
      </h1>
      <label className='mt-2'>
        <span className='text-sm font-semibold'>Introduce tu nombre (obligatiorio):</span>
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
        errors.name && (<p className='w-full mt-1 text-sm text-red-400'>{errors.name}</p>)
      }
      {
        dataCountries
          ? (
            <DataListInput
              placeholder='Introduce el nombre de tu país y seleccionalo'
              label='Selecciona el país: (obligatiorio)'
              onSelect={(item) => {
                validateCountry(item.value)
                setData({
                  ...data,
                  country: item.value
                })
              }}
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
                  validateCountry(e.target.id)
                  setData({
                    ...data,
                    country: e.target.id
                  })
                }
              }}
            />
            )
          : (<p className='text-center mt-4'>Cargando datos de los paises ...</p>)
      }
      {
        errors.country && (<p className='w-full mt-1 text-sm text-red-400'>{errors.country}</p>)
      }
      {
        (dataInBlank || Object.values(errors).length !== 0) && (<p className='w-full text-center mt-2 text-sm text-red-400'>Tienes errores o campos sin llenar en el formulario</p>)
      }
      <button onClick={handleSubmit} form='{}' className='transition mt-4 mb-4 mx-8 px-2 py-2 font-semibold border border-slate-700 rounded-lg bg-slate-300 hover:bg-slate-400'>
        {
          isSending ? <Loader width={40} height={40} /> : 'Enviar datos'
        }

      </button>
    </form>
  )
}
