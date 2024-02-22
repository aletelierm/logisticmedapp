import { uploadBytes, ref  } from 'firebase/storage'
import { storage } from '.././firebase/firebaseConfig'

//Función para subir archivos a bucket
const subirArchivos = (file) => {

    const storageRef = ref(storage, "entradas/imagen");
    uploadBytes(storageRef, file).then(snapshot => {
        console.log(snapshot)
    })

   
}
 
export default subirArchivos ;