import { Box, Text } from '@mantine/core'
import { RxStarFilled } from 'react-icons/rx';

// eslint-disable-next-line react/prop-types
const ReviewStar = ( { filled, value, clicked } ) => {
    return (
        <Box 
            onClick={() => {clicked(value)}}
            style={{cursor: 'pointer'}}
            w={'10vw'}
        >
            <RxStarFilled {...{ 
                size: '8vw', 
                color: filled ? 'yellow' : 'white', 
                stroke: "black", 
                strokeWidth: "0.5" 
            }} />
            <Text 
                span
                fz={'3vw'}
                style={{
                    position: 'relative', 
                    color: filled ? 'black' : 'black', 
                    top: '-3vw', 
                    marginLeft: '-4.8vw',
                }}
            >{ value }</Text>
        </Box>
    )
    
}

export default ReviewStar;