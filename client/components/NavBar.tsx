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
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <NextLink href='/login'>
                        <Button size='md' height='40px' width='110px' my={4} colorScheme='purple' variant='solid' mr={5}>
                            <Link style={{ textDecoration: "none" }}>Login</Link>
                        </Button>
                    </NextLink>
                    <NextLink href='/register'>
                        <Button size='md' height='40px' width='110px' my={4} colorScheme='purple' variant='solid'>
                            <Link style={{ textDecoration: "none" }}>Register</Link>
                        </Button>
                    </NextLink>
                </Box>
            </Flex>
        )
    } else if (data?.userLoggedIn) {
        body = (
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box mr={5} color='black'>{data.userLoggedIn.username}</Box>
                <Button size='md' height='40px' width='110px' onClick={() => logout()} isLoading={LogoutFetching} colorScheme='purple'>Logout</Button>
            </Box>
        )
    }

    return (
        <Flex zIndex={1} position="sticky" top={0} bg="pink" p={3}>
            <Flex flex={1} m="auto" align="center" maxW={1000}>
                <NextLink href="/">
                    <Link style={{ textDecoration: "none" }}>
                        <Heading color="black">Bitclout</Heading>
                    </Link>
                </NextLink>
                <Box ml={"auto"}>{body}</Box>
            </Flex>
        </Flex>
    )
}

export default Navbar