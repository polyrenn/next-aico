import { FC } from "react"
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react'

interface TableProps {
    summary: any
}

const DetailTable: FC<TableProps> = (props) => {
    // Format currency
    const formatCurrency = (amount: number) => {
        if (!amount && amount !== 0) return '-';
        return new Intl.NumberFormat('en-NG', {
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Compute totals from description items
    const computeTotalQty = (items: any[]) => {
        if (!items || !Array.isArray(items)) return 0;
        return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    };

    const computeTotalKg = (items: any[]) => {
        if (!items || !Array.isArray(items)) return 0;
        return items.reduce((sum, item) => {
            // totalKg per item = kg * quantity
            const kg = parseFloat(item.kg) || 0;
            const qty = item.quantity || 0;
            return sum + (kg * qty);
        }, 0);
    };

    const computeTotalAmount = (items: any[]) => {
        if (!items || !Array.isArray(items)) return 0;
        return items.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
    };

    const sale = props.summary[0];
    if (!sale) return null;

    const items = sale.description || [];

    return (
        <TableContainer rounded={8} border='1px solid' borderColor='gray.300'>
            <Table variant='simple' size="sm">
                <TableCaption>Item Details</TableCaption>
                <Thead bg="gray.50">
                    <Tr>
                        <Th>KG Type</Th>
                        <Th isNumeric>Qty</Th>
                        <Th isNumeric>Total KG</Th>
                        <Th isNumeric>Amount (NGN)</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {items.map((item: any, index: number) => {
                        const kg = parseFloat(item.kg) || 0;
                        const qty = item.quantity || 0;
                        const totalKg = kg * qty;
                        const amount = item.totalAmount || 0;

                        return (
                            <Tr key={index}>
                                <Td fontWeight="500">{item.kg} KG</Td>
                                <Td isNumeric>{qty}</Td>
                                <Td isNumeric>{totalKg} KG</Td>
                                <Td isNumeric fontWeight="600">{formatCurrency(amount)}</Td>
                            </Tr>
                        );
                    })}

                    {/* Totals Row */}
                    <Tr bg="gray.100" fontWeight="bold">
                        <Td>TOTAL</Td>
                        <Td isNumeric>{computeTotalQty(items)}</Td>
                        <Td isNumeric>{sale.total_kg || computeTotalKg(items)} KG</Td>
                        <Td isNumeric color="green.600">{formatCurrency(sale.amount || computeTotalAmount(items))}</Td>
                    </Tr>
                </Tbody>
            </Table>
        </TableContainer>
    )
}

export default DetailTable