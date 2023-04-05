import React, { useState } from 'react';
import {  FaBars } from 'react-icons/fa'

import { DataMenu } from './DataMenu'
import SubMenu from './SubMenu';


const SideBar = ({children}) => {

    const [isOpen, setIsOpen] = useState(false);
    const toggle = ()=> setIsOpen(!isOpen);


    return (
        <div className='container'>
           <div style={{width: isOpen ? "300px" : "50px"}} className='sidebar'>
                <div className='top_section'>
                   {/*  <h1 style={{display: isOpen ? "block" : "none"}} className='logo'>Logo</h1> */}
                    <div style={{marginLeft: isOpen ? "50px" : "0px"}} className='bars' >
                        <FaBars onClick={toggle}/>
                    </div>
                </div>
              {/*   {
                    menuItem.map((item, index)=>(
                        <NavLink to={item.path} key={index} className='link'>
                                <div className='icoon'>{item.icon}</div>
                                <div style={{display: isOpen ? "block" : "none"}} className='link_text'>{item.name}</div>
                        </NavLink>
                    ))
                    
                }  */}
                {DataMenu.map((item, index) => {
                return  < div className='link'>  
                         {/*    <div className='icoon'>{item.icon}</div> */}
                            {/* <div style={{display: isOpen ? "block" : "none"}} className='link_text'><SubMenu item={item} key={index} /></div> */}
                            <div className='link_text'>
                            <SubMenu item={item} key={index} isopen={isOpen} />
                            </div>
                        </div>;
            })}               
           </div>
           <main className='main'>{children}</main>
        </div>
    );
};

export default SideBar;