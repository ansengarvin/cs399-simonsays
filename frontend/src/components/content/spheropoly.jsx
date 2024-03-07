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
        var roll = Math.floor(Math.random() * 6)
        return fetch(
            "http://localhost:19931/spheropoly/roll",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({roll: roll})
            }
        )
    } else if (data.phase == "tile") {
        if (data.buy) {
            return fetch(
                "http://localhost:19931/spheropoly/buy",
                {
                    method: "POST"
                }
            )
        } else {
            return fetch(
                "http://localhost:19931/spheropoly/auction",
                {
                    method: "POST"
                }
            )
        }
    } else {
        console.log("No phase selected.")
        return null
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

function Roll(props) {
    const {phase, setPhase, state, response} = props
    if (response && response.lastAction && response.lastAction == "roll") {
        setPhase("tile")
    }
    return (
        <div className = "controls">
            <div className = "caption">
                Your turn!
            </div>
            <div className = "explanation">
                    Press the button to roll the dice!
            </div>
            <Form method="POST">
                <input type ="hidden" name="phase" value={phase}/>
                <button className="submit"><i className="fa-solid fa-dice fa-2xl"></i></button>
            </Form>
        </div>
    )
}

function Tile(props) {
    const {phase, setPhase, state, response} = props
    const [buy, setBuy] = useState(false)
    if (response && response.lastAction && response.lastAction == "tile") {
        setPhase("roll")
    }
    if (state == "idle"){
        return (
            <div className = "controls">
                <div className = "caption">
                    Your turn!
                </div>
                <div className = "explanation">
                        You rolled a {response.human.lastRoll}. Please move your piece, then choose the following.
                </div>
                <div className = "buttons">
                        { buy == true
                        ? <button className="command green selected">Buy</button>
                        : <button className="command green" onClick={() =>{setBuy(true)}}>Buy</button>
                        }
                        { buy == false
                        ? <button className="command red selected">Auction</button>
                        : <button className="command red" onClick={() =>{setBuy(false)}}>Auction</button>
                        }
                    </div>
                <Form method="POST">
                    <input type = "hidden" name="buy" value={buy}/>
                    <input type = "hidden" name="phase" value={phase}/>
                    <button className="submit"><i class="fa-solid fa-dice fa-2xl"></i></button>
                </Form>
            </div>
        )
    } else {
        return (
            <div className = "controls">
                <div className = "caption">
                    Please wait for the robot to finish its turn.
                </div>
                <div className = "explanation">
                    Press the button to buy or auction.
                </div>
            </div>
        )
    }

}

export function Spheropoly() {
    const [phase, setPhase] = useState("start")
    const {state} = useNavigation()
    const response = useActionData()

    console.log("phase:", phase)

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
        case "roll":
            return (
                <div className="content">
                    <div className="columns">
                        <Roll phase = {phase} setPhase = {setPhase} state={state} response={response}/>
                        <div>
                            <Board data={response} state={state}/>
                        </div>
                    </div>
                </div>
            )
        case "tile":
            return (
                <div className="content">
                    <div className="columns">
                        <Tile phase = {phase} setPhase = {setPhase} state={state} response={response}/>
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