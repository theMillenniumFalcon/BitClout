import React from 'react'
import styled from "styled-components"
import tw from "twin.macro"

const NavbarContainer = styled.div`
    min-height: 68px;
    ${tw`
        w-full
        max-w-screen-2xl
        flex
        flex-row
        items-center
        lg:pl-12
        lg:pr-12
        justify-between
    `}
`;

const Navbar = () => {
    return (
        <NavbarContainer>
            Hello
        </NavbarContainer>
    )
}

export default Navbar
