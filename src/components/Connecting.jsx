import { Center, Paper } from '@mantine/core'
import React from 'react'

const Connecting = ({ translations }) => {
    return (
        <Center
            flex={1}
        >
            <Paper
                ta={'center'}
                shadow='md'
                p={'xl'}
            >{translations.connectingToServer}</Paper>
        </Center>
    )
}

export default Connecting