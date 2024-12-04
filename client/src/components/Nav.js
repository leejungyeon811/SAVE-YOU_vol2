import React from "react";
import "./Nav.css"
import { Link } from 'react-router-dom';


function Nav() {
    return (
        <nav id="nav2">
            <div className="logo_nav">SAVE,YOU</div>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/pic">Picture</Link></li>
                <li><Link to="/txt">Text</Link></li>
                <li><Link to="/about">more..</Link></li>
            </ul>
        </nav>
    );
}

export default Nav;
