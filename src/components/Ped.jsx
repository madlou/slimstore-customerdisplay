import { useContext, useState } from 'react';
import { Button, Center, Container, TextInput, Title } from '@mantine/core';
import { DisplayContext } from '../providers/DisplayProvider';
import { LocationContext } from '../providers/LocationProvider';

const Ped = () => {
    const { tender } = useContext(DisplayContext);
    const { formatMoney } = useContext(LocationContext);
    const [ pin, setPIN ] = useState('');
    const tenderline = tender.filter((line)=>{ 
        return line.type === 'CARD' && line.card.status === 'INITIAL' ; 
    });
    const keypad = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['Delete', '0', 'Clear'],
        ['Cancel', '', 'Ok']
    ];
    const amount = tenderline[0]?.value ?? 0;
    const handleKeyPress = (key) => {
        setPIN((prev)=>{ 
            switch (key) {
                case 'Clear':
                    return '';
                case 'Cancel':
                    return '';
                case 'Delete':
                    return prev.substring(0, prev.length - 1);
                case 'Ok':
                    return prev;
                default:
                    return prev + key;
            }
        });
    };
    const getButtonColor = (key) => {
        switch (key) {
            case 'Delete':
            case 'Clear':
                return 'grey';
            case 'Cancel':
                return 'red';
            case 'Ok':
                return 'green';
            default:
                return 'blue';
        }
    }
    return (<>
        {amount == 0 ? '' : (
            <Container
                style={{ 
                    position: 'absolute',
                    top: '60px',
                    bottom: '60px',
                    left: '30px',
                    right: '30px',
                    backgroundColor: 'white',
                }}
            >
                <Center><Title order={2}>PED Emulator</Title></Center>
                <Center><Title order={3} mt={12} mb={12} fz={44}>{formatMoney(amount)}</Title></Center>
                <Center>
                    <TextInput
                        type='password'
                        value={pin}
                        size='xl'
                        w={100}
                        mb={12}
                        ta='center'
                        disabled
                    />
                </Center>
                {keypad.map((row, i) => (
                    <Center key={i}>
                        {row.map((key, j) => (
                            <Button 
                                key={j}
                                onClick={() => handleKeyPress(key)}
                                m={8}
                                w={120}
                                h={66}
                                fz={28}
                                style={{
                                    visibility: key === '' ? 'hidden' : 'visible',
                                    backgroundColor: getButtonColor(key),
                                }}
                            >
                                {key}
                            </Button>
                        ))}
                    </Center>
                ))}
            </Container>
        )}
    </>);
};

export default Ped;
