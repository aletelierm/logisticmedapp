import React, { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa'
import { DataMenu } from './DataMenu'
import { DataMenuAdmin } from './DataMenuAdmin';
import { DataMenuSup } from './DataMenuSup';

import SubMenu from './SubMenu';
import '../styles/sideBar.css'
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const SideBar = ({ children }) => {

    const [isOpen, setIsOpen] = useState(true);    
    const toggle = () => setIsOpen(!isOpen);
    const {users} = useContext(UserContext);
    const [menu, setMenu]= useState([])
    console.log('obtengo datos del usuario global:',users)
   
    useEffect(()=>{
                if(users.rol==='DADMIN') setMenu(DataMenu)
                if(users.rol==='ADMIN') setMenu(DataMenuAdmin)
                if(users.rol==='SUPERVISOR') setMenu(DataMenuSup)
                
    },[users])
    
     

    return (
        <div className='container'>
            <div style={{ width: isOpen ? "250px" : "50px" }} className='sidebar'>
                <div className='top_section'>
                    {/*  <h1 style={{display: isOpen ? "block" : "none"}} className='logo'>Logo</h1> */}
                    <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className='bars' >
                        <FaBars onClick={toggle} />
                    </div>
                </div>
               
                {menu.map((item, index) => {
                    return                     < div className='link' key={index}>
                        <div className='link_text'>
                            {/* {usuario.ROL ==='DADMIN' && <SubMenu item={item} key={index} isopen={isOpen} />} */}
                            <SubMenu item={item} key={index} isopen={isOpen} />
                            
                        </div>
                    </div>
                })}
            </div>
            <main className='main'>{children}</main>
        </div>
    );
};

export default SideBar;