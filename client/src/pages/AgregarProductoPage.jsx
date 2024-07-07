import React, { useState } from 'react';
import AgregarProducto from '../components/AgregarProducto'
import Navbar from '../components/Navbar'

const AgregarProductoPage = () => {
    return (
        <>
        <Navbar />
        <hr />
        <hr />
        <hr />
        <hr />
        <div className='mt-8'> 
            <AgregarProducto />  
        </div>

        </>
    );
};

export default AgregarProductoPage;
