import { useContext } from 'react';
import { Center, Paper } from '@mantine/core'
import { TranslationContext } from '../context/TranslationProvider';
import { SocketContext } from '../context/SocketProvider';

const Connecting = () => {
    const { translations } = useContext(TranslationContext);
    const { status } = useContext(SocketContext);
    return (<>
        {status == 'CONNECTING' ? (
            <Center
                flex={1}
            >
                <Paper
                    ta={'center'}
                    shadow='md'
                    p={'xl'}
                >{translations?.connectingToServer ?? 'Connecting to backend server...'}</Paper>
            </Center>
        ) : ''}
    </>)
}

export default Connecting