import React, { useState } from 'react';
import ListarProductos from '../components/ListarProductos'
import Navbar from '../components/Navbar'

const ListarProductosPage = () => {
    return (
        <>
        <Navbar />
        <hr />
        <hr />
        <hr />
        <hr />
        <div className='mt-8'> 
            <ListarProductos />  
        </div>

        </>
    );
};

export default ListarProductosPage;