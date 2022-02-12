import { Box } from '@chakra-ui/react'
import React from 'react'

interface wrapperProps {
    size?: 'small' | 'large'
}

const Wrapper: React.FC<wrapperProps> = ({children, size='regular'}) => {
    return <Box mt={10} mx="auto" maxW={size === 'large' ? "700px" : "450px"} w="100%">{children}</Box>
}

export default Wrapper
