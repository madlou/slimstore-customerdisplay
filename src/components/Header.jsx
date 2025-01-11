import { useContext } from 'react'
import { Container, Group, Title } from '@mantine/core'
import { TranslationContext } from '../context/TranslationProvider';
import { LocationContext } from '../context/LocationProvider';
import LanguageDropdown from './LanguageDropdown'

const Header = () => {
    const { translations } = useContext(TranslationContext);
    const { store } = useContext(LocationContext);
    return (
        <Container
            w={'100%'}
            maw={800}
        >
            <Group
                justify='space-between'
                mx={16}
            >
                <Title
                    order={1}
                    pt={4}
                >
                    {translations?.logo ?? ''}
                </Title>
                <Title
                    order={2}
                    pt={6}
                    visibleFrom='md'
                >
                    {store?.name ?? ''}
                </Title>
                <LanguageDropdown />
            </Group>
        </Container>
    )
}

export default Header