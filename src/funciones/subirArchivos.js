import { uploadBytes, ref, getDownloadURL  } from 'firebase/storage'
import { storage } from '.././firebase/firebaseConfig'
import {  v4 } from 'uuid';
 
//Función para subir archivos a bucket
const subirArchivos = async (file) => {

    const storageRef = ref(storage, `entradas/${v4()}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
}
 
export default subirArchivos ;