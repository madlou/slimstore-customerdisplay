import { useContext } from 'react'
import { Box, Center, Paper, Text } from '@mantine/core'
import { TranslationContext } from '../providers/TranslationProvider';
import { SocketContext } from '../providers/SocketProvider';
import rainbow from '../styles/Rainbow.module.css'

const Welcome = () => {
    const { translations } = useContext(TranslationContext);
    const { basket, status, showThankyou } = useContext(SocketContext);
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
                {status == 'OPEN' && !showThankyou ? (
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
                                {translations?.welcome ?? ''}
                            </Text>
                        </Box>
                    </Box>
                ) : ''}
                {status == 'OPEN' && showThankyou? (
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
                                {translations?.thankyou ?? ''}
                            </Text>
                        </Box>
                    </Box>
                ) : ''}
            </Center >
        ) : ''}
    </>)
}

export default Welcome