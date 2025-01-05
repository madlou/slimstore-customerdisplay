import { Button, NumberInput, Paper } from '@mantine/core';
import { useForm } from '@mantine/form';
import React from 'react'

const Form = ({ location, setLocation }) => {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: location,
        validate: {
            store: (value) => (/^[0-9]{1,4}$/.test(value) ? null : 'Invalid store number'),
            register: (value) => (/^[0-9]{1,2}$/.test(value) ? null : 'Invalid register number'),
        }
    });
    return (
        <Paper
            flex={1}
            m={16}
            p={32}
        >
            <form onSubmit={form.onSubmit((values) => setLocation(values))}>
                <NumberInput
                    key={form.key('store')}
                    label='Store Number'
                    mt={16}
                    {...form.getInputProps('store')}
                />
                <NumberInput
                    key={form.key('register')}
                    label='Register Number'
                    mt={16}
                    {...form.getInputProps('register')}
                />
                <Button
                    mt={16}
                    type={'submit'}
                >Connect</Button>
            </form>
            <Button
                mt={16}
                onClick={() => { window.location.reload() }}
                display={location.store ? 'block' : 'none'}
            >Cancel</Button>
        </Paper>
    )
}

export default Form