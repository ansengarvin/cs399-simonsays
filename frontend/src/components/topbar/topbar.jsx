import React from 'react'
import {NavLink} from 'react-router-dom'

import "./topbar.css"

function Logo() {
    return (
        <NavLink to="/" className="logo">
            Ansen's<br/>
            Robot Games
        </NavLink>
    )
}

export function Topbar() {
    return (
        <nav className="topbar">
            <Logo/>
        </nav>
    )
}