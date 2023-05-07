import {  createUserWithEmailAndPassword } from 'firebase/auth';
import { auth ,db} from '../../firebase/firebaseConfig';
import { doc, collection, setDoc } from 'firebase/firestore';


const  registroAuthUsuario = async ({correo, pass,nombre,apellido,nomEmpresa,rol,useradd,usermod,fechaactual})=>{
      
      

        //Crear usuario en Auth
      return  createUserWithEmailAndPassword(auth, correo, pass)
        .then(()=>{
                //Obtener id de usuario creado en Auth
                const id = auth.currentUser.uid;
                //Crear usuarios
                const crear = async ()=>{
                    const coleccion = collection(db, 'usuarios');        
                     await setDoc(doc(coleccion, id), {
                            nombre: nombre,
                            apellido: apellido,
                            empresa: nomEmpresa,
                            rol: rol,
                            user_add: useradd,
                            user_mod: usermod,
                            fecha_add: fechaactual,
                            fecha_mod: fechaactual
                    });        
                }    
               crear();
        })
        .catch((error)=>{
                
                const errorMsg = error.message;
                console.log(errorMsg)
               

        });
       
       

       
 }

 export default registroAuthUsuario;

       
