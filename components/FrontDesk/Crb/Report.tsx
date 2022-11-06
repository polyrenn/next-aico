import { FC, useState } from "react"
//Utility Imports
import { Divider, Heading, useDisclosure, VStack } from "@chakra-ui/react"
import {  Formik, Field, Form, FormikHelpers } from "formik"
import * as Yup from 'yup';
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useRef, useContext } from "react";
import ReactToPrint from "react-to-print";
import Select from "react-select"

//Layout Imports

import { Center, Box, Flex, HStack, Stack } from "@chakra-ui/react"

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
    FormControl,
    FormErrorMessage,
    FormLabel,
    FormHelperText,
    Input,
} from '@chakra-ui/react'

import { BranchContext } from "../../../pages/FrontDesk/CashPoint";
import { colorCode } from "../../Admin/Prices/Category";
import useSWR from "swr";


interface ModalProps {
    isOpen: boolean
    onClose: any
    branchId: any
}
export const textCode = (item:string) => {
    switch (item) {
        case 'Domestic':
            return 'teal.800'
    
        case 'Dealer':
            return 'green.800'

        case 'Eatery':
            return 'blue.800'
        
        case 'Civil Servant':
            return 'yellow.800'
                    
        default:
            break;
    }
}
const fetcher = (url:string) => fetch(url).then((res) => res.json())
const Report:FC<ModalProps> = (props) => {

    const branchId = props.branchId
    const today = new Date().toDateString();
    const { data, error } = useSWR(`/api/FrontDesk/CrbReport?branch=${branchId}`, fetcher, {
        onSuccess: (data) => {
         
    }});
  
    return (
        <Modal size="xl" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Report</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Box borderWidth="1px" rounded={8} mb={2} p={4}>
            {today}
            </Box>
            <Flex justifyContent="space-between">
             {data ? data[0]?.map((item:any) => 
                <HStack key={item.category} ml={2} flex={1} color={`${textCode(item.category)}`} backgroundColor={`${colorCode(item.category)}`}>
                <Box fontWeight={500} p={4}>
                    <Heading size="sm">
                        {item.category}
                    </Heading>
                    <Box mb={2}>
                        <Text>Sales Count</Text>
                        <Text>{item.count}</Text>
                    </Box>
                    <Box mb={2}>
                        <Text>Total Kg</Text>
                        <Text>{item.total_kg_sold} KG</Text>
                    </Box>
    
                    <Box mb={2}>
                        <Text>Amount Sold</Text>
                        <Text>{item.total_amount_sold?.toLocaleString()} NGN</Text>
                    </Box>
                    
                </Box>
              </HStack>
              
             ) : null}  
            </Flex>

            <Divider/>

            <Box my={4}>
                <Heading fontWeight={500} color="gray.600" size="md">Total Stats</Heading>
            {data ? data[1]?.map((item:any) =>
                <Box>
                    <Box my={4}>
                        <Text>Total Sold Today</Text>
                        <Text>{item.count_invoice}</Text>
                    </Box>

                    <Divider/>

                    <Box my={4}>
                        <Text>Total Kg Today</Text>
                        <Text>{item.kg_sold} KG</Text>
                    </Box> 

                    <Divider/>

                    <Box my={4}>
                        <Text>Amount Sold Today</Text>
                        <Text>{item.amount_sold?.toLocaleString()} NGN</Text>
                    </Box>     
                </Box>     
            ) : null}
            </Box>
          
          
            

          </ModalBody>

          <ModalFooter>
            <Button mx={4} colorScheme='blue' mr={3} onClick={props.onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
}

export default Report