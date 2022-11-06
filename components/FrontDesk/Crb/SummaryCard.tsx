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
import {  useFormik,
  Formik,
  FormikHelpers,
  FormikProps,
  FieldArray,
  Form,
  Field,
  FieldProps } from "formik";

import useSWR from "swr";
import ReactToPrint from "react-to-print";

import React, { FC, useEffect, useRef, Ref, useState } from "react";

type Summary = {
    kg: string,
    amount: number,
    total: number,
}

type FormValues = {
  friends: []
};

interface SummaryProps {
  summary: any;
  ref: any;
  form: FormikProps<any>
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

    let componentRef = useRef<null | HTMLDivElement>(null);

    const summary = props.summary;
    let sidebar
    console.log(props.customer)
    const form = props.form
    //const customer = formValues.current.values.user
  
    useEffect(() => {
       console.log(summary)
    }, [summary])

    sidebar = (
        
      summary.map((item:any) =>
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

const Print:FC<any> = React.forwardRef((props, ref) => {
  return(
    <Box ref={ref} p={4}>
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
     { /* <Button isDisabled={summary.length == 0 ? true : false} width="full" onClick={() => form.current.submitForm()} colorScheme="purple">Complete</Button> */ }
    </Box>
  )
 
  })

const CrbNumber2 = () => {

  const [number, setNumber] = useState<number>(0)

  const fetcher = (url:string) => fetch(url).then((res) => res.json())
  const { data, error } = useSWR('/api/dummycrb', {refreshInterval: 1000}, fetcher, {
    onSuccess: (data) => {
      setNumber(data.id)
    }
  });

  if(!data) return <Center><Spinner></Spinner></Center>
  
  console.log(props.form)

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
        }} className="summary-card" p={4} bg="white" w="fit-content" rounded="md">
          <Print customer={props.customer} category={props.category} ref={(el:any) => (componentRef = el)}>

          </Print>
           <ReactToPrint
        trigger={() =><Button type="submit" isDisabled={summary.length == 0 ? true : false} width="full" onClick={() => form.current.submitForm()} colorScheme="purple">Complete</Button>
      }
      onAfterPrint={() => form.current.submitForm()}
        content={() => componentRef}
        />
        <Button mt={4} onClick={() => props.cancelSummary([])} width="full" color="white" bg="black">Cancel</Button>
        </Box>
  
       
    );
  }
);

export default SummaryCard;
