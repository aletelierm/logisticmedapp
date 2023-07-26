import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import './../App.css'

const SidebarLink = styled(Link)`
  display: flex;
  color: #000;
  justify-content: center;
  align-items: center;
  padding: 10px;
  height: 30px;  
  list-style: none;  
  text-decoration: none;
  font-size: 20px;
  

  &:hover {    
      background-color: #16B9CF;
      border-left: 4px solid #16B9CF;
      cursor: pointer;
  }
`
const SidebarLabel = styled.span`
  margin-left: 10px;   
`
const DropdownLink = styled(Link)`
 /*  background: #414757; */
  background-color: #C7DCC7;
  height: 30px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none; 
  color: #000;
  padding-top: 5px;
  font-size: 15px;

  &:hover {
     background-color: lightblue;
;
    cursor: pointer;
  }
`;

const SubMenu = ({ item,isopen }) => {  
  const [subnav, setSubnav] = useState(false);
  const showSubnav = () => setSubnav(!subnav);
  //#74C2F1
  return (
    <>
      <SidebarLink to={item.path} onClick={item.subNav && showSubnav}>  
        <div style={{color: "green"}}>
          {item.icon}
        </div>
        <div style={{display: isopen ? "block" : "none"}}>
           <SidebarLabel>{item.title}</SidebarLabel>            
        </div>        
        <div style={{display: isopen ? "block" : "none"}}>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : null}
        </div>
      </SidebarLink>
      {subnav &&
        item.subNav.map((item, index) => {
          return (
            <DropdownLink to={item.path} key={index} style={{display: isopen ? "block" : "none",color:"green"}}>
              {item.icon}
              <SidebarLabel style={{color:"black", fontWeight:"600"}}>{item.title}</SidebarLabel>
            </DropdownLink>
          );
        })}
    </>
  );
};

export default SubMenu;