import React from 'react'
import { Select } from 'semantic-ui-react'


const SelectExample = ({placeholder, opciones}) => (
  <Select  placeholder={placeholder} options={opciones} />
)

export default SelectExample