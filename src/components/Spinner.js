// Spinner.js
import React from 'react';
import { css } from '@emotion/react';
import { RingLoader } from 'react-spinners';
import styled from 'styled-components';

const override = css`
  display: block;
  margin: 0 auto;
  position: fixed;
  top: 50%;
  left: 50% ;
  transform: translate(-50%, -50%);
  z-index: 500;
`;

const Overlay = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top:0;
    left:0;
   /*  background: rgba(0,0,0,.5); */
    padding: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
`
const Spinner = ({ cargando }) => {
  return (
    <Overlay>
    <RingLoader
      css={override}
      size={150}
      color={'#36D7B7'}
      loading={cargando}
    />
    </Overlay>
  );
};

export default Spinner;
