// ログインしていないユーザー向けのナビゲーションメニュー

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import logoBlue from '../../assets/utils/logo.svg';
import logoWhite from '../../assets/utils/logo_white.svg';



export default class VisitorNav extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let navBar = document.getElementById("navbar");
    let navLogo = document.getElementById("nav-logo");
    if (this.isTopPage()) {
      navBar.classList.add("top-page-nav");
      this.adjustNav(600, logoWhite, logoBlue);
    } else {
      let navLogo = document.getElementById("nav-logo");
      navLogo.src = logoWhite;
      this.adjustNav(300, logoWhite, logoWhite);
    }

  }
  componentWillUpdate() {
    let navBar = document.getElementById("navbar");
    let navLogo = document.getElementById("nav-logo");
    if (this.isTopPage()) {
      navLogo.src = logoWhite;
      navBar.classList.add("top-page-nav");
      this.adjustNav(600, logoWhite, logoBlue);
    } else {
      navLogo.src = logoBlue;
      navBar.classList.remove("top-page-nav");
      this.adjustNav(300, logoBlue, logoBlue);
    }
  }
  isTopPage() {
    if (location.pathname == "/") {
      return true
    } else {
      return false
    }
  }
  adjustNav(fixAfter, defaultLogo, fixedLogo) {
    let navBar = document.getElementById("navbar");
    let navLogo = document.getElementById("nav-logo");
    window.onscroll = () => {
      if (window.pageYOffset > fixAfter) {
        navBar.classList.add("navbar-fixed");
        navLogo.src = fixedLogo;
      } else {
        navBar.classList.remove("navbar-fixed");
        navLogo.src = defaultLogo;
      }
    }
  }

  render() {
    return(
      <div id="navbar" className="navbar">
        <div className="container">
          <div className="logo-nav">
            <Link to="/">
              <div className="logo">
                <img id="nav-logo" src={logoWhite}/>
              </div>
            </Link>
          </div>
          <div className="menu-top">
            <ul>
              <li><Link to="/">Top</Link></li>
              <li><Link to="/garage">Garage</Link></li>
              <li><Link to="/match">Match</Link></li>
              <li><Link to="/docs">Docs</Link></li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
