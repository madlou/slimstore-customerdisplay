import React from 'react'
import LanguageDropdown from './LanguageDropdown'
import { Container, Group, Title } from '@mantine/core'

const Header = ({ languages, language, setLanguage, store, translations }) => {
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
                    {translations.logo}
                </Title>
                <Title
                    order={2}
                    pt={6}
                    visibleFrom='md'
                >
                    {store?.name ?? ''}
                </Title>
                <LanguageDropdown
                    language={language}
                    languages={languages}
                    setLanguage={setLanguage}
                />
            </Group>
        </Container>
    )
}

export default Header