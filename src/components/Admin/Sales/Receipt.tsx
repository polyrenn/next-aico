import { FC } from "react"
import { Stack } from "@chakra-ui/react"

//Layout Imports
import { Box, Flex, HStack } from "@chakra-ui/react"

// Element Import
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    Button,
    Badge,
} from '@chakra-ui/react'

import DetailTable from "./DetailTable";


interface ModalProps {
    isOpen: boolean
    onClose: any
    summary: any
}

const LogReceipt: FC<ModalProps> = (props) => {
    const sale = props.summary[0];
    
    if (!sale) return null;

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Format date/time
    const formatDateTime = (timestamp: string) => {
        if (!timestamp) return '-';
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-NG', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <Modal size="lg" isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex justify="space-between" align="center">
                        <Text>Sale Receipt</Text>
                        <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                            CRB-{sale.sale_number}
                        </Badge>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {/* Sale Info Header */}
                    <Box rounded={8} mb={4} bg="green.50" border="1px" borderColor="green.200" p={4}>
                        <Stack direction="column" spacing={2}>
                            <Flex justify="space-between">
                                <Text fontWeight="600" color="gray.600">Customer:</Text>
                                <Text fontWeight="700">{sale.customer_id || 'Walk-in'}</Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Text fontWeight="600" color="gray.600">Category:</Text>
                                <Badge colorScheme={
                                    sale.category === 'domestic' ? 'green' :
                                    sale.category === 'dealer' ? 'purple' :
                                    sale.category === 'eatery' ? 'orange' : 'gray'
                                }>
                                    {sale.category?.toUpperCase()}
                                </Badge>
                            </Flex>
                            <Flex justify="space-between">
                                <Text fontWeight="600" color="gray.600">Date:</Text>
                                <Text>{formatDateTime(sale.timestamp)}</Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Text fontWeight="600" color="gray.600">Time:</Text>
                                <Text>{sale.timestampTime || '-'}</Text>
                            </Flex>
                        </Stack>
                    </Box>

                    {/* Items Table */}
                    <DetailTable summary={props.summary} />

                    {/* Payment Summary */}
                    <Box mt={4} rounded={8} bg="gray.50" border="1px" borderColor="gray.200" p={4}>
                        <Stack direction="column" spacing={2}>
                            <Flex justify="space-between">
                                <Text fontWeight="600" color="gray.600">Total KG:</Text>
                                <Text fontWeight="700">{sale.total_kg} KG</Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Text fontWeight="600" color="gray.600">Amount:</Text>
                                <Text fontWeight="700" color="green.600">{formatCurrency(sale.amount)}</Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Text fontWeight="600" color="gray.600">Payment:</Text>
                                <Badge colorScheme={sale.payment_method === 'pos' ? 'blue' : 'green'}>
                                    {sale.payment_method?.toUpperCase()}
                                </Badge>
                            </Flex>
                            {sale.change > 0 && (
                                <Flex justify="space-between">
                                    <Text fontWeight="600" color="gray.600">Change:</Text>
                                    <Text fontWeight="700" color="orange.500">{formatCurrency(sale.change)}</Text>
                                </Flex>
                            )}
                        </Stack>
                    </Box>

                    {/* Tank Info */}
                    <Box mt={4} rounded={8} bg="blue.50" border="1px" borderColor="blue.200" p={4}>
                        <HStack justify="space-between">
                            <Text fontWeight="600" color="gray.600">Tank:</Text>
                            <Text fontWeight="700">{sale.current_tank}</Text>
                        </HStack>
                        <HStack justify="space-between" mt={2}>
                            <Text fontWeight="600" color="gray.600">Balance Stock:</Text>
                            <Text fontWeight="700">{sale.balance?.toFixed(2)} KG</Text>
                        </HStack>
                    </Box>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={props.onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default LogReceipt