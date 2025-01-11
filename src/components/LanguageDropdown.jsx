import { Select } from '@mantine/core';
import { useContext } from 'react';
import { TranslationContext } from '../context/TranslationProvider';

function LanguageDropdown() {
    const { language, setLanguage, languages } = useContext(TranslationContext);
    return (
        <>
            <Select
                data={languages}
                onChange={setLanguage}
                value={language}
                w={80}
            />
        </>
    )
}

export default LanguageDropdown;
