import React from 'react'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import Navbar from '../components/NavBar'
import NextLink from 'next/link'
import { Box, Flex, Stack, Link, Button, Heading } from '@chakra-ui/react'

interface exploregroupsProps {

}

const ExploreGroups: React.FC<exploregroupsProps> = ({ }) => {
    return (
        <>
            <Navbar />
            <Box w="800px" mx="auto" p={5}>
                <NextLink href='/create-group'>
                    <Button size='md' height='45px' width='120px' border='2px' my={4} colorScheme='red' variant='solid'>
                        <Link style={{ textDecoration: "none" }}>Create Group</Link>
                    </Button>
                </NextLink>
                <Stack spacing={8}>
                    <Flex p={5} shadow="md" borderWidth="1px">
                    <Heading fontSize="xl">
                        Group 1
                      </Heading>
                    </Flex>
                </Stack>
            </Box>
        </>
    )
}

export default withUrqlClient(createUrqlClient)(ExploreGroups)