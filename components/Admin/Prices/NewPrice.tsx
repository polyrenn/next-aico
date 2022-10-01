import { FC, useState } from "react"
//Utility Imports
import { Checkbox, CheckboxGroup, useDisclosure, VStack } from "@chakra-ui/react"
import {  Formik, Field, Form, FormikHelpers, FieldArray, FormikProps } from "formik"
import * as Yup from 'yup';
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useRef, useContext } from "react";
import ReactToPrint from "react-to-print";
import { BranchContext } from "../../../pages/Admin/Prices";

//Layout Imports

import { Center, Box, Flex, HStack, Stack, Wrap, WrapItem } from "@chakra-ui/react"

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

  const priceValidation = Yup.object().shape({
    kgs: Yup.array()
      .required('Must set kgs')
      .min(1, 'Minimum of 1'),
  });


const CreatePrice:FC<ModalProps> = (props) => {

    let barcodeRef = useRef<null | HTMLDivElement>(null);
    const [name, setName] = useState<string>('')
    const [phone, setPhone] = useState<string>('')

    const availableKgs = [1, 3, 5, 6, 10, 12.5, 15, 25, 50]

   const branch = useContext(BranchContext)  
    const toast = useToast()

    const newCategory = async (values: {category: string, pricePerKg: string, kgs: number[]}, actions:any) => {

      const result = values.kgs.filter((word:any) => word?.kg == true);
      //Map Sizes
      const sizes = result.map((a:any) => a.size )
      const category = values.category
      const pricePerKg = values.pricePerKg
      const data: {availableKgs: number[], category:string, pricePerKg: string} = {
        category: category,
        pricePerKg: pricePerKg,
        availableKgs: sizes

      }

      const res = await fetch(`/api/Prices/NewCategory?branch=${props.branch}`, {
        method: 'post',
        body: JSON.stringify(data),
      }).then( (res) => {
  
        if(res.ok) {
            toast({
                title: 'Category Added.',
                description: `New Category Added Successfully. `,
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

      function validateCategory(value:string) {
        let error
        if (!value) {
          error = 'Category is required'
        } else if (/\d/.test(value)) {
            error = "Invalid Category Name"
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

      const initialValues: {kgs: any, category: string, pricePerKg: string} = {
        category: "",
        pricePerKg: "",
        kgs: []
      }

      const handleChange = (counter:number, item:number, actions:FormikProps<any>) => {
        actions.setFieldValue(`kgs.${counter}.size`, item)
      }
    
    return (
        <Modal size="lg" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Box p={2} bg="green.200">
            Changing Price For {props.branch}
          </Box> 
          <Formik
            validationSchema={priceValidation}
            initialValues={initialValues}
            onSubmit={(values, actions) => {
                values.category = capitalizeName(values.category);
                alert(JSON.stringify(values, null, 2))
                newCategory(values, actions)
                // on callback 
                
        
      }}
    >
     
      {(props) => (
        <Form>
          <Field name='category' validate={validateCategory}>
            {({ field, form }:any) => (
              <FormControl mb={2} isInvalid={form.errors.category && form.touched.category}>
                <FormLabel color={'gray.500'} htmlFor="customer">Category Name</FormLabel>
                <Input {...field} placeholder='Domestic' h="56px" textTransform="capitalize" />
                <FormErrorMessage>{form.errors.category}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field name='pricePerKg' validate={validateNumber}>
            {({ field, form }:any) => (
              <FormControl isInvalid={form.errors.pricePerKg && form.touched.pricePerKg}>
                 <FormLabel color={'gray.500'} htmlFor="customer">Price Per Kg</FormLabel>
                <Input type="number" {...field} placeholder='Starting Kg' h="56px" maxLength="11" />
                <FormHelperText>Price Per Kg Required</FormHelperText>
                <FormErrorMessage>{form.errors.pricePerKg}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Text mt={4} color="gray.500" fontSize="sm">Set available kgs.</Text>
          <Wrap spacing={[1, 2]} direction={['column', 'row']}>   
          <FieldArray name="kgs">
          {({ insert, remove, push }) => (
                 availableKgs.map((item, counter) => (
                  <WrapItem key={item}>
                  <Field name={`kgs.${counter}.kg`}>
                  {({ field, form, }: any) => (
                       <FormControl isInvalid={form.errors.kgs} onChange={(e) => handleChange(counter, item, {...props})} mb={2}>
                       <Checkbox isChecked={props.values.kgs[counter]?.kg} {...field}>{item} Kg</Checkbox>
                      </FormControl>
                  )}

                  </Field>
                  </WrapItem>
                 )
          ))}
          </FieldArray>    
          </Wrap> 
          
          <Field>
            {({ field, form }:any) => (
              <FormControl>
                 <Button onClick={() => {
                  availableKgs.map((item, counter) => {
                    props.setFieldValue(`kgs.${counter}.kg`, true);
                    props.setFieldValue(`kgs.${counter}.size`, item)
                  }
                  )
                
                  console.log(props.values.kgs[0]?.kg)
                 }} size="sm">Select all</Button>
              </FormControl>
            )}
          </Field>

          <Field>
            {({ field, form }:any) => (
              <FormControl isInvalid={form.errors.kgs}>
                 <FormErrorMessage>Add Kg</FormErrorMessage>
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

export default CreatePrice