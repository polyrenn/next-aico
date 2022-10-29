import { FC, useState } from "react"
//Utility Imports
import { Heading, useDisclosure, VStack } from "@chakra-ui/react"
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
    const { data, error } = useSWR(`/api/FrontDesk/SaleReport?branch=${branchId}`, fetcher, {
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
             {data?.map((item:any) => 
                <HStack ml={2} flex={1} color={`${textCode(item.category)}`} backgroundColor={`${colorCode(item.category)}`}>
                <Box>
                    <Heading size="sm">
                        {item.category}
                    </Heading>
                    <Box>
                        <Text>Sales Count</Text>
                        <Text>1</Text>
                    </Box>
                    <Box>
                        <Text>Total Kg</Text>
                        <Text>1</Text>
                    </Box>
    
                    <Box>
                        <Text>Amount Sold</Text>
                        <Text>1</Text>
                    </Box>
                    
                </Box>
              </HStack>
             )}   
            </Flex>
          
          
            

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