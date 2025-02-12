import { useContext } from 'react'
import { Button, NumberInput, Paper, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { TranslationContext } from '../providers/TranslationProvider';
import { LocationContext } from '../providers/LocationProvider';
import { SocketContext } from '../providers/SocketProvider';

const Form = () => {
    const { translations } = useContext(TranslationContext);
    const { authError, location, setLocation } = useContext(LocationContext);
    const { status } = useContext(SocketContext);
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: location,
        validate: {
            store: (value) => (/^[0-9]{1,4}$/.test(value) ? null : 'Invalid store number'),
            register: (value) => (/^[0-9]{1,2}$/.test(value) ? null : 'Invalid register number'),
            pin:  (value) => (/^[0-9]{1,4}$/.test(value) ? null : 'Invalid pin number'),
        }
    });
    return (<>
        {status == 'CHANGESTORE' ? (
            <Paper
                flex={1}
                m={16}
                p={32}
            >
                <Text
                    display={authError == null ? 'none' : 'block'}
                >{authError?.message ?? ''}</Text>
                <form onSubmit={form.onSubmit((values) => setLocation({ ...values }))}>
                    <NumberInput
                        key={form.key('store')}
                        label={translations?.storeNumber}
                        mt={16}
                        {...form.getInputProps('store')}
                    />
                    <NumberInput
                        key={form.key('register')}
                        label={translations?.registerNumber}
                        mt={16}
                        {...form.getInputProps('register')}
                    />
                    <NumberInput
                        key={form.key('pin')}
                        label={translations?.pinWithPath}
                        mt={16}
                        {...form.getInputProps('pin')}
                    />
                    <Button
                        mt={16}
                        type={'submit'}
                    >{translations?.update}</Button>
                </form>
                <Button
                    mt={16}
                    onClick={() => { window.location.reload() }}
                    display={location.store ? 'block' : 'none'}
                >{translations?.cancel}</Button>
            </Paper>
        ) : ''}
    </>)
}

export default Form