import { auth , db} from '../firebase/firebaseConfig';
import { doc,runTransaction } from 'firebase/firestore';

const correlativos = async ()=>{    

        //Prueba generacion de folios unicos    
        const docRef = doc(db,'correlativos','folio')
        try {
            await runTransaction(db, async(t)=>{
                const f = await t.get(docRef);
                if(!f.exists()){
                    console.log('no existe document')
                }else{
                    const nuevoFolio = f.data().corr + 1;
                    t.update(docRef, { corr: nuevoFolio});
                    console.log('folio es:', nuevoFolio)
                    return nuevoFolio;
                } 
               
            })
            
        } catch (error) {
            console.log('error de folio', error);
        }
} 


export default correlativos;
