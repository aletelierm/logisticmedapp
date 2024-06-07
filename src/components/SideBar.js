import React, { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { DataMenu } from './DataMenu';
import { DataMenuJadmin } from './DataMenuJ';
import { DataMenuSt } from './DataMenuSt';
import { DataMenuAdmin } from './DataMenuAdmin';
import { DataMenuSup } from './DataMenuSup';
import { DataMenuTec } from './DataMenuTec';
import { DataMenuTransp } from './DataMenuTransp';
import SubMenu from './SubMenu';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const SideBar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const { users } = useContext(UserContext);
    const [menu, setMenu] = useState([])

    useEffect(() => {
        if (users.rol === 'DADMIN') setMenu(DataMenu)
        if (users.rol === 'ADMIN-LM') setMenu(DataMenuJadmin)
        if (users.rol === 'TECNICO-LM') setMenu(DataMenuSt)
        if (users.rol === 'ADMIN-HC') setMenu(DataMenuAdmin)
        if (users.rol === 'SUPERVISOR-HC') setMenu(DataMenuSup)
        if (users.rol === 'TECNICO-HC') setMenu(DataMenuTec)
        if (users.rol === 'TRANSPORTE-HC') setMenu(DataMenuTransp)
    }, [users])

    return (
        <div className='container'>
            <div style={{ width: isOpen ? "250px" : "50px" }} className='sidebar'>
                <div className='top_section'>
                    <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className='bars' >
                        <FaBars onClick={toggle} style={{ color: "#328AC4" }} />
                    </div>
                </div>
                {menu.map((item, index) => {
                    return < div className='link' key={index}>
                        <div className='link_text'>
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