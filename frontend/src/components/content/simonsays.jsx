import {React, useEffect, useState, useRef} from 'react'

import "./content.css"

/* Sources:
 *  https://react.dev/reference/react/useEffect
 *  https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html
 */

function Responding() {
    var response = 0

    useEffect(() => {

    })
    return (
        <div class="content">
            Communicating with the robot! Please wait!
        </div>
    )
}

function Game(props) {
    const {setResponding} = props
    return (
        <div class="content">
            Simon Says!<br/>
            <button class="start" onClick={()=> {
                setResponding(true)
            }}>Start</button>
        </div>
    )
}


export function SimonSays(props) {
    const [responding, setResponding] = useState(false)
    if (responding == 1) {
        return <Responding/>;
    } else{
        return <Game setResponding={setResponding}/>;
    }
}