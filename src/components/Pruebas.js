// import React, { useState } from 'react';

// const FormularioDinamico = () => {
//     const [formulario, setFormulario] = useState([]);

//     const campos = [
//         { id: 1, nombre: 'Nombre', tipo: 'texto' },
//         { id: 2, nombre: 'Nombre', tipo: 'texto' },
//         { id: 3, nombre: 'Nombre', tipo: 'texto' },
//         { id: 4, nombre: 'Nombre', tipo: 'texto' },
//         // Agrega más campos aquí...
//     ];

//     console.log('campos', campos)

//     const handleChange = (e, campo) => {
//         setFormulario({
//             ...campo,
//             observacion: e.target.value,
//         });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log('Valores del formulario:', formulario);
//         // Realiza acciones con los valores del formulario, como enviarlos a un servidor
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             {campos.map((campo) => (
//                 <div key={campo.id}>
//                     <label htmlFor={campo.nombre}>{campo.nombre}</label>
//                     <input
//                         type={campo.tipo}
//                         id={campo.nombre}
//                         name={campo.nombre}
//                         value={formulario[campo.id] || ''}
//                         onChange={(e) => handleChange(e, campo)}
//                     />
//                 </div>
//             ))}
//             <button type="submit">Enviar</button>
//         </form>
//     );
// };

// export default FormularioDinamico;


import React, { useState } from 'react';

const FormularioDinamico = () => {
    const [campos, setCampos] = useState([
        { id: 1, nombre: 'Nombre', tipo: 'texto', valor: '' },
        { id: 2, nombre: 'Nombre', tipo: 'texto', valor: '' },
        { id: 3, nombre: 'Nombre', tipo: 'texto', valor: '' },
        { id: 4, nombre: 'Nombre', tipo: 'texto', valor: '' },
        
        // Agrega más campos aquí...
    ]);

    const handleChange = (e, campo) => {
        const nuevosCampos = campos.map((c) => {
            if (c.id === campo.id) {
                return { ...c, valor: e.target.value };
            }
            return c;
        });
        setCampos(nuevosCampos);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Valores del formulario:', campos);
        // Realiza acciones con los valores del formulario, como enviarlos a un servidor
    };

    return (
        <form onSubmit={handleSubmit}>
            {campos.map((campo) => (
                <div key={campo.id}>
                    <label htmlFor={campo.nombre}>{campo.nombre}</label>
                    <input
                        type={campo.tipo}
                        id={campo.nombre}
                        name={campo.nombre}
                        value={campo.valor}
                        onChange={(e) => handleChange(e, campo)}
                    />
                </div>
            ))}
            <button type="submit">Enviar</button>
        </form>
    );
};

export default FormularioDinamico;
