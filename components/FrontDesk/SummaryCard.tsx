import { Box, Divider, Stack, Flex, HStack, Spacer, VStack, Heading, Text } from '@chakra-ui/react'
import React from 'react';
 const SummaryCard = React.forwardRef((props, ref) =>  {
    const summary = props.summary
    let customer = props.customer;
    let pos = props.pos;
    let cash = props.cash
    let transfer = props.transfer
    const compute = props.computeTotal;
    const sidebar = (
        
          summary.map((item) =>
          <Box key={item.kg}>
            <HStack border='2px solid' my={4} h="48px" px={8} justify="space-between" bg="#fafafa" >
             
              <Text fontWeight={500}>{item.amount}x</Text>
              <Text fontWeight={500} key={item.kg}>
                
              {item.kg} Kg
            </Text>

          <Text fontWeight={700}> Total {item.amount * item.kg} KG</Text>
            
           
            </HStack>
             <Divider orrientation={"horizontal"} />
             </Box>
          )  
    
      );
    return (
        <Box ref={ref} p={6} bg="white" w="500px" rounded="md">
        <Stack spacing={1}>
        <VStack>
                <Heading size="md" fontWeight={800}>DeroGas</Heading>
                <Heading size="sm">31 Uribi Street, Iya-Ero, Benin City</Heading>
                <Text fontWeight={500}>08116014643</Text> 
            </VStack>

            <Heading size="md" >Summary</Heading>
            <Text color={'grey.500'}>Sales Summary</Text>
          </Stack>
            
            
              {sidebar}
              
              
            
            <Divider my={4} orientation='horizontal' />
            <VStack my={4}>
              <Text color={'grey.500'}>Total</Text>
              <Heading size="md">{`${compute(summary) * props.sales}`}</Heading>
            </VStack>

            <HStack borderRadius={4} border="2px solid" py={4} px={8} justify="space-between" my={8} bg="#fafafa">
                <Text fontWeight={600}>Customer</Text>
                <Text fontWeight={600}>{customer}</Text>
            </HStack>

            <HStack align="center" justify="center" borderRadius={4} border="2px solid">
                <Box borderRight="2px solid" textAlign="center" flex={1}>
                    <Text>Pos</Text>
                    <Text>{pos}</Text>
                </Box>
                <Box borderRight="2px solid" textAlign="center" flex={1}>
                    <Text>Cash</Text>
                    <Text>{cash}</Text>
                </Box>
                <Box textAlign="center" flex={1}>
                    <Text>Transfer</Text>
                    <Text>{transfer}</Text>
                </Box>
            </HStack>

            <VStack my={8}>
                <Text>Thank you for your patronage...</Text>
            </VStack>
            
    </Box>
        
    )
});

export default SummaryCard;