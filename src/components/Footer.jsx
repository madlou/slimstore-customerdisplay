import { Container, Group, Title } from '@mantine/core'
import React from 'react'

const Footer = ({ store, register, socket }) => {
    return (
        <Container>
            {store && register ? (
                <Group
                    onClick={socket.disconnect}
                    justify='center'
                >
                    <Title
                        order={4}
                        c={'grey'}>
                        {store.number.pad(4) + '-' + register.number.pad(2)}
                    </Title>
                </Group>
            ) : ''}
        </Container>
    )
}

export default Footer