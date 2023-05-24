const validarRut = (rut) =>{

    let tmp = rut.split('-');
   /*  let digv= tmp[1];    */ 
    let ruts = tmp[0];    

    let M=0;
    let S=1;
    let T=ruts;
    for(;T;T= Math.floor(T/10))
    S=(S+T%10*(9-M++%6))%11;   
    return S-1
    
}

export default validarRut;