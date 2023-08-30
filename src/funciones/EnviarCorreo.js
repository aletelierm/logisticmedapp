import { db } from '../firebase/firebaseConfig';
import { collection, addDoc} from '@firebase/firestore';

export default async function EnviarCorreo(email, asunto, cuerpo){
    const coleccionRef = collection(db, 'mail');
    const contenido = {
        to: email,
        message: {
          subject: asunto,
          text: cuerpo,
          html: `${cuerpo}`
          
        },
    };
    return await addDoc(coleccionRef, contenido);
}