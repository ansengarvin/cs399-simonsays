import React from 'react'
import {NavLink} from 'react-router-dom'

import './leftbar.css'

const navlinks = {
    "Simon Says": "/simonsays",
    "Other Game 1": "/",
    "Other Game 2": "/"
}

export function Leftbar() {
    return (
        <nav className="leftbar">
            {Object.keys(navlinks).map(key=>(
                <NavLink to={navlinks[key]} className="item">
                    {key}
                </NavLink>
            ))}
        </nav>
    )
}