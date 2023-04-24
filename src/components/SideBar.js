import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa'
import { DataMenu } from './DataMenu'
import SubMenu from './SubMenu';
import '../styles/sideBar.css'

const SideBar = ({ children }) => {

    const [isOpen, setIsOpen] = useState(true);
    const toggle = () => setIsOpen(!isOpen);


    return (
        <div className='container'>
            <div style={{ width: isOpen ? "300px" : "50px" }} className='sidebar'>
                <div className='top_section'>
                    {/*  <h1 style={{display: isOpen ? "block" : "none"}} className='logo'>Logo</h1> */}
                    <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className='bars' >
                        <FaBars onClick={toggle} />
                    </div>
                </div>
               
                {DataMenu.map((item, index) => {
                    return < div className='link' key={index}>
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