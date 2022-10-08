import { FC, useState } from "react"
//Utility Imports
import { useDisclosure, VStack } from "@chakra-ui/react"
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

import { BranchContext } from "../../../pages/FrontDesk/Crb";
import DetailTable from "./DetailTable";


interface ModalProps {
    isOpen: boolean
    onClose: any
    summary:any
}

const LogReceipt:FC<ModalProps> = (props) => {
  
    return (
        <Modal size="lg" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Receipt</ModalHeader>
          <ModalCloseButton />
          <ModalBody>

          <Box rounded={8} mb={2} bg="green.100" color="green.800" p={4}>
            <Stack direction="column">
                <Text> Customer ID: {props.summary[0]?.customer_id}</Text>
                <Text> Name: {props.summary[0]?.name}</Text>
                <Text> Phone: {props.summary[0]?.phone}</Text>

            </Stack>
            
            </Box> 

            <DetailTable summary={props.summary}></DetailTable>

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

export default LogReceipt