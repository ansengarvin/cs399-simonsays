import {React, useEffect, useState, useRef, useParams} from 'react'
import {Form, useActionData, useNavigation, NavLink} from 'react-router-dom'

import { css } from '@emotion/react'
import { Board } from './spheropolyBoard'

export async function action({ request, params }) {
    const data = Object.fromEntries(await request.formData())
    console.log("== action was called, data:", data)
    if (data.phase == "start") {
        return fetch("http://localhost:19931/spheropoly/new",
        {
            method: "POST"
        })
    } else if (data.phase == "roll") {
        return fetch(
            "http://localhost:19931/spheropoly/roll",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            }
        )
    }
}

function Start(props) {
    const {phase, setPhase, state, response} = props
    if (response && response.lastAction && response.lastAction == "start") {
        setPhase("roll")
    }
    return (
        <div className = "controls">
            <div className = "caption">
                Your turn!
            </div>
            <div className = "explanation">
                    Press the button to start the game.
            </div>
            <Form method="POST">
                <input type ="hidden" name="phase" value={phase}/>
                <button className="submit">Start</button>
            </Form>
        </div>
    ) 
}

export function Spheropoly() {
    const [phase, setPhase] = useState("start")
    const {state} = useNavigation()
    const response = useActionData()

    console.log(phase)

    switch(phase) {
        case "start":
            return (
                <div className="content">
                    <div className="columns">
                        <Start phase = {phase} setPhase = {setPhase} state={state} response={response}/>
                        <div>
                            <Board data={response} state={state}/>
                        </div>
                    </div>
                </div>
            ) 
        default:
            return (
                <div className="content">
                    <div className="columns">
                        <div>
                            Under Development
                        </div>
                        <div>
                            <Board data={response} state={state}/>
                        </div>
                    </div>
                </div>
            )
            
    }
}