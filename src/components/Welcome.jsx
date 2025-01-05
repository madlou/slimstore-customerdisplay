import React from 'react'
import { Box, Center, Text } from '@mantine/core'
import rainbow from '../styles/Rainbow.module.css'

const Welcome = ({ translations, showThankyou }) => {
    const message = showThankyou ? translations.thankyou : translations.welcome;
    return (
        <Center
            flex={1}
        >
            <Box className={rainbow.container}>
                <Box className={rainbow.background}></Box>
                <Box className={rainbow.inner}>
                    <Text
                        span fz={'5vw'}
                        style={{
                            textWrap: 'balance',
                            textAlign: 'center',
                        }}
                    >
                        {message}
                    </Text>
                </Box>
            </Box>
        </Center >
    )
}

export default Welcome