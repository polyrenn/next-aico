import Link from "next/link";
import Head from "../components/head";
import Nav from "../components/nav";
import WithSubnavigation from "../components/Navigation/FrontDesk";
//Layout Imports
import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  Center,
  Heading,
  Select as ChakraSelect,
  VStack,
} from "@chakra-ui/react";
import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    FormHelperText,
    Input,
} from '@chakra-ui/react'

// Element Imports
import { Text, Button, Spinner } from "@chakra-ui/react";
import { Radio, RadioGroup } from "@chakra-ui/react";
// Components

import { useToast } from "@chakra-ui/react";
// Tag Component
import {
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  TagCloseButton,
} from "@chakra-ui/react";

// Icons
import { PhoneIcon, AddIcon, WarningIcon } from "@chakra-ui/icons";


//React Imports
import { useState, useContext, createContext } from "react";

//Utilities
import { useRadioGroup, useColorModeValue } from "@chakra-ui/react";
import { prisma } from "../lib/prisma";
import { GetServerSideProps } from "next";
import useSWR from "swr";
import Select from "react-select";
import Router from "next/router";
import {  Formik, Field, Form, FormikHelpers, FormikProps } from "formik"


import AdminNav from "../components/Navigation/Admin";

export const BranchContext = createContext<
  { address: string; branchId: number }[]
>([]);

interface PageProps<T> {
  branch: {
    address: string;
    branchId: number;
  };

  branches: {
    address: string;
    branchId: number;
  }[];

  company: {
    name: string;
    companyId: number;
  };

  companies: {
    name: string
    companyId: number
    branches: {}[]
  }[];
}
export default (props: PageProps<[]>) => {

    const toast = useToast()

    const [onLogin, setOnLogin] = useState<boolean>(false)

    const loginUser = async (values: {name: string, password: string}, actions:any) => {
        const name = values.name
        const data = {
          
        }
  
  
        const res = await fetch(`/api/Common/Login?username=${name}`, {
          method: 'post',
          body: JSON.stringify(data),
        }).then( (res) => {
    
          if(res.ok) {
            Router.push('/FrontDesk/Crb')
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

    const LoginToast = () => {
        return (
            toast({
                position: 'bottom-right',
                render: () => (
                  <HStack borderWidth='1px' mb={5} p={3}>
                    <Spinner/>
                    <Text>Hello World</Text>
                  </HStack>
                ),
              })
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
        name: '',
        password: '',
    }

    const currentYear = new Date().getFullYear()
  
  return (
    <Flex height="100vh" width="100vw">
      <Head title="Admin - Login"></Head>
      <Box height="100%" className="navigation">
      
      </Box>
     
      <Box overflowY="auto" w="100%" h="100%" className="main-content">
        <WithSubnavigation branch={props.branch}></WithSubnavigation>
        <Center h="100%">
            <Flex alignItems="space-between" flexFlow="column" px={4} py={10} w="448px" borderWidth='1px' borderRadius='lg'>
                <VStack mb={8} spacing={0}>
                <Heading color="blue.700" size="md">Welcome Back</Heading>
                <Text color="gray.500">Enter your credientials to access your account</Text>
                </VStack>

                <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => {
                //values.name = capitalizeName(values.name);
                alert(JSON.stringify(values, null, 2))
                loginUser(values, actions)
                // on callback
                setTimeout(() => {
                    actions.setSubmitting(false)
                },2000)
              
                
        
      }}
    >
      {(props: FormikProps<any>) => (
        <Form>
          <Field name='name' validate={validateName}>
            {({ field, form }:any) => (
              <FormControl mb={2} isInvalid={form.errors.name && form.touched.name}>
                <FormLabel color={'gray.500'} htmlFor="customer">Username</FormLabel>
                <Input errorBorderColor='red.300' variant="flushed" {...field} placeholder='Customer Name' h="56px" />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field name='password' validate={validateName}>
            {({ field, form }:any) => (
              <FormControl isInvalid={form.errors.phone && form.touched.phone}>
                 <FormLabel color={'gray.500'} htmlFor="customer">Password</FormLabel>
                <Input errorBorderColor='red.300' variant="flushed" {...field} placeholder='Customer Number' h="56px" />
                <FormHelperText>Phone number required for registration</FormHelperText>
                <FormErrorMessage>{form.errors.phone}</FormErrorMessage>
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
            Login
          </Button>
        </Form>
        
      )}
    </Formik>
              
            </Flex>
        </Center>

        <Box h="48px" borderTop="1px" borderColor="gray.200" className="footer">
            <VStack>
                <Text color="gray.500">	&copy; {currentYear}</Text>
            </VStack>
        </Box>
      </Box>
    </Flex>
  );
};

// Auth Maybe
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const branch = await prisma.branch.findFirst({
    select: {
      address: true,
      branchId: true,
    },
  });

  const company = await prisma.company.findFirst({
    select: {
      name: true,
      companyId: true,
    },
  });

  const companies = await prisma.company.findMany({
    include: {
      branches: {
        include: {
          tanks: true,
        },
      },
    },
  });

  const branches = await prisma.branch.findMany({
    select: {
      address: true,
      branchId: true,
    },
  });

  return {
    props: { branch, company, companies, branches },
  };
};
