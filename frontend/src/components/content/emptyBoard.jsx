import React from "react";
import styled from "@emotion/styled";

const EmptyStyle = styled.div`
    height: 550px;
    width: 550px;
    margin-top: auto;
    background-color: rgb(0, 0, 0);
    color: white;
    font-size: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
`

export function EmptyBoard(props) {
    const { text } = props
    return (
        <EmptyStyle >
            {text}
        </EmptyStyle >
    )

}