import { Select } from '@mantine/core';

function LanguageDropdown(props) {
    return (
        <>
            <Select
                data={props.languages}
                onChange={props.setLanguage}
                value={props.language}
                w={80}
            />
        </>
    )
}

export default LanguageDropdown;
