import { useRef, useEffect } from 'react'
import { Text, Box, Group, Divider, ScrollArea, Paper } from '@mantine/core';
import moneyConverter from '../util/moneyConverter.js';

function Basket({ basket, tender, store, translations, isMobile }) {
    let total = 0;
    let lines = 0;
    let items = 0;
    let tenders = 0;
    let difference = null;
    basket.map((line, i) => {
        total += line.quantity * line.unitValue * (line.type == 'RETURN' ? -1 : 1);
        items += line.quantity;
        lines++;
    })
    tender.map((line, i) => {
        tenders += line.value;
    })
    if (tenders != 0) {
        difference = tenders - total;
    }
    const basketBottomRef = useRef(null);
    const scrollToBottom = () => {
        if (basketBottomRef.current) {
            basketBottomRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }
    const scrollHeight = isMobile ?
        'calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - 60px)' :
        'calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - 150px)';
    useEffect(() => {
        setTimeout(() => {
            scrollToBottom()
        }, 100)
    }, [basket, tender]);
    return (
        <Paper
            flex={1}
            p={32}
            m={isMobile ? 0 : 16}
            maw={800}
        >
            <ScrollArea.Autosize
                mx='auto'
                mah={scrollHeight}
            >
                <Box w={'95%'}>
                    {basket.map((line, i) => {
                        return (
                            <Box mb={8} key={i}>
                                <Text>{line.code} {line.name}</Text>
                                <Group
                                    justify='space-between'
                                >
                                    <Text>
                                        {line.quantity * (line.type == 'RETURN' ? -1 : 1)}
                                        &nbsp;@&nbsp;
                                        {moneyConverter(
                                            store.countryCode,
                                            store.currencyCode,
                                            line.unitValue,
                                        )}
                                    </Text>
                                    <Text>
                                        {moneyConverter(
                                            store.countryCode,
                                            store.currencyCode,
                                            (line.quantity * (line.type == 'RETURN' ? -1 : 1) * line.unitValue),
                                        )}
                                    </Text>
                                </Group>
                            </Box>
                        );
                    })}
                    {basket.length < 1 ? '' : (
                        <Box mb={8}>
                            <Divider mb={8} size='md' variant='dotted' />
                            <Text>
                                {translations.subtotal}
                                :&nbsp;
                                {moneyConverter(
                                    store.countryCode,
                                    store.currencyCode,
                                    total,
                                )}
                            </Text>
                            <Text>
                                {translations.transactionLines}
                                :&nbsp;
                                {lines}
                            </Text>
                            <Text>
                                {translations.items}
                                :&nbsp;
                                {items}
                            </Text>
                        </Box>
                    )}
                    {tender && tender.length > 0 ? (
                        <Box mb={8}>
                            <Divider mb={8} size='md' variant='dotted' />
                            {tender.map((line, i) => {
                                return <Text key={i}>
                                    {uiTranslations[line.label.toCamelCase()]}
                                    &nbsp;
                                    {moneyConverter(
                                        store.countryCode,
                                        store.currencyCode,
                                        line.value,
                                    )}
                                </Text>

                            })}
                        </Box>
                    ) : ''}
                    {tenders == 0 ? '' : (
                        <Box mb={8}>
                            <Divider mb={8} size='md' variant='dotted' />
                            <Text>
                                {translations.tenderTotal}
                                :&nbsp;
                                {moneyConverter(
                                    store.countryCode,
                                    store.currencyCode,
                                    tenders,
                                )}
                            </Text>
                        </Box>
                    )}
                    {tenders == 0 || difference == 0 ? '' : (
                        <Box mb={8}>
                            <Text>
                                {translations.difference}
                                :&nbsp;
                                {moneyConverter(
                                    store.countryCode,
                                    store.currencyCode,
                                    difference,
                                )}
                            </Text>
                        </Box>
                    )}
                    <div ref={basketBottomRef}></div>
                </Box>
            </ScrollArea.Autosize>
        </Paper>
    )
}

export default Basket
