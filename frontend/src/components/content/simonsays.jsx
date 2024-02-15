import {React, UseEffect, useState} from 'react'

import "./content.css"


function Responding() {
    return (
        <div class="content">
            Communicating with the robot! Please wait!
        </div>
    )
}

function Intro() {
    return (
        <div class="content">
            Simon Says!<br/>
            <button class="start" onClick={()=> {

            }}>Start</button>
        </div>
    )
}

/* https://react.dev/reference/react/useEffect */
export function SimonSays(props) {

    
    if (responding) {
        return <Responding/>;
    } else{
        return <Intro/>;
    }
}