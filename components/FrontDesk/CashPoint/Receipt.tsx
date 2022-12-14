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
    Center,
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

  interface BranchAddressId {
    address: string
    branchId: number
  }[]
  
  import { useColorModeValue } from "@chakra-ui/react";
  import CrbTable from "../Common/CrbTable";
  import { BranchContext } from "../../../pages/FrontDesk/CashPoint";
import CashPointTable from "./CashPointTable";
  
  const ReceiptCard:FC<any> = React.forwardRef(
    (props, ref) => {

     const { branchList }  = useContext(BranchContext)  as any
     const { user }  = useContext(BranchContext)  as any
     const { branch }  = useContext(BranchContext)  as any

     const phone = branch.address.split('0')[1]

      const summary = props.summary;
      let customer

      const [destructuredSum] = summary
      console.log(destructuredSum)
      const timestamp = destructuredSum?.timestamp.split('T')[0] as Date 
      const date = new Date(destructuredSum?.timestamp)
      console.log(date)
      const sidebar = (
        
        branchList.map((item:any) =>
        <Center fontWeight={600} key={item.branchId}>
          <VStack textAlign="center" mb={2} spacing={0}>
          <Text>{item.name}</Text>
          <Text textAlign="center">{item.address}</Text>
          </VStack>
         
           </Center>
        )  
  
    );
      console.log(props.customer)
      console.log(props.values)
      //const customer) = formValues.current.values.user
    
      
  //props.values.current ? props.values.current.values.payment : 'Her' 
  
      
  
      
      
         return (
        <Box ref={ref} p={4} bg="white" maxW="2xl" rounded="md">
            <Center>
            <Heading mb={2} size="md">{branch.company.name}</Heading>
            </Center>
            
            <Text fontSize={'lg'}
            fontWeight={700}
            borderWidth={'1px'}
            p={2}
            px={4}
            my={2}
            width="fit-content"
            color={'gray.900'}
            rounded={'md'}>Receipt No #{ destructuredSum?.crbNumber}</Text>
          <VStack w="100%">
            
          </VStack>
          <Box className="sales-info">
              <Heading my={2} size="sm">Customer: {props.customer ? props.customer?.name : destructuredSum?.customerId}</Heading>
              <Heading my={2} size="sm">Payment Method: {props.payment}</Heading>
              <Heading my={2} size="sm">Narrative: {props.narrative}</Heading>
            </Box>
          <Box textAlign="right">
          <Heading mb={1} size="md">{destructuredSum?.category}</Heading>
          </Box>
         
          <CashPointTable pricePerKg={props.pricePerKg} summary={summary}></CashPointTable>
          <Stack fontWeight={700} mb={2} spacing={0.5}>
            <Text>Paid: {props.amount} NGN</Text>
            <Text>Change: {props.amount - destructuredSum?.amount} NGN</Text>
            <Text>Change Debited: </Text>
            <Text>Time: {date.toLocaleTimeString()}</Text>
            <Text>Date: { date.toLocaleDateString("en-UK") }</Text>
            <Text>Attendant: {branch.name} { user.role }</Text>
          </Stack>

          <Divider my={1} borderColor="#0d0d0d" />


          <VStack spacing={1}>
            {sidebar}
           
          </VStack>

          <Divider my={1} borderColor="#0d0d0d" />

          <VStack fontSize="12px" spacing={1}>
            <Text fontWeight={700}>Thanks for your patronage</Text>
            <Text fontWeight={700}>Visit us Monday to Saturdat 7:30am to 6pm</Text>
            {branch.company.name == 'AicoGas Limited' ?  <Text fontWeight={700}>For complaints and enquries contact us on 08167875625</Text>
            : null }
           
          </VStack>

        </Box>
      );
    }
  );
  
  export default ReceiptCard;
  