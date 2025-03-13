import { useContext } from 'react';
import { Center, Paper } from '@mantine/core'
import { TranslationContext } from '../providers/TranslationProvider';
import { DisplayContext } from '../providers/DisplayProvider';

const Connecting = () => {
    const { translations } = useContext(TranslationContext);
    const { status } = useContext(DisplayContext);
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