import { Box, Button, Flex, Link, Heading } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
import { useLogoutMutation, useUserLoggedInQuery } from '../generated/graphql'
import { isServer } from '../utils/isServer'

interface NavbarProps { }

const Navbar: React.FC<NavbarProps> = ({ }) => {
    const [{ fetching: LogoutFetching }, logout] = useLogoutMutation()
    const [{ data, fetching }] = useUserLoggedInQuery({ pause: isServer() })
    let body = null

    if (fetching) {
        body = null
    } else if (!data?.userLoggedIn) {
        body = (
            <Flex zIndex={1} position="sticky">
                <NextLink href='/login'>
                    <Link color='black' mr={5}>Login</Link>
                </NextLink>
                <NextLink href='/register'>
                    <Link color='black'>Register</Link>
                </NextLink>
            </Flex>
        )
    } else if (data?.userLoggedIn) {
        body = (
            <Flex>
                <NextLink href='/'>
                    <Link color='black' mr={5}>Home</Link>
                </NextLink>
                <Box mr={5} color='black'>{data.userLoggedIn.username}</Box>
                <Button variant='link' onClick={() => logout()} isLoading={LogoutFetching}>Logout</Button>
            </Flex>
        )
    }

    return (
        <Flex zIndex={1} position="sticky" top={0} bg="pink" p={3}>
            <Flex flex={1} m="auto" align="center" maxW={1000}>
                <NextLink href="/">
                    <Link style={{ textDecoration: "none" }}>
                        <Heading color="black">MyReddit</Heading>
                    </Link>
                </NextLink>
                <Box ml={"auto"}>{body}</Box>
            </Flex>
        </Flex>
    )
}

export default Navbar