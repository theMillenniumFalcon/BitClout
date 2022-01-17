import { Flex, Box, Link } from "@chakra-ui/react"
import React from "react"
import NextLink from 'next/link'

interface navbarprops {}

const NavBar: React.FC<navbarprops> = ({}) => {
    return (
        <Flex bg="red" p={4}>
            <Box ml={"auto"}>
             {/* NextLink uses client-side routing */}
                <NextLink href='/login'>
                    <Link mr={2}>login</Link>
                </NextLink>
                <NextLink href='/register'>
                    <Link>register</Link>
                </NextLink>
            </Box>
        </Flex>
    )
}

export default NavBar