import React from 'react'
import { Box, Center, Paper, Text } from '@mantine/core'
import rainbow from '../styles/Rainbow.module.css'

const Welcome = ({ translations, showThankyou, status }) => {
    const message = showThankyou ? translations.thankyou : translations.welcome;
    return (
        <Center
            flex={1}
        >
            {status != 'OPEN' ? (
                <Paper
                    p={'xl'}
                    shadow='xl'
                    fz={'7vw'}
                    bd={'1px solid grey'}
                    style={{
                        textWrap: 'balance',
                        textAlign: 'center',
                    }}
                >{translations.registerClosed}</Paper>
            ) : (
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
            )}
        </Center >
    )
}

export default Welcome