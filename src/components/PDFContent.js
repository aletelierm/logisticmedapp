import React, { useState, useEffect } from 'react';
// import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { db } from '../firebase/firebaseConfig';
import { getDocs, collection, where, query } from 'firebase/firestore';
// import { useContext } from 'react';
// import { UserContext } from '../context/UserContext';

const PDFContent = ({ data }) => {

    //fecha hoy
    const fechaHoy = new Date();
    // const { users } = useContext(UserContext);
    const [bitacora, setBitacora] = useState([])



    // Filtar por docuemto de Protocolo
    const consultarBitacoras = async () => {
        const doc = query(collection(db, 'bitacoras'), where('cab_id_bitacora', '==', data.id));
        const docu = await getDocs(doc);
        const documen = (docu.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setBitacora(documen);
    }
    // console.log('bitacora', bitacora)

    useEffect(() => {
        consultarBitacoras();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        // <Document>
        //     <Page size="A4" style={styles.page}>
        //         <View style={styles.section}>
        //             {bitacora.map((item, index) => (
        //                 <Text key={index} style={styles.text}>
        //                     {item}
        //                 </Text>
        //             ))}
        //         </View>
        //     </Page>
        // </Document>


        <div>
            {data.map((item, index) => {
                return (
                    <div key={item.id}>
                        <h1>{item.nombre_protocolo}</h1>
                    </div>
                )
            })}
        </div>
    )
};

export default PDFContent;

// const styles = StyleSheet.create({
//     page: {
//         flexDirection: 'row',
//         backgroundColor: '#E4E4E4',
//     },
//     section: {
//         margin: 10,
//         padding: 10,
//         flexGrow: 1,
//     },
//     text: {
//         fontSize: 12,
//         marginBottom: 10,
//     },
// });