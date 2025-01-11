import { Container, Group, Title } from '@mantine/core'
import { useContext } from 'react'
import { LocationContext } from '../context/LocationProvider';
import { SocketContext } from '../context/SocketProvider';

const Footer = () => {
    const { register, store } = useContext(LocationContext);
    const { socket } = useContext(SocketContext);
    const storeNumber = store?.number?.pad(4) ?? '0000';
    const registerNumber = register?.number?.pad(2) ?? '00';
    return (
        <Container>
            <Group
                onClick={socket.disconnect}
                justify='center'
            >
                <Title
                    order={4}
                    c={'grey'}>
                    {storeNumber}-{registerNumber}
                </Title>
            </Group>
        </Container>
    )
}

export default Footer