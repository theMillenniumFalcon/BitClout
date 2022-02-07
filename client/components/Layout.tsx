import { Layout } from 'framer-motion/types/projection/node/types'
import NavBar from './NavBar'
import Wrapper from './Wrapper'

interface layoutprops {
    variant?: 'small' | 'regular'
}

const Layout: React.FC<layoutprops> = ({ children, variant='regular' }) => {
    return (
        <>
        <NavBar />
        <Wrapper variant={variant}>
            {children}
        </Wrapper>
        </>
    )
}

export default Layout