import { Center } from '@mantine/core'
import React from 'react'

const Welcome = () => {
    return (
        <Center flex={1}>
            <div className='rainbow-container'>
                <div className='rainbow-background'></div>
                <div className='rainbow-inner'>
                    <span>Welcome to XJT!</span>
                </div>
            </div>
        </Center>
    )
}

export default Welcome