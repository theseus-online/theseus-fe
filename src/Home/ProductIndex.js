/**
 * Created by lawrence on 17-6-20.
 */
import React, { Component } from 'react';
import logo from '../Images/logo.png';

export default class ProductIndex extends Component {
    render () {
        return (
            <div className="block prod-index">
                <div className="content-wrapper">
                    <div className="content-logo">
                        <img src={ logo } alt="" />
                    </div>
                    <div className="content"><span className="content-title">THESEUS</span> - A Docker based SaaS Solution.</div>
                </div>
                <div className="start-button-wrapper">
                    <div className="start-button"><i className="ion ion-paper-airplane start-button-icon" />GET STARTED</div>
                </div>
            </div>
        )
    }
}