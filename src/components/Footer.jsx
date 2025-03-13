import { useContext } from 'react'
import { Container, Group, Title } from '@mantine/core'
import { LocationContext } from '../providers/LocationProvider';
import { DisplayContext } from '../providers/DisplayProvider';

const Footer = () => {
    const { register, store } = useContext(LocationContext);
    const { socket } = useContext(DisplayContext);
    const storeNumber = store?.number?.toString().padStart(4, "0") ?? '0000';
    const registerNumber = register?.number?.toString().padStart(2, "0") ?? '00';
    return (
        <Container>
            <Group
                onClick={socket.disconnect}
                justify='center'
            >
                <Title
                    order={4}
                    c={'grey'}>
                    { storeNumber }-{ registerNumber }
                </Title>
            </Group>
        </Container>
    )
}

export default Footer