import { FC, useState } from "react"
//Utility Imports
import { useDisclosure, VStack } from "@chakra-ui/react"
import {  Formik, Field, Form, FormikHelpers } from "formik"
import * as Yup from 'yup';
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useRef } from "react";
import ReactToPrint from "react-to-print";

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


const CreateCompany:FC<ModalProps> = (props) => {

    const [name, setName] = useState<string>('')
    const [phone, setPhone] = useState<string>('')

    const toast = useToast()

    const createCompany = async (values: {name: string, phone: string}, actions:any) => {

      const name = values.name
      const phone = values.phone
      const data = {
        name: name,
        companyId: Math.floor(100000 + Math.random() * 900000)
      }


      const res = await fetch('/api/Common/CreateCompany', {
        method: 'post',
        body: JSON.stringify(data),
      }).then( (res) => {
  
        if(res.ok) {
            toast({
                title: 'Company Added.',
                description: `New Company Added Successfully.`,
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
        name: "",
        phone: ""
      }
    
    return (
        <Modal size="lg" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Company</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => {
                values.name = capitalizeName(values.name);
                alert(JSON.stringify(values, null, 2))
               createCompany(values, actions)
                // on callback 
                
        
      }}
    >
      {(props) => (
        <Form>
          <Field name='name' validate={validateName}>
            {({ field, form }:any) => (
              <FormControl mb={2} isInvalid={form.errors.name && form.touched.name}>
                <FormLabel color={'gray.500'} htmlFor="customer">Company Name</FormLabel>
                <Input {...field} placeholder='AicoGas' h="56px" textTransform="capitalize" />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
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
            Create
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

export default CreateCompany