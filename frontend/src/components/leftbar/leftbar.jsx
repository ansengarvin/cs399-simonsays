import React from 'react'
import {NavLink} from 'react-router-dom'

import './leftbar.css'

const navlinks = {
    "Simon Says": "./simonsays"
}

export function Leftbar() {
    return (
        <nav class="leftbar">
            {Object.keys(navlinks).map(key=>(
                <NavLink to={navlinks[key]} className="item">
                    {key}
                </NavLink>
            ))}
        </nav>
    )
}