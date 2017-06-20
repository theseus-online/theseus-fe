import React, { Component } from 'react';
import './Home.css';

import ProductIndex from './ProductIndex';

export default class Home extends Component {
    render () {
        return (
            <div className="home">
                <ProductIndex/>
            </div>
        )
    }
}