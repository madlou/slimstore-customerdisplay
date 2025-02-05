import { useContext } from 'react'
import { Button, NumberInput, Paper } from '@mantine/core';
import { useForm } from '@mantine/form';
import { TranslationContext } from '../providers/TranslationProvider';
import { LocationContext } from '../providers/LocationProvider';
import { SocketContext } from '../providers/SocketProvider';

const Form = () => {
    const { translations } = useContext(TranslationContext);
    const { location, setLocation } = useContext(LocationContext);
    const { status } = useContext(SocketContext);
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: location,
        validate: {
            store: (value) => (/^[0-9]{1,4}$/.test(value) ? null : 'Invalid store number'),
            register: (value) => (/^[0-9]{1,2}$/.test(value) ? null : 'Invalid register number'),
        }
    });
    return (<>
        {status == 'CHANGESTORE' ? (
            <Paper
                flex={1}
                m={16}
                p={32}
            >
                <form onSubmit={form.onSubmit((values) => setLocation({ ...values }))}>
                    <NumberInput
                        key={form.key('store')}
                        label={translations?.store}
                        mt={16}
                        {...form.getInputProps('store')}
                    />
                    <NumberInput
                        key={form.key('register')}
                        label={translations?.register}
                        mt={16}
                        {...form.getInputProps('register')}
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