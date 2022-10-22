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
import Select from "react-select";
import useSWR from "swr";

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


type MyFnType = (user: string) => void;
interface ModalProps {
    isOpen: boolean
    onClose: any
    branch: any
    user: string
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


const EditStaff:FC<ModalProps> = (props) => {
      
    const branch = useContext(BranchContext)  
    const toast = useToast()

    const editStaff = async (values: { password: string, }, actions:any) => {

      const password = values.password

      const data: {password: string} = {
        password: password,
      }

      const res = await fetch(`/api/Staff/EditStaff?username=${props.user}`, {
        method: 'post',
        body: JSON.stringify(data),
      }).then( (res) => {
  
        if(res.ok) {
            toast({
                title: 'Update Successful.',
                description: `Update Successful. `,
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
          error = 'Required'
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

      const initialValues: { password: string, } = {
        password: "",
      }

    return (
        <Modal size="lg" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Staff</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => {
                //values.username = capitalizeName(values.username);
                //alert(JSON.stringify(values, null, 2))
                editStaff(values, actions)
                // on callback 
                
        
      }}
    >
     
      {(props) => (
        <Form>

          <Field name='password' validate={validateName}>
            {({ field, form }:any) => (
              <FormControl isInvalid={form.errors.password && form.touched.password}>
                 <FormLabel color={'gray.500'} htmlFor="password">Password</FormLabel>
                <Input type="password" {...field} placeholder=' New Password' h="56px" />
                <FormErrorMessage>{form.errors.password}</FormErrorMessage>
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

export default EditStaff