/**
 * Created by Lawrence on 20/06/2017.
 */
import React, { Component } from 'react';
import logo from '../Images/logo-large.png';
import './Header.css';
export default class Header extends Component {
    handleClick (target) {
        if (target === 'blog') {
            window.open('http://blog.theseus.online/', 'Theseus Blog')
        } else if (target === 'github') {
            window.open('https://github.com/theseus-online', 'theseus-online - Github');
        }
    }
    render () {
        return (
            <div className="header">
                <ul className="header-nav">
                    <li className="logo"><img alt="" src={ logo } /></li>
                    <li className="nav-item nav-item-selected"><i className="icon ion-ios-home-outline" /> Home</li>
                    <li className="nav-item"><i className="icon ion-ios-bookmarks-outline" /> Tutorial</li>
                    <li className="nav-item" onClick={ this.handleClick.bind(this, 'blog') }><i className="icon ion-social-rss-outline" /> Blog</li>
                    <li className="nav-item"><i className="icon ion-ios-information-outline" /> About</li>
                    <li className="nav-item" onClick={ this.handleClick.bind(this, 'github') }><i className="icon ion-social-github" /> Github</li>
                </ul>
            </div>
        )
    }
}