import {React, useEffect, useState, useRef, useParams} from 'react'
import {Form, useActionData, useNavigation, NavLink} from 'react-router-dom'



export function GameContainer() {
    
}

export function Spheropoly() {
    const [roll, setRoll] = useState(false)
    const [buy, setBuy] = useState(false)
    const [done, setDone] = useState(false)

    if (buy) {
        return (
            <div className="content">

                { done
                    ? <div className = "title">
                        <div className = "caption">
                            Robot Turn!
                        </div>
                        <div className="robocheck">
                            Watch him go!
                        </div>
                    </div>
                : <div className = "title">
                    <div className = "caption">
                        Your Turn!
                    </div>
                    <div className = "explanation">
                        You have landed on Wallace Road! Do you want to buy this property?
                    </div>
                    <div className = "buttons">
                        <button className="command green" onClick={() => setDone(true)}>Yes</button>
                        <button className="command red">No</button>
                    </div>
                </div>
                }
                
            </div>
        )
    }
    else {
        return (
            <div className="content">
                <div className = "title">
                    <div className = "caption">
                        Your turn!
                    </div>
                    {
                        roll
                        ? <></>
                        :<div className = "explanation">
                            Press the button to roll.
                        </div>
                    }    
                    {
                        roll
                        ? <>
                        <div className="robocheck">You rolled a 3! Please move your piece. Press this button when you're done.</div>
                            <button className="submit"onClick={() => {
                                setBuy(true)  
                            }}>Done moving it</button>
                        </>
                        : <button className="submit"onClick={() => {
                            setRoll(true)
                        }}>Roll</button>
                    }
                </div>
                
            </div>
        )
    }
    
}