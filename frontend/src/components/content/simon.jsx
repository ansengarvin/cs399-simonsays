import {React, useEffect, useState, useRef, useParams} from 'react'
import {Form, useActionData, useNavigation, NavLink} from 'react-router-dom'

import "./content.css"

/* Sources:
 *  https://react.dev/reference/react/useEffect
 *  https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html
 */


function doNothing(input){
    console.log("Doing nothing.")
    return
}


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

function SpheroConnect(props) {
    const {setStarted, type, title} = props
    const response = useActionData()
    if (response != undefined && response.reply == "game") {
        setStarted(true)
    }
    return (
        <div className="content">
            <div className = "title">
                <div className = "caption">
                    {title}
                </div>
                <div className = "explanation">
                    Press the below button to connect to the sphero.
                </div>
            </div>
            <Form method="POST">
                <input type="hidden" name="command" value={type}/>
                <button className="submit">Connect</button>
            </Form>
        </div>
    ) 
}

function RobotCard(props) {
    const {
        title,
        setGameState
    } = props
    const {state, formData} = useNavigation()
    const response = useActionData()
    const [command, setCommand] = useState(32)
    return (
        <div className="content">
            <div className = "title">
                <div className = "caption">
                    {title}
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
            ? <div className = "robocheck">Robot made a mistake! You win!</div> 
            : <></>
            }
        </div>
    )
}
 
export function SpheroSimonRobot(props) {
    const title = "Welcome to Sphero Simon: Robot Edition!"
    const [started, setStarted] = useState(false)
    if (started == false) {
        return (
            <SpheroConnect 
                title={title}
                setStarted={setStarted}
                type="1"   
            />    
        )
    } else {
        return (
            <RobotCard
                title={title}
                setGameState={doNothing}
            />
        )
    }
}

const commands = {
    1: "Drop",
    2: "Spin",
    3: "Light"
}

function HumanStatus(props) {
    const {state, command, response} = props
    if (state == "idle") {
        if (response == undefined) {
            return(
                <>
                    Press "Ready" to continue!
                </>
            )
        }  
        else if (response.reply == "success") {
            return (
                <>
                    You have won the game!
                </>
            )
        } else if (response.reply == "failure") {
            return (
                <>
                    Oh no! You lost the game!
                </>
            )
        } else if (response.reply == "game"){
            return (
                <>
                    Sphero connected!<br/>
                    Press "Ready" to start!
                </>
            )

        }else {   
            return (
                <>
                    Congratulations! You finished round {response.reply}<br/>
                    Press "Ready" to continue to round {parseInt(response.reply) + 1}!
                </>
            )
        }
    } else if (state == "submitting") {
        return(
            <>
                Your new command is {commands[command]}!<br/>
                Remember to do the previous commands in order!
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

function HumanCard(props) {
    const {
        title, setGameState,
        command, setCommand,
    } = props
    const {state, formData} = useNavigation()
    const response = useActionData()
    return (
        <div className="content">
            <div className = "title">
                <div className = "caption">
                    {title}
                </div>
                <div className = "explanation">
                    The Robot will tell you what to do below.
                    Do all of its previous commands in order, then do the new one.
                    If you make it to 9, you win!
                </div>
            </div>
            <div className = "robocheck_human">
                <HumanStatus command={command} state={state} response={response}/>
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

export function SpheroSimonHuman(props) {
    const title = "Welcome to Sphero Simon: Human Edition!"
    const [command, setCommand] = useState(32)
    const [started, setStarted] = useState(false)
    if (started == false) {
        return (
            <SpheroConnect 
            title={title}
            setStarted={setStarted}
            type="2"
            />
        )  
    } else {
        return (
            <HumanCard
                title={title}
                setGameState={doNothing}
                command={command}
                setCommand={setCommand}
            />
        )
    }
}


export function SpheroSimonVersus(props) {
    const [started, setStarted] = useState(false)
    const [gameState, setGameState] = useState(1)

    if (started == false) {
        return (
            <SpheroConnect 
                setStarted={setStarted}
                type="2"
                title="Welcome to Sphero Simon: Human Edition!"
            />
        )
    } else if (gameState == 1) {
        return (
            <>
                Robot Turn
            </>
        )
    } else if (gameState == 2) {
        return(
            <>
                Human Turn
            </> 
        )
    } else {
        return (
            <>
                Uh oh! We have a bug!
            </>
        )
    }
    
}

