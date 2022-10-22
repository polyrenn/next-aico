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

const EditBranch:FC<ModalProps> = (props) => {

    const { data, error } = useSWR('/api/Common/GetBranches', fetcher, {
        onSuccess: (data) => {
        }
    })
    
      const companyOptions = data?.map(function (row:any) {
        return { value: row.branchId, label: row.name };
      });
      
      const customStyles = {
        input: () => ({
         padding: 8
        })
      }  

    const [name, setName] = useState<string>('')
    const [phone, setPhone] = useState<string>('')

    const toast = useToast()

    const editBranch = async (values: {name: string, address: string, branch: string}, actions:any) => {

      const name = values.name
      const branch = values.branch
      const address = values.address
      const data = {
        name: name,
        address: address
      }


      const res = await fetch(`/api/Common/EditBranch?id=${branch}`, {
        method: 'post',
        body: JSON.stringify(data),
      }).then( (res) => {
  
        if(res.ok) {
            toast({
                title: 'Branch Edited.',
                description: `Branch Edited Successfully.`,
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
        branch: "",
        address: ""
      }
    
    return (
        <Modal size="lg" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Branch</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => {
                values.name = capitalizeName(values.name);
                //alert(JSON.stringify(values, null, 2))
                editBranch(values, actions)
                // on callback 
                
        
      }}
    >
      {(props: FormikProps<any>) => (
        <Form>

          <Field name='branch'>
            {({ field, form }:any) => (
              <FormControl mb={2} isInvalid={form.errors.name && form.touched.name}>
                <FormLabel color={'gray.500'} htmlFor="customer">Select Branch</FormLabel>
                <Select
                  
                  instanceId="branch-select"
                  placeholder="Select Branch"
                  options={companyOptions}
                  onChange={(option:any) => props.setFieldValue('branch', option.value)}
                 
                />
              </FormControl>
            )}
          </Field>

          <Field name='name'>
            {({ field, form }:any) => (
              <FormControl mb={2} isInvalid={form.errors.name && form.touched.name}>
                <FormLabel color={'gray.500'} htmlFor="customer">Branch Name</FormLabel>
                <Input {...field} placeholder='Branch Name' textTransform="capitalize" />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field name='address'>
            {({ field, form }:any) => (
              <FormControl mb={2} isInvalid={form.errors.name && form.touched.name}>
                <FormLabel color={'gray.500'} htmlFor="address">Address</FormLabel>
                <Input {...field} placeholder='Branch Address' textTransform="capitalize" />
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
           Edit
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

export default EditBranch