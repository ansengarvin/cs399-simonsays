import { React, useEffect, useState, useRef, useParams } from 'react'
import { Form, useActionData, useNavigation, NavLink } from 'react-router-dom'

import { css } from '@emotion/react'
import { Board } from './spheropolyCanvasBoard'
import { EmptyBoard } from './emptyBoard'

export async function action({ request, params }) {
    const data = Object.fromEntries(await request.formData())
    console.log("== action was called, data:", data)
    console.log(data.position)
    if (data.phase == "start") {
        return fetch("http://localhost:19931/spheropoly/new",
            {
                method: "POST"
            })
    } else if (data.phase == "roll") {
        var roll = Math.floor(Math.random() * 6) + 1
        return fetch(
            "http://localhost:19931/spheropoly/roll",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roll: roll })
            }
        )
    } else if (data.phase == "tile") {
        if (data.owner == 0) {
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
        } else if (data.owner == 2) {
            return fetch(
                "http://localhost:19931/spheropoly/pay",
                {
                    method: "POST"
                }
            )
        } else if (data.position == 3) {
            console.log("Jailing")
            return fetch(
                "http://localhost:19931/spheropoly/jail",
                {
                    method: "POST"
                }
            )
        } else {
            return fetch(
                "http://localhost:19931/spheropoly/continue",
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
    const { phase, setPhase, state, response } = props
    if (response && response.lastAction && response.lastAction == "start") {
        setPhase("roll")
    }
    return (
        <div className="controls">
            <div className="caption">
                Your turn!
            </div>
            <div className="explanation">
                Press the button to start the game.
            </div>
            <Form method="POST">
                <input type="hidden" name="phase" value={phase} />
                <button className="submit">Start</button>
            </Form>
        </div>
    )
}

function Roll(props) {
    const { phase, setPhase, state, response } = props
    if (response && response.lastAction && response.lastAction == "roll") {
        setPhase("tile")
    }
    return (
        <div className="controls">
            <div className="caption">
                Your turn!
            </div>
            <div className="explanation">
                {response.lastAction == "tile" &&
                    <>If the robot is not where they should be, please lend a hand and move them!<br /></>}
                Press the button to roll the dice!
            </div>
            <Form method="POST">
                <input type="hidden" name="phase" value={phase} />
                <button className="submit"><i className="fa-solid fa-dice fa-2xl"></i></button>
            </Form>
        </div>
    )
}

function Tile(props) {
    const { phase, setPhase, state, response } = props
    const [buy, setBuy] = useState(false)
    if (response && response.lastAction && response.lastAction == "tile") {
        setPhase("roll")
    } else if (response && response.lastAction && response.lastAction == "jail") {
        setPhase("jail")
    }
    console.log("Owner of this tile is", response.board[String(response.human.position)].owner)
    if (state == "idle") {
        return (
            <div className="controls">
                <div className="caption">
                    Your turn!
                </div>
                <div className="explanation">
                    You rolled a {response.human.lastRoll}. Please move your piece, then choose the following.
                </div>
                {response.board[String(response.human.position)].owner == 0
                    && <>This tile is up for auction! You may choose to buy it.</>}
                <div className="buttons">
                    {response.board[String(response.human.position)].owner == 0
                        && (buy == true
                            ? <button className="command green selected"><i class="fa-solid fa-house-circle-check fa-2xl"></i></button>
                            : <button className="command green" onClick={() => { setBuy(true) }}><i class="fa-solid fa-house-circle-check fa-2xl"></i></button>)}
                    {response.board[String(response.human.position)].owner == 0
                        && (buy == false
                            ? <button className="command red selected"><i class="fa-solid fa-house-circle-xmark fa-2xl"></i></button>
                            : <button className="command red" onClick={() => { setBuy(false) }}><i class="fa-solid fa-house-circle-xmark fa-2xl"></i></button>)}
                </div>
                <Form method="POST">
                    <input type="hidden" name="buy" value={buy} />
                    <input type="hidden" name="phase" value={phase} />
                    <input type="hidden" name="owner" value={response.board[String(response.human.position)].owner} />
                    <input type="hidden" name="position" value={response.human.position} />
                    {response.board[String(response.human.position)].owner == 0
                        && <button className="submit"><i class="fa-solid fa-check fa-2xl"></i></button>}
                    {response.board[String(response.human.position)].owner == 1
                        && <>
                            You landed on your own tile! Press the button to move on.<br />
                            <button className="submit"><i class="fa-solid fa-check fa-2xl"></i></button>
                        </>}
                    {response.board[String(response.human.position)].owner == 2
                        && <>
                            Oh no! You landed on the robot's tile! Press the button to pay them!<br />
                            <button className="submit"><i class="fa-solid fa-check fa-2xl"></i></button>
                        </>}
                    {response.human.position == 0
                        && <>
                            You have landed on GO! Press the button to get paid!<br />
                            <button className="submit"><i class="fa-solid fa-money-bill fa-2xl"></i></button>
                        </>}
                    {response.human.position == 3
                        && <>
                            You were caught trespassing! Please move your piece to jail, then press the button!<br />
                            <button className="submit"><i class="fa-solid fa-handcuffs fa-2xl"></i></button>
                        </>}
                    {response.human.position == 6
                        && <>
                            You arrived at the lake! Enjoy the view, then press the button!<br />
                            <button className="submit"><i class="fa-solid fa-water fa-2xl"></i></button>
                        </>}
                    {response.human.position == 9
                        && <>
                            You're at jail, but thankfully not inside. Press the button to move on.<br />
                            <button className="submit"><i class="fa-solid fa-person-running fa-2xl"></i></button>
                        </>}
                </Form>
            </div>
        )
    } else {
        return (
            <div className="controls">
                <div className="caption">
                    Please wait for the robot to finish its turn.
                </div>
                <div className="explanation">
                    Press the button to buy or auction.
                </div>
            </div>
        )
    }
}

function Jail(props) {
    const { phase, setPhase, state, response } = props
    if (response && response.lastAction && response.lastAction == "bribe") {
        setPhase("roll")
    } else if (response && response.lastAction && response.lastAction == "jail") {
        setPhase("jail")
    }
    console.log("Owner of this tile is", response.board[String(response.human.position)].owner)
    if (state == "idle") {
        return (
            <div className="controls">
                <div className="caption">
                    Your turn!
                </div>
                <div className="explanation">
                    You are in jail.<br />
                </div>
                {response.board[String(response.human.position)].owner == 0
                    && <>This tile is up for auction! You may choose to buy it.</>}
                <Form method="POST">

                </Form>
            </div>
        )
    } else {
        return (
            <div className="controls">
                <div className="caption">
                    Please wait for the robot to finish its turn.
                </div>
                <div className="explanation">
                    Press the button to buy or auction.
                </div>
            </div>
        )
    }
}

export function Spheropoly() {
    const [phase, setPhase] = useState("start")
    const { state } = useNavigation()
    const response = useActionData()

    console.log("phase:", phase)

    switch (phase) {
        case "start":
            return (
                <div className="content">
                    <div className="columns">
                        <Start phase={phase} setPhase={setPhase} state={state} response={response} />
                        <div>
                            {(state == "idle" && response && response.board)
                                ? <Board data={response} state={state} />
                                : <EmptyBoard text="Game needs to start!" />
                            }
                        </div>
                    </div>
                </div>
            )
        case "roll":
            return (
                <div className="content">
                    <div className="columns">
                        <Roll phase={phase} setPhase={setPhase} state={state} response={response} />
                        <div>
                            {state == "idle" && response && response.board && <Board data={response} state={state} />}
                        </div>
                    </div>
                </div>
            )
        case "tile":
            return (
                <div className="content">
                    <div className="columns">
                        <Tile phase={phase} setPhase={setPhase} state={state} response={response} />
                        <div>
                            {state == "idle" && response && response.board && <Board data={response} state={state} />}
                        </div>
                    </div>
                </div>
            )
        case "jail":
            return (
                <div className="content">
                    <div className="columns">
                        <Jail phase={phase} setPhase={setPhase} state={state} response={response} />
                        <div>
                            {state == "idle" && response && response.board && <Board data={response} state={state} />}
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
                            {state == "idle" && response && response.board && <Board data={response} state={state} />}
                        </div>
                    </div>
                </div>
            )

    }
}