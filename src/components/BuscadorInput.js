// src/components/SearchBar.js
import React, { useState } from 'react';
import { Input } from '../elementos/CrearEquipos';
import styled from 'styled-components';

const SearchBar = ({ items,onSelectItem,limpiaFormCte}) => {
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
      limpiaFormCte();
    }
  };

  const handleSelectItem = (item) => {
    setQueryText(item.rut);
    setFilteredItems([]);
    onSelectItem(item);    
  };

  const detectarKey =(e)=>{
    if((e.key ==='Enter' || e.key==='Tab')&& filteredItems.length ===0){
      /* e.preventDefault();
      if(filteredItems.length > 0){
        handleSelectItem(filteredItems[0]);
      }else{
        handleSelectItem(e.target.value);
        console.log('no existe coincidencias')
      } */
        handleSelectItem(e.target.value);
    }else if((e.key ==='Enter' || e.key==='Tab')&& filteredItems.length ===1){
        handleSelectItem(filteredItems[0]);
    }
  }

  return (
    <>
      <Input
        style={{outlineColor:'#F0A70A'}}       
        type="text"
        value={queryText}
        onChange={handleInputChange}
        placeholder="Ingrese Rut o Nombre"
        onKeyDown={detectarKey}
      />
      {filteredItems.length > 0 && (
        <Lista>
          {filteredItems.map((item, index) => (
            <Li key={index} onClick={() => handleSelectItem(item)}>
              {item.rut} {item.nombre}
            </Li>
          ))}
        </Lista>
      )}
    </>
  );
};

export default SearchBar;

const  Lista = styled.ul`
    border-radius:0.625rem;
    background-color: #ffff;
    position: absolute;
   /*  top:1.62rem; */
    list-style: none;
    padding: 0;
    margin: 0;
    border: 1px solid #ccc;
    width: 300px;
    max-height: 150px;
    overflow-y: auto;
`
const Li = styled.li`
      padding: 8px;
      cursor: pointer;
      &hover {
        background-color: #8CF7F7;
      }
`

