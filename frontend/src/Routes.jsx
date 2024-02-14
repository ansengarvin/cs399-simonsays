import { useState } from 'react'
import {Outlet} from 'react-router-dom'

import {Topbar} from './components/topbar/topbar'
import {Leftbar} from './components/leftbar/leftbar'
import {Rightbar} from './components/rightbar/rightbar'
import {Home} from './components/content/home'
import {SimonSays} from './components/content/simonsays'

export function Root(props) {
  const {children} = props
  return (
    <>
      <Topbar/>
      <main>
        <Leftbar/>
        <Outlet/>
      </main>
    </>
  )
}

export {
  Home,
  SimonSays
}
