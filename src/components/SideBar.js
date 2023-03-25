import React, { useState } from 'react';
import { FaTh,FaUserAlt,FaRegChartBar,FaCommentAlt, FaShoppingBag, FaBars } from 'react-icons/fa'
import { NavLink } from 'react-router-dom';

const SideBar = ({children}) => {

    const [isOpen, setIsOpen] = useState(false);
    const toggle = ()=> setIsOpen(!isOpen);

    const menuItem = [
        {
            path:"/equipos",
            name: "Mis Equipos",
            icon: <FaTh/>
        },
        {
            path:"/entradas",
            name: "Mis Entradas",
            icon: <FaUserAlt/>
        },
        {
            path:"/salidas",
            name: "Mis Salidas",
            icon: <FaRegChartBar/>
        },
        {
            path:"/clientes",
            name: "Mis Clientes",
            icon: <FaCommentAlt/>
        },
        {
            path:"/proveedores",
            name: "Mis Proveedores",
            icon: <FaShoppingBag/>
        },
        {
            path:"/usuarios",
            name: "Usuarios",
            icon: <FaUserAlt/>
        }
    ]
    return (
        <div className='container'>
           <div style={{width: isOpen ? "300px" : "50px"}} className='sidebar'>
                <div className='top_section'>
                   {/*  <h1 style={{display: isOpen ? "block" : "none"}} className='logo'>Logo</h1> */}
                    <div style={{marginLeft: isOpen ? "50px" : "0px"}}className='bars' >
                        <FaBars onClick={toggle}/>
                    </div>
                </div>
                {
                    menuItem.map((item, index)=>(
                        <NavLink to={item.path} key={index} className='link' activeclassName='active'>
                                <div className='icoon'>{item.icon}</div>
                                <div style={{display: isOpen ? "block" : "none"}} className='link_text'>{item.name}</div>
                        </NavLink>
                    ))
                }                
           </div>
           <main>{children}</main>
        </div>
    );
};

export default SideBar;