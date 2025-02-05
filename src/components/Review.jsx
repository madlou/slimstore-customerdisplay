import { useState, useEffect, useContext, useRef } from 'react'
import { Center, Paper } from '@mantine/core'
import { LocationContext } from '../providers/LocationProvider';
import { useApi } from '../hooks/useApi'
import ReviewStar from './ReviewStar';

const Review = () => {
    const [animate, setAnimate] = useState(0);
    const [showThankyou, setShowThankyou] = useState(false);
    const { register, store, transaction } = useContext(LocationContext);
    const interval = useRef(null);
    const increment = ()=>{
        setAnimate((prev)=>{
            if(prev > 4) {
                prev = -1
            }
            return prev + 1;
        })
    }
    const api = useApi({
        url: '/api',
    });
    const clicked = (value) => {
        clearInterval(interval.current);
        setAnimate(value);
        setShowThankyou(true);
        api.get((json)=>{
            console.log(json)
        }, '/review/add/' + store.number + '/' + register.number + '/' + transaction + '/' + value)
    }
    useEffect(()=>{
        clearInterval(interval.current)
        interval.current = setInterval(increment, 350);
    }, [])
    return (
            <Paper 
                bd={'1px solid black'} 
                p={16} 
                mt={16} 
                bg={'#eee'} 
                shadow='md'
                radius='md'    
            >
                <Center 
                    mb={12} 
                    fw={'bold'} 
                    ta={'center'}
                >Please rate your service in-store today, by pressing the applicable star!</Center>
                <Center>
                    {[1, 2, 3, 4, 5].map((value)=>{
                        return <ReviewStar
                            key={value} 
                            value={value} 
                            filled={animate >= value} 
                            clicked={clicked} 
                        />
                    })}
                </Center>
                {showThankyou ? 
                    <Center>Thank you!</Center> :
                    <Center>The cashier will not see your score!</Center>
                }
            </Paper>
    )
}

export default Review