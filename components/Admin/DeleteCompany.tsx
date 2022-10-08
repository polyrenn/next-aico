import { FC, useState } from "react"
//Utility Imports
import { useDisclosure, VStack } from "@chakra-ui/react"
import {  Formik, Field, Form, FormikHelpers, FormikProps } from "formik"
import * as Yup from 'yup';
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useRef } from "react";
import ReactToPrint from "react-to-print";
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

const DeleteCompany:FC<ModalProps> = (props) => {

    const { data, error } = useSWR('/api/Common/GetCompanies', fetcher, {
        onSuccess: (data) => {
        }
    })
    
      const companyOptions = data?.map(function (row:any) {
        return { value: row.companyId, label: row.name };
      });
      
      const customStyles = {
        input: () => ({
         padding: 8
        })
      }  

    const [name, setName] = useState<string>('')
    const [phone, setPhone] = useState<string>('')

    const toast = useToast()

    const deleteCompany = async (values: { company: string}, actions:any) => {

      const company = values.company

      const res = await fetch(`/api/Common/DeleteCompany?id=${company}`, {
        method: 'post',
      }).then( (res) => {
  
        if(res.ok) {
            toast({
                title: 'Company Deleted.',
                description: `Company Deleted Successfully.`,
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
        company: "",
      }
    
    return (
        <Modal size="lg" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Company</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => {
                alert(JSON.stringify(values, null, 2))
                deleteCompany(values, actions)
                // on callback 
                
        
      }}
    >
      {(props: FormikProps<any>) => (
        <Form>

          <Field name='company'>
            {({ field, form }:any) => (
              <FormControl mb={2} isInvalid={form.errors.name && form.touched.name}>
                <FormLabel color={'gray.500'} htmlFor="customer">Select Company</FormLabel>
                <Select
                  
                  instanceId="branch-select"
                  placeholder="Select Company"
                  options={companyOptions}
                  onChange={(option:any) => props.setFieldValue('company', option.value)}
                 
                />
              </FormControl>
            )}
          </Field>

          <Button
            my={4}
            colorScheme='red'
            isLoading={props.isSubmitting}
            type='submit'
            width="full"
          >
           Delete
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

export default DeleteCompany