import { useContext } from 'react'
import { Box, Center, Paper, Text } from '@mantine/core'
import rainbow from '../styles/Rainbow.module.css'
import { TranslationContext } from '../context/TranslationProvider';
import { SocketContext } from '../context/SocketProvider';

const Welcome = () => {
    const { translations } = useContext(TranslationContext);
    const { basket, status, showThankyou } = useContext(SocketContext);
    const message = showThankyou ? translations?.thankyou : translations?.welcome ?? '';
    return (<>
        {basket.length == 0 && (status == 'CLOSED' || status == 'OPEN') ? (
            <Center
                flex={1}
            >
                {status == 'CLOSED' ? (
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
                ) : ''}
                {status == 'OPEN' ? (
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
                ) : ''}
            </Center >
        ) : ''}
    </>)
}

export default Welcome