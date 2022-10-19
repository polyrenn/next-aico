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
  Button,
  Spinner,
  Center
} from "@chakra-ui/react";

import useSWR from "swr";

import React, { FC, useEffect, Ref, useState } from "react";

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
  cancelSummary: any
  category: String | undefined
}

import { useColorModeValue } from "@chakra-ui/react";
import CrbTable from "../Common/CrbTable";
import CrbNumber from "./CrbNumber";

const SummaryCard:FC<SummaryProps> = React.forwardRef(
  (props, ref) => {

    const summary = props.summary;
    let sidebar
    console.log(props.customer)
    //const customer = formValues.current.values.user
  
    useEffect(() => {
       console.log(summary)
    }, [summary])

    sidebar = (
        
      summary.map((item) =>
      <Box bg="#fafafa" key={item.kg}>
        <HStack border='2px solid' my={4} h="48px" px={8} justify="space-between">
          <Flex>
          <Text fontWeight={500}>{item.amount}x</Text>
          <Text fontWeight={500} key={item.kg}>
            
            {item.kg} Kg
          </Text>
          </Flex>
         

      <Text fontWeight={700}> Total {item.amount * item.kg} KG</Text>
      <Text>{item.amount * item.kg * props.pricePerKg}</Text>
        
       
        </HStack>
         <Divider orientation="horizontal" />
         </Box>
      )  

  );


const handleCancel = () => {
  props.cancelSummary([])
}

const CrbNumber2 = () => {

  const [number, setNumber] = useState<number>(0)

  const fetcher = (url:string) => fetch(url).then((res) => res.json())
  const { data, error } = useSWR('/api/dummycrb', fetcher, {
    onSuccess: (data) => {
      setNumber(data.id)
    }
  });

  if(!data) return <Center><Spinner></Spinner></Center>
  


  return (
    <Text fontSize={'sm'}
    fontWeight={500}
    bg={useColorModeValue('cyan.50', 'cyan.900')}
    p={2}
    px={4}
    my={2}
    width="fit-content"
    color={'cyan.900'}
    rounded={'md'}> CRB #{data.id + 1}</Text>
  )
 
  

};

    

    
    
       return (
      <Box style={{
        position: 'sticky',
        top: 0,
        alignSelf: 'flex-start'
      }} className="summary-card" ref={ref} p={4} bg="white" w="fit-content" rounded="md">
        <Stack justifyContent="space-between" direction="row" spacing={1}>
          <Box>
          <Heading size="md">Summary</Heading>
          </Box>

          <Box>
          <Heading size="md">{props.category}</Heading>
          </Box>

        </Stack>
            <CrbNumber></CrbNumber>
        <VStack w="100%">
        </VStack>
        <Box>
            <Heading size="xs">Customer: {props.customer}</Heading>
            <Stack>
            {new Date().toLocaleDateString()}
          </Stack>
          </Box>
        <Divider my={4} orientation="horizontal" />
        <CrbTable pricePerKg={props.pricePerKg} summary={summary}></CrbTable>
        <VStack my={4}>
          <Heading size="sm">Proceed to CashPoint</Heading>
        </VStack>
      </Box>
    );
  }
);

export default SummaryCard;
