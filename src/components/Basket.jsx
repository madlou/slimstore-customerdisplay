import { useRef, useEffect } from 'react'
import { Text, Box, Group, Divider, ScrollArea } from '@mantine/core';
import moneyConverter from '../util/moneyConverter.js';

function Basket(props) {
    let total = 0;
    let lines = 0;
    let items = 0;
    let tenders = 0;
    let difference = null;
    props.basket.map((line, i) => {
        total += line.quantity * line.unitValue * (line.type == 'RETURN' ? -1 : 1);
        items += line.quantity;
        lines++;
    })
    props.tender.map((line, i) => {
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
    const scrollHeight = 'calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - 120x)';
    useEffect(() => {
        setTimeout(() => {
            scrollToBottom()
        }, 100)
    }, [props.basket]);
    return (
        <ScrollArea.Autosize
            h={scrollHeight}
            mx='auto'
        >
            <Box w={'95%'}>
                {props.basket.map((line, i) => {
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
                                        props.store.countryCode,
                                        props.store.currencyCode,
                                        line.unitValue,
                                    )}
                                </Text>
                                <Text>
                                    {moneyConverter(
                                        props.store.countryCode,
                                        props.store.currencyCode,
                                        (line.quantity * (line.type == 'RETURN' ? -1 : 1) * line.unitValue),
                                    )}
                                </Text>
                            </Group>
                        </Box>
                    );
                })}
                {props.basket.length < 1 ? '' : (
                    <Box mb={8}>
                        <Divider mb={8} size='md' variant='dotted' />
                        <Text>
                            {props.translations.subtotal}
                            :&nbsp;
                            {moneyConverter(
                                props.store.countryCode,
                                props.store.currencyCode,
                                total,
                            )}
                        </Text>
                        <Text>
                            {props.translations.transactionLines}
                            :&nbsp;
                            {lines}
                        </Text>
                        <Text>
                            {props.translations.items}
                            :&nbsp;
                            {items}
                        </Text>
                    </Box>
                )}
                {props.tender && props.tender.length > 0 ? (
                    <Box mb={8}>
                        <Divider mb={8} size='md' variant='dotted' />
                        {props.tender.map((line, i) => {
                            return <Text key={i}>
                                {line.label}
                                &nbsp;
                                {moneyConverter(
                                    props.store.countryCode,
                                    props.store.currencyCode,
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
                            {props.translations.tenderTotal}
                            :&nbsp;
                            {moneyConverter(
                                props.store.countryCode,
                                props.store.currencyCode,
                                tenders,
                            )}
                        </Text>
                    </Box>
                )}
                {tenders == 0 || difference == 0 ? '' : (
                    <Box mb={8}>
                        <Text>
                            {props.translations.difference}
                            :&nbsp;
                            {moneyConverter(
                                props.store.countryCode,
                                props.store.currencyCode,
                                difference,
                            )}
                        </Text>
                    </Box>
                )}
                <div ref={basketBottomRef}></div>
            </Box>
        </ScrollArea.Autosize>
    )
}

export default Basket
