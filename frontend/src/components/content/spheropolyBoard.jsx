import { css } from '@emotion/react'

function Tile(props) {
    const {owner, name, cost} = props

    const styles = css`
        height: 100px;
        width: 100px;
        background-color: #51b45b;
        border-style: solid;
        border-color: black;
        border-width: 1px;
    `

    return (
        <div css={styles}>
            test
        </div>
    )
    
}

function Edge(props) {

    const styles = css`
        height: 100px;
        width: 100px;
        background-color: rgb(57, 57, 57);
        border-style: solid;
        border-color: rgb(57, 57, 57);
        border-width: 1px;
    `
    return (
        <div css={styles}></div>
    )
}

function HalfEdge() {
    const styles= css`
        height: 50px;
        width: 100px;
        background-color: rgb(57, 57, 57);
        border-style: solid;
        border-color: rgb(57, 57, 57);
        border-width: 1px;
    `
    return (
        <div css={styles}></div>
    )
}

function HalfEdgeVert(props) {
    const styles= css`
        height: 100px;
        width: 50px;
        background-color: rgb(57, 57, 57);
        border-style: solid;
        border-color: rgb(57, 57, 57);
        border-width: 1px;
    `
    return (
        <div css={styles}></div>
    )
}

function EdgeCorner() {
    const styles= css`
        height: 50px;
        width: 50px;
        background-color: rgb(57, 57, 57);
        border-style: solid;
        border-color: rgb(57, 57, 57);
        border-width: 1px;
    `
    return (
        <div css={styles}></div>
    )
}


function HalfTile(props) {
    const styles= css`
        height: 50px;
        width: 100px;
        background-color: #51b45b;
        border-style: solid;
        border-color: black;
        border-width: 1px;
    `
    return (
        <div css={styles}></div>
    )
}

function HalfTileVert(props) {
    const styles= css`
        height: 100px;
        width: 50px;
        background-color: #51b45b;
        border-style: solid;
        border-color: black;
        border-width: 1px;
    `
    return (
        <div css={styles}></div>
    )
}

export function Board(props) {
    const {data} = props

    const main = css`
        display: flex;
        flex-direction: column;
        margin-top: auto;
    `
    const styles = css`
        color: red;
        display: flex;
        flex-direction: row;
        margin-top:auto;
    `

    const empty = css`
        height: 565px;
        width: 565px;
        margin-top: auto;
        background-color: rgb(57, 57, 57);
    `
    return(
        <>
        {data 
            ? <div css={main}>
            <div css={styles} className="row">
            <EdgeCorner/>
            <HalfEdge/>
            <HalfEdge/>
            <EdgeCorner/>
            <HalfEdge/>
            <HalfEdge/>
            <EdgeCorner/>
            </div>
            <div css={styles} className="row">
                <Edge/>
                <HalfEdgeVert/>
                <Tile/>
                <HalfTileVert/>
                <Tile/>
                <Edge/>
                <HalfEdgeVert/>
            </div>
            <div css={styles} className="row">
                <HalfEdgeVert/>
                <Tile/>
                <Tile/>
                <HalfEdgeVert/>
                <Tile/>
                <Tile/>
                <HalfEdgeVert/>
            </div>
            <div css={styles} className="row">
                <EdgeCorner/>
                <HalfTile/>
                <HalfEdge/>
                <EdgeCorner/>
                <HalfEdge/>
                <HalfTile/>
                <EdgeCorner/>
            </div>
            <div css={styles} className="row">
                <HalfEdgeVert/>
                <Tile/>
                <Tile/>
                <HalfEdgeVert/>
                <Tile/>
                <Tile/>
                <HalfEdgeVert/>
            </div>
            <div css={styles} className="row">
                <HalfEdgeVert/>
                <Edge/>
                <Tile/>
                <HalfTileVert/>
                <Tile/>
                <HalfEdgeVert/>
                <Edge/>
            </div>
            <div css={styles} className="row">
            <EdgeCorner/>
            <HalfEdge/>
            <HalfEdge/>
            <EdgeCorner/>
            <HalfEdge/>
            <HalfEdge/>
            <EdgeCorner/>
            </div>
            
        </div> :
        
        <div css={empty}>Awaiting response.</div>  
        }</>
    )
}