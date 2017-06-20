/**
 * Created by Lawrence on 20/06/2017.
 */
import React, { Component } from 'react';
import logo from '../Images/logo-large.png';
import './Header.css';

export default class Header extends Component {
    render () {
        return (
            <div className="header">
                <ul className="header-nav">
                    <li className="logo"><img alt="" src={ logo } /></li>
                    <li className="nav-item nav-item-selected"><i className="icon ion-ios-home-outline" /> Home</li>
                    <li className="nav-item"><i className="icon ion-ios-bookmarks-outline" /> Tutorial</li>
                    <li className="nav-item"><i className="icon ion-social-rss-outline" /> Blog</li>
                    <li className="nav-item"><i className="icon ion-ios-information-outline" /> About</li>
                    <li className="nav-item"><i className="icon ion-social-github" /> Github</li>
                </ul>
            </div>
        )
    }
}