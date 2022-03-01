import { Box, Button, Heading, Link } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'

interface NoPageProps { }

const NoPage: React.FC<NoPageProps> = ({ }) => {
    return (
        <Box height="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bg="white">
            <Heading as='h2' size='xl' mb={1}>
                This page does not exist
            </Heading>
            <NextLink href='/'>
                <Button
                    size='md'
                    height='45px'
                    width='120px'
                    border='2px'
                    my={2}
                    colorScheme='red'
                    variant='solid'
                >
                    <Link style={{ textDecoration: "none" }}>Go to Home</Link>
                </Button>
            </NextLink>

        </Box>
    )
}

export default NoPage