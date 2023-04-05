import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';


const SidebarLink = styled(Link)`
  display: flex;
  color: #000;
  justify-content: center;
  align-items: center;
  padding: 10px;
  height: 0px;  
  list-style: none;  
  text-decoration: none;
  font-size: 20px;
  

  &:hover {
    background-color: lightblue;
     border-left: 4px solid lightblue;
     cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 10px;
 
  
`;

const DropdownLink = styled(Link)`
 /*  background: #414757; */
  background-color: #C7DCC7;
  height: 20px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  /* color: #f5f5f5; */
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

  return (
    <>
      <SidebarLink to={item.path} onClick={item.subNav && showSubnav}>
  
        <div style={{color: "#74C2F1"}}>
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
            <DropdownLink to={item.path} key={index} style={{display: isopen ? "block" : "none"}}>
              {item.icon}
              <SidebarLabel>{item.title}</SidebarLabel>
            </DropdownLink>
          );
        })}
    </>
  );
};

export default SubMenu;