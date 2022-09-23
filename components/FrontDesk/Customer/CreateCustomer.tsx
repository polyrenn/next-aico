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

import Barcode from './Barcode'

interface ModalProps {
    isOpen: boolean
    onClose: any
    branch: any
}

const SignupSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    phone: Yup.string()
      .min(11, 'Too Short!')
      .max(11, 'Too Long!')
      .required('Required'),
  });


const CreateCustomer:FC<ModalProps> = (props) => {

  const customStyles = {
    control: (provided:any, state:any) => ({
     ...provided,   
     minHeight: "56px"
    }),

  }  

  const customerTypes = [
    { value: "Regular", label: "Regular" },
    { value: "Civil", label: "Civil Servant" },
  ]

  const { branchId: branch } = useContext(BranchContext)  

    let barcodeRef = useRef<null | HTMLDivElement>(null);
    const [name, setName] = useState<string>('')
    const [phone, setPhone] = useState<string>('')

    const toast = useToast()

    const createCustomer = async (values: {name: string, phone: string, type: string}, actions:any) => {

      const name = values.name
      const phone = values.phone
      const type = values.type
      const data = {
        name: name,
        phone: phone,
        date: new Date(),
        uniqueId: `${phone.slice(-3)}` + `${name.slice(-3).toUpperCase()}`,
        customerType: type
      }

      const datetime = data.date

      const res = await fetch(`/api/Customer/CreateCustomer?branch=${branch}`, {
        method: 'post',
        body: JSON.stringify(data),
      }).then( (res) => {
  
        if(res.ok) {
            toast({
                title: 'Customer Added.',
                description: `New Customer Added Successfully. At ${datetime} `,
                status: 'success',
                duration: 10000,
                isClosable: true,
              }),
              actions.setSubmitting(false);
              setName(name)
              setPhone(phone)
        } else {
            toast({
                title: 'Error',
                description: "An Error Has Occured.",
                status: 'error',
                duration: 10000,
                isClosable: true,
              }),
              actions.setSubmitting(false);
        }
        
    }
      )
    }

    function validateName(value:string) {
        let error
        if (!value) {
          error = 'Name is required'
        } 
        return error
      }

      function validateNumber(value:string) {
        let error
        if (!value) {
          error = 'Number is required'
        } else if (/[a-zA-Z]/.test(value)) {
            error = "Invalid Number"
          }  else if (value.length < 11) {
            error = "Invalid Number"
          }
        return error
      }

      function capitalizeName(name:string) {
        return name.replace(/\b(\w)/g, s => s.toUpperCase());
      }

      const initialValues = {
        name: "",
        phone: "",
        type: "",
      }
    
    return (
        <Modal size="lg" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Customer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => {
                values.name = capitalizeName(values.name);
                alert(JSON.stringify(values, null, 2))
                createCustomer(values, actions)
                // on callback 
                
        
      }}
    >
      {(props) => (
        <Form>
          <Field name='name' validate={validateName}>
            {({ field, form }:any) => (
              <FormControl mb={2} isInvalid={form.errors.name && form.touched.name}>
                <FormLabel color={'gray.500'} htmlFor="customer">Name</FormLabel>
                <Input {...field} placeholder='Customer Name' h="56px" textTransform="capitalize" />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field name='phone' validate={validateNumber}>
            {({ field, form }:any) => (
              <FormControl isInvalid={form.errors.phone && form.touched.phone}>
                 <FormLabel color={'gray.500'} htmlFor="customer">Phone</FormLabel>
                <Input {...field} placeholder='Customer Number' h="56px" maxLength="11" />
                <FormHelperText>Phone number required for registration</FormHelperText>
                <FormErrorMessage>{form.errors.phone}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field validate={validateName} name='type'>
            {({ field, form }:any) => (
              <FormControl my={2} isInvalid={form.errors.type && form.touched.type}>
                <FormLabel color={'gray.500'} htmlFor="type">Customer Type</FormLabel>
                <Select
                  styles={customStyles}
                  instanceId="type-select"
                  placeholder="Select Type"
                  options={customerTypes}
                  onChange={(option:any) => props.setFieldValue('type', option.value)}
                 
                />
                  <FormErrorMessage>{form.errors.type}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Button
            my={4}
            colorScheme='purple'
            isLoading={props.isSubmitting}
            type='submit'
            width="full"
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
          <Barcode
          name={name}
          phone={phone}
          ref={(el:any) => (barcodeRef = el)}
          
          ></Barcode>
            <Center p={2} color={'blue.900'} bg={'blue.50'}>
                <HStack spacing="8px">
                    <Text>AicoGas</Text>
                    <Text>•</Text>
                    <Text>Airport</Text>
                </HStack>
                    
            </Center>


          </ModalBody>

          <ModalFooter>
          <ReactToPrint
              trigger={() =>  <Button colorScheme="purple" type="submit">Print Code</Button>}
              content={() => barcodeRef}
              onAfterPrint={() => {alert("Hey")}}
          />
            <Button mx={4} colorScheme='blue' mr={3} onClick={props.onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
}

export default CreateCustomer