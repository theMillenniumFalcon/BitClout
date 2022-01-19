import { Flex, Box, Link, Button } from "@chakra-ui/react"
import React from "react"
import NextLink from 'next/link'
import { useLogoutMutation, useMeQuery } from "../generated/graphql"

interface navbarprops { }

const NavBar: React.FC<navbarprops> = ({ }) => {
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
    const [{ data, fetching }] = useMeQuery()
    let body = null

    // * data is loading
    if (fetching) {

        // * user not logged in
    } else if (!data?.me) {
        body = (
            <>
                <NextLink href='/login'>
                    <Link mr={2}>login</Link>
                </NextLink>
                <NextLink href='/register'>
                    <Link>register</Link>
                </NextLink>
            </>
        )
        // * user is logged in
    } else {
        body = (
            <Flex>
                <Box mr={2}>{data.me.username}</Box>
                <Button
                    onCLick={() => {
                        logout()
                    }}
                    isLoading={logoutFetching}
                    variant="link">logout</Button>
            </Flex>
        )
    }

    return (
        <Flex bg="tan" p={4}>
            <Box ml={"auto"}>
                {/* NextLink uses client-side routing */}
                {body}
            </Box>
        </Flex>
    )
}

export default NavBar