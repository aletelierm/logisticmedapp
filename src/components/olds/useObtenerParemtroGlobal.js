import { useState } from 'react';
import { db, auth } from '../../firebase/firebaseConfig';
import { doc, getDoc, collection, setDoc } from 'firebase/firestore';
/* import { useNavigate } from 'react-router-dom';; */




  const Obtener = ()=>{   
       
        const [nombre, setnombre] = useState('');
        let fechaActual = new Date();
        const user = auth.currentUser;
        const id = user.uid;
        console.log(id)

        const leer = async ()=>{
           
                const parametro = await getDoc(doc(db,'usuarios',id));
                    if(parametro.exists()){
                        console.log('datos:',parametro.data())
                        setnombre(parametro.data());
                    }else{
                        console.log('no existe');
                    }
                
        }

        const crear = async ()=>{

            const coleccion = collection(db, 'usuarios');

             await setDoc(doc(coleccion, id), {
                    nombre: 'Catalina',
                    apellido: 'Astudillo',
                    empresa: 'ALLCOMPANY',
                    ROL: 'DADMIN',
                    USER_ADD: user.email,
                    USER_MOD: user.email,
                    FECHA_ADD: fechaActual,
                    FECHA_MOD: fechaActual
            });

        }        
        return(
            <>
            
            <button onClick={leer}>leer</button>
            <button onClick={crear}>crear</button>
            <h2>{ nombre.nombre}</h2>
            <h2>{ nombre.apellido}</h2>
            <h2>{ nombre.rol}</h2>
            <h2>{ nombre.empresa}</h2>
            
            </>
        )
 

   

}
 


       
export default Obtener;