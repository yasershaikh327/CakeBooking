import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CSS/admindashboard.css';
import { Link } from 'react-router-dom';

function Admindashboard() {
    const [counts, setCounts] = useState({
        customersCount: 0,
        cakesCount: 0,
        pastriesCount: 0,
        ordersCount: []
    });
    
    useEffect(() => {
        axios.get('http://localhost:3001/counts')
        .then(response => {
            setCounts(response.data);
        })
        .catch(error => {
            console.error('Error fetching counts:', error);
        });
    }, []);

    return (
        <>
            <center>
                <h1 className="title">Admin Dashboard</h1>
                <div className="box">
                    <div className="box-item">
                        <span className="text">
                        {counts.customersCount > 1 ? 'Customers' : 'Customer'}
                        </span>
                        <span><Link className="number" to="/customertable">{counts.customersCount}</Link></span>
                    </div>
                    <div className="box-item">
                        <span className="text"> {counts.ordersCount.length > 1 ? 'Orders' : 'Order'}</span>
                        <span><Link className="number" to="/ordertable">{counts.ordersCount.length}</Link></span>
                    </div>
                    <div className="box-item">
                        <span className="text"> {counts.cakesCount > 1 ? 'Cakes' : 'Cake'}</span>
                        <span><Link className="number" to={`/cakestable?category=cake`}>{counts.cakesCount}</Link></span>
                    </div>
                    <div className="box-item">
                        <span className="text">  {counts.pastriesCount > 1 ? 'Pastries' : 'Pastry'}</span>
                        <span><Link className="number" to={`/pastrytable?category=pastry`}>{counts.pastriesCount}</Link></span>
                    </div>
                </div>
            </center>
        </>
    );
}

export default Admindashboard;
