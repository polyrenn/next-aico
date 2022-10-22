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


const NewStaff:FC<ModalProps> = (props) => {

    const customStyles = {
        control: (provided:any, state:any) => ({
         ...provided,   
         minHeight: "56px"
        }),

    }
    
    const { data:companies, error:companyError } = useSWR('/api/Common/GetCompanies', fetcher, {
        onSuccess: (data) => {
        }
    })
    
      const companyOptions = companies?.map(function (row:any) {
        return { value: row.companyId, label: row.name };
      });

      const { data:branches, error:branchesError } = useSWR('/api/Common/GetBranches', fetcher, {
        onSuccess: (data) => {
        }
    })
    
      const branchOptions = branches?.map(function (row:any) {
        return { value: row.branchId, label: row.name };
      });

    const roles = [
        {value: "CashPoint Attendant", label: "CashPoint Attendant"},
        {value: "Crb Attendant", label: "Crb Attendant"},
        {value: "Admin", label: "Admin"},


        
    ]  
      
   const branch = useContext(BranchContext)  
    const toast = useToast()

    const newStaff = async (values: {company: number | undefined, branch: number | undefined, username: string, password: string, role: string}, actions:any) => {

      const username = values.username
      const password = values.password
      const role = values.role
      const company = values.company
      const branch = values.branch
      const data: {username: string, password: string, role: string} = {
        username: username,
        password: password,
        role: role

      }

      const res = await fetch(`/api/Staff/NewStaff?branch=${branch}&company=${company}`, {
        method: 'post',
        body: JSON.stringify(data),
      }).then( (res) => {
  
        if(res.ok) {
            toast({
                title: 'Staff Added.',
                description: `New Staff Added Successfully. `,
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

      const initialValues: {company: number | undefined, branch: number | undefined, username: string, password: string, role: string} = {
        username: "",
        password: "",
        company: undefined,
        branch: undefined,
        role: ""
      }

      const handleChange = (counter:number, item:number, actions:FormikProps<any>) => {
        actions.setFieldValue(`kgs.${counter}.size`, item)
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
                newStaff(values, actions)
                // on callback 
                
        
      }}
    >
     
      {(props) => (
        <Form>

          <Field name='company' validate={validateName}>
            {({ field, form }:any) => (
              <FormControl mb={2} isInvalid={form.errors.name && form.touched.name}>
                <FormLabel color={'gray.500'} htmlFor="customer">Select Company</FormLabel>
                <Select
                  styles={customStyles}
                  instanceId="company-select"
                  placeholder="Select Company"
                  options={companyOptions}
                  onChange={(option:any) => props.setFieldValue('company', option.value)}
                 
                />
                 <FormErrorMessage>{form.errors.company}</FormErrorMessage>
              </FormControl>
              
            )}
          </Field>


          <Field name='branch' validate={validateName}>
            {({ field, form }:any) => (
              <FormControl mb={2} isInvalid={form.errors.name && form.touched.name}>
                <FormLabel color={'gray.500'} htmlFor="customer">Select Branch</FormLabel>
                <Select
                  styles={customStyles}
                  instanceId="branch-select"
                  placeholder="Select Branch"
                  options={branchOptions}
                  onChange={(option:any) => props.setFieldValue('branch', option.value)}
                 
                />
                 <FormErrorMessage>{form.errors.branch}</FormErrorMessage>
              </FormControl>
              
            )}
          </Field>

          <Field name='role' validate={validateName}>
            {({ field, form }:any) => (
              <FormControl mb={2} isInvalid={form.errors.name && form.touched.name}>
                <FormLabel color={'gray.500'} htmlFor="customer">Select Role</FormLabel>
                <Select
                  styles={customStyles}
                  instanceId="role-select"
                  placeholder="CashPoint Attendant"
                  options={roles}
                  onChange={(option:any) => props.setFieldValue('role', option.value)}
                 
                />
                 <FormErrorMessage>{form.errors.branch}</FormErrorMessage>
              </FormControl>
              
            )}
          </Field>

          <Field name='username'>
            {({ field, form }:any) => (
              <FormControl mb={2} isInvalid={form.errors.username && form.touched.username}>
                <FormLabel color={'gray.500'} htmlFor="username">Username</FormLabel>
                <Input {...field} placeholder='Admin' h="56px" />
                <FormErrorMessage>{form.errors.category}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field name='password'>
            {({ field, form }:any) => (
              <FormControl isInvalid={form.errors.password && form.touched.password}>
                 <FormLabel color={'gray.500'} htmlFor="password">Password</FormLabel>
                <Input type="password" {...field} placeholder='Password' h="56px" />
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

export default NewStaff