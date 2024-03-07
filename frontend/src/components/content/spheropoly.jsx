import {React, useEffect, useState, useRef, useParams} from 'react'
import {Form, useActionData, useNavigation, NavLink} from 'react-router-dom'

import {useQuery} from '@tanstack/react-query'
import { css } from '@emotion/react'
import { Board } from './spheropolyBoard'

export function GameContainer() {
    
}


export function Spheropoly() {
    const query="roll"
    const {isLoading, error, data} = useQuery({
        enabled: (!query ? false : true),
        queryKey: ["spheropoly", query],
        queryFn: async() => {
            const res = await fetch('http://localhost:19931/spheropoly/status')
            return res.json()
        }
    })
    return (
        <div className="content">
            <div className="columns">
                <div className = "controls">
                    <div className = "caption">
                        Your turn!
                    </div>
                    <div className = "explanation">
                            Press the button to roll.
                    </div>
                    <button className="submit"onClick={() => {
                        setRoll(true)
                    }}>Roll</button>
                </div>
                <div>
                    <Board data={data}/>
                </div>
                
            </div>
        </div>
    ) 
}