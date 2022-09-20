import {
    Box,
    Divider,
    Stack,
    Flex,
    HStack,
    Spacer,
    VStack,
    Heading,
    Text,
  } from "@chakra-ui/react";
  
  
  import React, { FC, useEffect, Ref, useState, useContext } from "react";
  
  type Summary = {
      kg: string,
      amount: number,
      total: number,
  }
  
  interface SummaryProps {
    summary: any;
    ref: any;
    customer: string
    pricePerKg: number
  }
  
  import { useColorModeValue } from "@chakra-ui/react";
  import CrbTable from "../Common/CrbTable";
  import { BranchContext } from "../../../pages/FrontDesk/CashPoint";
import CashPointTable from "./CashPointTable";
  
  const ReceiptCard:FC<any> = React.forwardRef(
    (props, ref) => {

     const branch = useContext(BranchContext)   

      const summary = props.summary;

      const [destructuredSum] = summary
      const sidebar = (
        
        branch.map((item) =>
        <Box key={item.branchId}>
          <Text color={"grey.500"}>{item.address}</Text>
           </Box>
        )  
  
    );
      console.log(props.customer)
      console.log(props.values)
      //const customer) = formValues.current.values.user
    
      
  //props.values.current ? props.values.current.values.payment : 'Her' 
  
      
  
      
      
         return (
        <Box ref={ref} p={4} bg="white" w="500px" rounded="md">
          <Stack spacing={1}>
            <Heading size="md">AicoGas</Heading>
            {sidebar}
          </Stack>
              <Text fontSize={'sm'}
              fontWeight={500}
              bg={useColorModeValue('cyan.50', 'cyan.900')}
              p={2}
              px={4}
              my={2}
              width="fit-content"
              color={'cyan.900'}
              rounded={'md'}> Receipt No #</Text>
          <VStack w="100%">
          </VStack>
          <Box className="sales-info">
              <Heading my={2} size="sm">Customer: {destructuredSum?.customer?.name}</Heading>
              <Heading my={2} size="sm">Payment Method: {props.payment}</Heading>
              <Heading my={2} size="sm">Narrative: {props.narrative}</Heading>
            </Box>
          <Divider my={4} orientation="horizontal" />
          <CashPointTable pricePerKg={props.pricePerKg} summary={summary}></CashPointTable>
          <VStack my={4}>
            <Text color={"grey.500"}>Total</Text>
            <Heading size="md">{}</Heading>
          </VStack>
        </Box>
      );
    }
  );
  
  export default ReceiptCard;
  