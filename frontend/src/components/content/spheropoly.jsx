import {React, useEffect, useState, useRef, useParams} from 'react'
import {Form, useActionData, useNavigation, NavLink} from 'react-router-dom'

import {useQuery} from '@tanstack/react-query'

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
            <div className = "title">
                <div className = "caption">
                    Your turn!
                </div>
                <div className = "explanation">
                        Press the button to roll.
                </div>
                <button className="submit"onClick={() => {
                    setRoll(true)
                }}>Roll</button>
                {data.board["1"].owner}
            </div>
        </div>
    ) 
}