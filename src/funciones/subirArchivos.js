import { uploadBytes, ref, getDownloadURL  } from 'firebase/storage'
import { storage } from '.././firebase/firebaseConfig'
import {  v4 } from 'uuid';
 
//Función para subir archivos a bucket
const subirArchivos = (file) => {

    const storageRef = ref(storage, `entradas/${v4()}`);
    uploadBytes(storageRef, file).then(snapshot => {
        console.log(snapshot)
    })
   
   
}
 
export default subirArchivos ;