import { FC, useState } from "react"
//Utility Imports
import { useDisclosure, VStack } from "@chakra-ui/react"
import {  Formik, Field, Form, FormikHelpers } from "formik"
import * as Yup from 'yup';
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useRef } from "react";
import Select from 'react-select'
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
import DayStats from "../../Common/DayStats";



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

const fetcher = (url:any) => fetch(url).then((res) => res.json())
const UpdateStockModal:FC<ModalProps> = (props) => {

    interface FormValues {
        kg: string;
        value: string;
        date: string;
        tank: string;
        load: string;
    }

    const { data, error } = useSWR(props.isOpen ? `/api/Tanks/GetTanks?id=${props.branch}` : null, fetcher, {
        onSuccess: (data) => {
        }
    })
    
    const currentDate = new Date().toISOString()

    const customStyles = {
        control: (provided:any, state:any) => ({
         ...provided,   
         minHeight: "56px"
        }),

      }  
    
      const companyOptions = data?.map(function (row:any) {
        return { value: row.tankId, label: row.designation };
      });
      

    let barcodeRef = useRef<null | HTMLDivElement>(null);
    const [name, setName] = useState<string>('')
    const [phone, setPhone] = useState<string>('')

    const branch = props.branch
    const toast = useToast()

    const newStock = async (values:FormValues, actions:any) => {

      const kg = values.kg
      const value = values.value
      const date = new Date(values.date)
      const loadNumber = values.load
      const tankId = values.tank
      const data = {
        kg: kg,
        value: value,
        date: date,
        loadNumber: loadNumber
      }



      const res = await fetch(`/api/Stock/NewStock?tankId=${tankId}&branch=${props.branch}`, {
        method: 'post',
        body: JSON.stringify(data),
      }).then( (res) => {
  
        if(res.ok) {
            toast({
                title: 'Stock Added.',
                description: `New Stock Added Successfully. `,
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
          error = 'Required'
        } else if (/[a-zA-Z]/.test(value)) {
            error = "Invalid Number"
          }
        return error
      }

      function capitalizeName(name:string) {
        return name.replace(/\b(\w)/g, s => s.toUpperCase());
      }

      const initialValues = {
        kg: "",
        value: "",
        date: "",
        tank: "",
        load: ""
      }
    
    return (
        <Modal size="lg" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Stock</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <DayStats branch={props.branch} date={currentDate.split('T')[0]}></DayStats>  
          <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => {
              //  alert(JSON.stringify(values, null, 2))
                newStock(values, actions)
                // on callback 
                
        
      }}
    >
      {(props) => (
        <Form>
          <Field name='kg' validate={validateNumber}>
            {({ field, form }:any) => (
              <FormControl mb={2} isInvalid={form.errors.kg && form.touched.kg}>
                 <FormLabel color={'gray.500'} htmlFor="kg">Stock Kg</FormLabel>
                <Input type="number" {...field} placeholder='20000' h="56px"  />
                <FormHelperText>Stock Kg in Tons</FormHelperText>
                <FormErrorMessage>{form.errors.kg}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field name='value' validate={validateNumber}>
            {({ field, form }:any) => (
              <FormControl mb={2} isInvalid={form.errors.value && form.touched.value}>
                 <FormLabel color={'gray.500'} htmlFor="value">Value</FormLabel>
                <Input type="number" {...field} placeholder='Amount' h="56px" />
                <FormHelperText>Value in NGN</FormHelperText>
                <FormErrorMessage>{form.errors.value}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field name='date'>
            {({ field, form }:any) => (
              <FormControl isInvalid={form.errors.kg && form.touched.kg}>
                 <FormLabel color={'gray.500'} htmlFor="date">Date</FormLabel>
                <Input type="date" {...field}  h="56px" />
                <FormErrorMessage>{form.errors.kg}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field name='load'>
            {({ field, form }:any) => (
              <FormControl isInvalid={form.errors.load && form.touched.load}>
                 <FormLabel color={'gray.500'} htmlFor="load">Load Number</FormLabel>
                <Input type="number" {...field}  h="56px" />
                <FormErrorMessage>{form.errors.load}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field name='tank'>
            {({ field, form }:any) => (
              <FormControl mb={2} isInvalid={form.errors.tank && form.touched.tank}>
                <FormLabel color={'gray.500'} htmlFor="tank">Select Tank</FormLabel>
                <Select
                  styles={customStyles}
                  instanceId="tank-select"
                  placeholder="Select tank"
                  options={companyOptions}
                  onChange={(option:any) => props.setFieldValue('tank', option.value)}
                 
                />
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

export default UpdateStockModal