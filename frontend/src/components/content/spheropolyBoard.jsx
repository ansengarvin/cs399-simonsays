import { css } from '@emotion/react'

const owners = [
    "Nobody",
    "You",
    "Sphero"
]

function Tile(props) {
    const { tile } = props

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
            {tile && <>{tile.name}</>}<br />
            {tile && tile.cost && <>Price: {tile.cost}</>}<br />
            {tile && tile.owner != -1 && <>Owner: {owners[tile.owner]}</>}<br />
            {tile && tile.hasHuman && <i className="fa-solid fa-person fa-2xl"></i>}
            {tile && tile.hasRobot && <i className="fa-solid fa-robot fa-xl"></i>}
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
    const styles = css`
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
    const styles = css`
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
    const styles = css`
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
    const styles = css`
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
    const styles = css`
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
    const { data, state } = props

    const main = css`
        display: flex;
        flex-direction: column;
        margin-top: auto;
    `
    const styles = css`
        display: flex;
        flex-direction: row;
        margin-top:auto;
    `

    const white = css`
        color: white;
        flex-wrap: wrap;
    `

    const empty = css`
        height: 565px;
        width: 565px;
        margin-top: auto;
        background-color: rgb(57, 57, 57);
    `
    console.log(data)
    return (
        <>
            {state == "idle" && data && data.board
                ? <div css={main}>
                    <div css={styles} className="row">
                        <EdgeCorner />
                        <HalfEdge />
                        <HalfEdge />
                        <EdgeCorner />
                        <HalfEdge />
                        <HalfEdge />
                        <EdgeCorner />
                    </div>
                    <div css={styles} className="row">
                        <Edge />
                        <HalfEdgeVert />
                        <Tile tile={data.board["7"]} />
                        <HalfTileVert />
                        <Tile tile={data.board["6"]} />
                        <Edge />
                        <HalfEdgeVert />
                    </div>
                    <div css={styles} className="row">
                        <HalfEdgeVert />
                        <Tile tile={data.board["9"]} />
                        <Tile tile={data.board["8"]} />
                        <HalfEdgeVert />
                        <Tile tile={data.board["5"]} />
                        <Tile tile={data.board["4"]} />
                        <HalfEdgeVert />
                    </div>
                    <div css={styles} className="row">
                        <EdgeCorner />
                        <HalfTile />
                        <HalfEdge />
                        <EdgeCorner />
                        <HalfEdge />
                        <HalfTile />
                        <EdgeCorner />
                    </div>
                    <div css={styles} className="row">
                        <HalfEdgeVert />
                        <Tile tile={data.board["10"]} />
                        <Tile tile={data.board["11"]} />
                        <HalfEdgeVert />
                        <Tile tile={data.board["2"]} />
                        <Tile tile={data.board["3"]} />
                        <HalfEdgeVert />
                    </div>
                    <div css={styles} className="row">
                        <HalfEdgeVert />
                        <Edge />
                        <Tile tile={data.board["0"]} />
                        <HalfTileVert />
                        <Tile tile={data.board["1"]} />
                        <HalfEdgeVert />
                        <Edge />
                    </div>
                    <div css={styles} className="row">
                        <EdgeCorner />
                        <HalfEdge />
                        <HalfEdge />
                        <EdgeCorner />
                        <HalfEdge />
                        <HalfEdge />
                        <EdgeCorner />
                    </div>
                    <div css={styles, white} className="row">
                        Your Money: ${data.human.funds}<br />
                        Sphero's Money: ${data.robot.funds}<br />
                        {data.summary != "" && <>{data.summary}</>}
                    </div>

                </div> :

                <div css={empty}>Awaiting response.</div>
            }</>
    )
}