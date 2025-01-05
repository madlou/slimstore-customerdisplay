import { Center, Paper } from '@mantine/core'
import React from 'react'

const Connecting = () => {
    return (
        <Center flex={1}>
            <Paper
                ta={'center'}
                shadow='md'
                p={'xl'}
            >Connecting to server...</Paper>
        </Center>
    )
}

export default Connecting