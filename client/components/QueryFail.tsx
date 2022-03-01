import { Box, Button, Heading, Image } from '@chakra-ui/react'
import React from 'react'

interface QueryFailProps { }

const QueryFail: React.FC<QueryFailProps> = ({ }) => {
    return (
        <Box height="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bg="white">
            <Heading as='h2' size='xl' mb={1}>
                Something went wrong on our side
            </Heading>
            <Image height="70%" width="50%" src='error.jpg' alt='' />
            <Button
                size='md'
                height='45px'
                width='120px'
                border='2px'
                my={2}
                colorScheme='red'
                variant='solid'
                onClick={() => window.location.reload()}
            >
                Try again
            </Button>
        </Box>
    )
}

export default QueryFail