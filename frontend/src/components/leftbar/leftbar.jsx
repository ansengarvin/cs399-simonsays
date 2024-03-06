import React from 'react'
import {NavLink} from 'react-router-dom'

import './leftbar.css'

const navlinks = {
    "Sphero Simon": "/spherosimon",
    "Spheropoly": "/spheropoly"
}

export function Leftbar() {
    return (
        <nav className="leftbar">
            {Object.keys(navlinks).map(key=>(
                <NavLink key={key} to={navlinks[key]} className="item">
                    {key}
                </NavLink>
            ))}
        </nav>
    )
}