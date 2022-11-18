import { gql } from '@apollo/client'

const ADD_PERSON = gql`
  mutation($name: String!, $country: String!){
    addPerson(name: $name, country: $country) {
      name
      country
    }
  }
`

export { ADD_PERSON }
