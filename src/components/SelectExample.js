import React from 'react'
import { Select } from 'semantic-ui-react'

const countryOptions = [
  { key: '1', value: '1', text: 'Ventilador' },
  { key: 'ax', value: 'ax', text: 'Mascarilla' },
]

const SelectExample = ({placeholder}) => (
  <Select  placeholder={placeholder} options={countryOptions} />
)

export default SelectExample