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


interface ModalProps {
    isOpen: boolean
    onClose: any
    summary:any
}

const Report:FC<ModalProps> = (props) => {

    const today = new Date().toDateString();
  
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