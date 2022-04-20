import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css'



export default function NavBar() {

  useEffect(() => {
    setNavBar()
  }, [])

  const setNavBar = () => {

    let list = document.querySelectorAll(".list");
    for (let i = 0; i < list.length; i++) {
      list[i].onclick = (e) => {
        let j = 0;
        while (j < list.length) {
          list[j++].className = "list";
        }
        list[i].className = "list active whiteText";
      };
    }

    list.forEach((elements) => {
      elements.addEventListener("click", function (event) {
        let bg = document.querySelector("body");
        let color = event.target.getAttribute("data-color");
        bg.style.backgroundColor = color;
      });
    });
  }

  return (
    <>
      <nav>
        <link
          rel="stylesheet"
          href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
          integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p"
          crossOrigin="anonymous"
        />
        <div className="navigation">
          <ul>
            <li className="list active" data-color="#3c40c6">
              <NavLink to="/">
                <span className="icon"><i className="far fa-list-ul"></i></span>
                <span className="title">Handleliste</span>
              </NavLink>
            </li>
            <li className="list" data-color="#dc143c">
              <NavLink to="/fridge">
                <span className="icon"><i className="far fa-archive"></i></span>
                <span className="title">Inventar</span>
              </NavLink>
            </li>
            <li className="list" data-color="#05c46b">
              <NavLink to="/groups">
                <span className="icon"><i className="far fa-users"></i></span>
                <span className="title">Grupper</span>
              </NavLink>
            </li>
            <li className="list" data-color="#ffa801">
              <NavLink to="/profile">
                <span className="icon"><i className="far fa-user"></i></span>
                <span className="title">Profil</span>
              </NavLink>
            </li>
            <div className="indicator"></div>

            {/*
            
            // uncomment this to try the moving button in the NavBar 
            <div className="button"></div> 

            */}
          </ul>
        </div>
      </nav>
    </>
  )

}
