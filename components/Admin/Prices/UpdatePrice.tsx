import { FC, useState } from "react"
//Utility Imports
import { useDisclosure, VStack } from "@chakra-ui/react"
import {  Formik, Field, Form, FormikHelpers } from "formik"
import * as Yup from 'yup';
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useRef, useContext } from "react";
import ReactToPrint from "react-to-print";
import { BranchContext } from "../../../pages/Admin/Prices";
import Select from "react-select";
import useSWR from "swr";

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

const fetcher = (url:string) => fetch(url).then((res) => res.json())
const UpdatePrice:FC<ModalProps> = (props) => {

    const { data, error } = useSWR(props.isOpen ? `/api/Prices/GetCategories?branch=${props.branch}` : null, fetcher, {
        onSuccess: (data) => {
        }
    })
    

    const customStyles = {
        control: (provided:any, state:any) => ({
         ...provided,   
         minHeight: "56px"
        }),

      }  
    
      const companyOptions = data?.map(function (row:any) {
        return { value: row.category, label: row.category };
      });
      

   const branch = useContext(BranchContext)  
    const toast = useToast()

    const updatePrice = async (values: {category: string, pricePerKg: string}, actions:any) => {

      const category = values.category
      const pricePerKg = values.pricePerKg
      const data = {
        category: category,
        pricePerKg: pricePerKg
      }


      const res = await fetch(`/api/Prices/UpdatePrice?branch=${props.branch}&category=${category}`, {
        method: 'post',
        body: JSON.stringify(data),
      }).then( (res) => {
  
        if(res.ok) {
            toast({
                title: 'Price Updated.',
                description: `Price Updated Successfully. `,
                status: 'success',
                duration: 10000,
                isClosable: true,
              }),
              actions.setSubmitting(false);
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
          }
        return error
      }

      function capitalizeName(name:string) {
        return name.replace(/\b(\w)/g, s => s.toUpperCase());
      }

      const initialValues = {
        category: "",
        pricePerKg: ""
      }
    
    return (
        <Modal size="lg" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Price</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Box p={2} bg="green.200">
            Changing Price For {props.branch}
          </Box> 
          <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => {
                values.category = capitalizeName(values.category);
                alert(JSON.stringify(values, null, 2))
                updatePrice(values, actions)
                // on callback 
                
        
      }}
    >
     
      {(props) => (
        <Form>
          <Field name='category'>
            {({ field, form }:any) => (
              <FormControl mb={2} isInvalid={form.errors.name && form.touched.name}>
                <FormLabel color={'gray.500'} htmlFor="category">Select Category</FormLabel>
                <Select
                  styles={customStyles}
                  instanceId="category-select"
                  placeholder="Select Category"
                  options={companyOptions}
                  onChange={(option:any) => props.setFieldValue('category', option.value)}
                 
                />
              </FormControl>
            )}
          </Field>


          <Field name='pricePerKg' validate={validateNumber}>
            {({ field, form }:any) => (
              <FormControl isInvalid={form.errors.pricePerKg && form.touched.pricePerKg}>
                 <FormLabel color={'gray.500'} htmlFor="pricePerKg">Price Per Kg</FormLabel>
                <Input type="number" {...field} placeholder='Price Per Kg' h="56px" maxLength="11" />
                <FormHelperText>Price Per Kg Required</FormHelperText>
                <FormErrorMessage>{form.errors.pricePerKg}</FormErrorMessage>
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
            <Center p={2} color={'blue.900'} bg={'blue.50'}>
                <HStack spacing="8px">
                    <Text>{props.branch}</Text>
                    <Text>•</Text>
                    <Text>Airport</Text>
                </HStack>
                    
            </Center>


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

export default UpdatePrice