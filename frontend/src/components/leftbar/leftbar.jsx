﻿import React from 'react'
import {NavLink} from 'react-router-dom'

import './leftbar.css'

const navlinks = {
    "Sphero Simon": "/spherosimon",
    "Other Game 1": "/abc",
    "Other Game 2": "/def"
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