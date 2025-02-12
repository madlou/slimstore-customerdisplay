import { useContext } from 'react';
import { Select } from '@mantine/core';
import { TranslationContext } from '../providers/TranslationProvider';

function LanguageDropdown() {
    const { language, setLanguage, languages } = useContext(TranslationContext);
    return (
        <>
            <Select
                data={ languages }
                onChange={ setLanguage }
                value={ language }
                w={80}
            />
        </>
    )
}

export default LanguageDropdown;
