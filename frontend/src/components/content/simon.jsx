import {React, useEffect, useState, useRef, useParams} from 'react'
import {Form, useActionData, useNavigation, NavLink} from 'react-router-dom'

import "./content.css"

/* Sources:
 *  https://react.dev/reference/react/useEffect
 *  https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html
 */


function doNothing(input){
    console.log("Doing nothing, but here's the input: " + input)
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
    const {state, formData} = useNavigation()
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
                {state == "idle"
                    ? <button className="submit">Connect</button>
                    : <div className="robocheck">Connecting</div>
                }
                
            </Form>
        </div>
    ) 
}

function RobotCard(props) {
    const {
        title,
        setGameState,
        caption
    } = props
    const {state, formData} = useNavigation()
    const response = useActionData()
    const [command, setCommand] = useState(32)
    if (response != undefined && response.reply == "OK"){
        setGameState("human")
    } else if (response != undefined && response.reply == "Mistake") {
        setGameState("success")
    } else if (response != undefined && response.reply == "Tie") {
        setGameState("tie")
    }
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
            ? <div className = "robocheck">Robot made a mistake! They lose!</div> 
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
    const {state, command, response, round, setGameState, gameState} = props
    if (response != undefined) {
        console.log(response.reply)
    }
    if (state == "idle") {
        if (response == undefined) {
            return(
                <>
                    Press "Ready" to continue!
                </>
            )
        }  
        else if (response.reply == "success") {
            setGameState("success")
            return (
                <>
                    You have won the game!
                </>
            )
        } else if (response.reply == "failure") {
            setGameState("failure")
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
        } else if (response.reply == "OK") {
            /* This is the response that is received when the robot successfuly completes its turn.
            We don't want immediately re-set the game state back to robot after this, because it
            creates an infinite loop. */
            console.log("Human Game State")
            return (
                <>
                Congratulations! You finished round {round}<br/>
                Press "Ready" to continue to round {round + 1}!
                </>
            ) 
        } else {
            setGameState("robot")
            return (
                <>
                    Congratulations! You finished round {round}<br/>
                    Press "Ready" to continue to round {round + 1}!
                </>
            )
        }
    } else if (state == "submitting") {
        return(
            <>
                Your new command is {commands[command]}!<br/>
                Wait until the numbers shows up, and do the previous commands in order.<br/>
                Then, {commands[command]} the sphero!
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
        title, 
        gameState, setGameState,
        round, setRound,
        explanationType
    } = props
    const [command, setCommand] = useState(32)
    const {state, formData} = useNavigation()
    const response = useActionData()
    console.log("In Human: Gamestate:", gameState)
    return (
        <div className="content">
            <div className = "title">
                <div className = "caption">
                    {title}
                </div>
                <div className = "explanation">
                    The Robot will tell you what to do below.<br/>
                    Do all of its previous commands in order, then do the new one.
                    {
                    explanationType == 1
                        ? <>If you make it to 3, you win!</>
                        : <>If you go for longer than the robot, you win!
                            But if it goes to 3, it's a tie!</>
                    }
                    
                </div>
            </div>
            <div className = "robocheck_human">
                <HumanStatus
                    command={command}
                    state={state}
                    response={response}
                    setGameState={setGameState}
                    round={round}
                    gameState={gameState}
                />
            </div>
            <Form method="POST">
                <input type="hidden" name="command" value={command}/>
                <button className="submit" onClick={()=>{
                    setCommand( Math.floor(Math.random()*3)+1 )
                    setRound(prevRound => {
                        return prevRound + 1
                    })
                }}>Ready!</button>
            </Form>
        </div>
    ) 
}


export function SpheroSimonHuman(props) {
    const title = "Welcome to Sphero Simon: Human Edition!"
    const [started, setStarted] = useState(false)
    const [round, setRound] = useState(0)
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
                round={round}
                setRound={setRound}
                explanationType={1}
            />
        )
    }
}

export function SpheroSimonVersus(props) {
    const [started, setStarted] = useState(false)
    const [gameState, setGameState] = useState("human")
    const [round, setRound] = useState(0)
    
    if (started == false) {
        return (
            <SpheroConnect 
                title="Welcome to Sphero Simon: Versus Edition!"
                setStarted={setStarted}
                type="3"   
            />
        )
    } else if (gameState == "robot") {
        return (
            <RobotCard
                title="Sphero Simon Versus: Robot Turn"
                setGameState={setGameState}
            />
        )
    } else if (gameState == "human") {
        return(
            <HumanCard
                title="Sphero Simon Versus: Human Turn"
                setGameState={setGameState}
                round={round}
                setRound={setRound}
                gameState={gameState}
                explanationType={2}
            />
        )
    } else if (gameState == "success") {
        return(
            <div className="content green">
                <div className = "victory_title">
                    You Win!
                </div>
            </div>
        )
    } else if (gameState == "failure") {
        return(
            <div className="content red">
                <div className = "victory_title">
                    You Lose!
                </div>
            </div>
        )
    } else if (gameState == "tie") {
        return (
            <div className="content orange">
                <div className = "victory_title">
                    It's a tie!
                </div>
            </div>
        )   
    } else {
        return (
            <>
                Uh oh! We have a bug!
            </>
        )
    }
    
}

