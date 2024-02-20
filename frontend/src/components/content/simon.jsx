import {React, useEffect, useState, useRef, useParams} from 'react'
import {Form, useActionData, useNavigation, NavLink} from 'react-router-dom'

import "./content.css"

/* Sources:
 *  https://react.dev/reference/react/useEffect
 *  https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html
 */
export async function action({ request, params }) {
    const data = Object.fromEntries(await request.formData())
    console.log("== action was called, data:", data)
    return fetch(
        "http://localhost:19931/command",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }
    )
}

export function SpheroSimonLanding(props) {
    const {setMode} = props
    return (
        <div className="content">

            <div className = "title">
                <div className = "caption">
                    Choose a game!
                </div>
            </div>
            <div className = "buttons">
                <NavLink className="circle orange" to="robot">Robot-Only</NavLink>
                <NavLink className="circle blue" to="human">Human-Only</NavLink>
                <NavLink className="circle red" to="versus">Human vs Robot</NavLink>
            </div>

        </div>
    )
    
}
 
export function SpheroSimonRobot(props) {
    const [command, setCommand] = useState(32)
    const {state, formData} = useNavigation()
    const response = useActionData()
    return (
        <div className="content">
            <div className = "title">
                <div className = "caption">
                    Welcome to Sphero Simon!
                </div>
                <div className = "explanation">
                    Choose a color and make the robot GO!
                </div>
            </div>
            <div className = "buttons">
                {command == 1
                ? <button className="command red selected"/>
                : <button className="command red" onClick={() =>{setCommand(1)}}/>
                }
                {command == 2
                ? <button className="command green selected"/>
                : <button className="command green" onClick={() =>{setCommand(2)}}/>
                }
                {command == 3
                ? <button className="command blue selected"/>
                : <button className="command blue" onClick={() =>{setCommand(3)}}/>
                }
                {command == 4
                ? <button className="command orange selected"/>
                : <button className="command orange" onClick={() =>{setCommand(4)}}/>
                }
                {command == 5
                ? <button className="command purple selected"/>
                : <button className="command purple" onClick={() =>{setCommand(5)}}/>
                }
            </div>
            <Form method="POST">
                <input type="hidden" name="command" value={command}/>
                <button className="submit">GO</button>
            </Form>
            <div className = "spacer"/>
            {state == "submitting"
            ? <div className = "robocheck">Watch the Robot Go!</div>
            : <></>
            }
            {state == "idle" && response != undefined && response.reply == "Mistake"
            ? <div className = "robocheck">Robot made a mistake! Uh-oh!</div> 
            : <></>
            }
            
        </div>
    )
}

const commands = {
    1: "Drop",
    2: "Spin",
    3: "Light"
}

function HumanStatus(props) {
    const {state, started, command, count} = props
    if (started == false) {
        return(
            <>
                Press "Ready" to start playing!
            </>
        )
    } else if (state == "idle") {
        return(
            <>
                Press "Ready" to continue!<br/>
            </>
        )
    } else if (state == "submitting") {
        return(
            <>
                Your new command is {commands[command]}!
            </>
        )
    } else {
        return(
            <>
                There appears to be an unforseen edge case.
            </>
        )
    }
}

export function SpheroSimonHuman(props) {
    const [command, setCommand] = useState(32)
    const [started, setStarted] = useState(false)
    const {state, formData} = useNavigation()
    const response = useActionData()
    return (
        <div className="content">
            <div className = "title">
                <div className = "caption">
                    Welcome to Sphero Simon: Human Edition!
                </div>
                <div className = "explanation">
                    The Robot will tell you what to do below.
                    Do all of its previous commands in order, then do the new one.
                    If you make it to 9, you win!
                </div>
            </div>
            <div className = "robocheck_human">
                <HumanStatus started={started} command={command} state={state}/>
            </div>
            <Form method="POST">
                <input type="hidden" name="command" value={command}/>
                <button className="submit" onClick={()=>{
                    setCommand( Math.floor(Math.random()*3)+1 )
                    setStarted(true)
                }}>Ready!</button>
            </Form>
        </div>
    )
}

export function SpheroSimonVersus(props) {
    return (
        <>
        Versus
        </>
    )
}

