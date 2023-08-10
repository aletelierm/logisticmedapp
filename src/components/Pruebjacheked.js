import React, { useState } from 'react';

const CheckboxComponent = () => {
    const initialItems = [
        { id: 1, nombre: 'Item 1', seleccionado: false },
        { id: 2, nombre: 'Item 2', seleccionado: false },
        { id: 3, nombre: 'Item 3', seleccionado: false },
        { id: 4, nombre: 'Item 4', seleccionado: false },
        { id: 5, nombre: 'Item 5', seleccionado: false },
        { id: 6, nombre: 'Item 6', seleccionado: false },
        // ...otros elementos
    ];

    const [items, setItems] = useState(initialItems);

    const handleCheckboxChange = (itemId) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId ? { ...item, seleccionado: !item.seleccionado } : item
            )

        );

    };

    return (
        <div>
            {items.map((item) => (
                <div key={item.id}>
                    <input
                        type="checkbox"
                        checked={item.seleccionado}
                        onChange={() => handleCheckboxChange(item.id)}
                    />
                    <label>{item.nombre}</label>
                </div>
            ))}
            {console.log('despues del check:', items)}
        </div>
    );
};

export default CheckboxComponent;