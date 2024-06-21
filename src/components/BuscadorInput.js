// src/components/SearchBar.js
import React, { useState } from 'react';
import { Input } from '../elementos/CrearEquipos';

const SearchBar = ({ items }) => {
  const [queryText, setQueryText] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQueryText(value);
    if (value.length > 0) {
      const filtered = items.filter(
        (item) =>
          item.rut.toLowerCase().includes(value.toLowerCase()) ||
          item.nombre.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems([]);
    }
  };

  const handleSelectItem = (item) => {
    setQueryText(item.rut);
    setFilteredItems([]);
  };

  return (
    <>
      <Input
        type="text"
        value={queryText}
        onChange={handleInputChange}
        placeholder="Buscar..."
      />
      {filteredItems.length > 0 && (
        <ul>
          {filteredItems.map((item, index) => (
            <li key={index} onClick={() => handleSelectItem(item)}>
              {item.rut} {item.nombre}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default SearchBar;