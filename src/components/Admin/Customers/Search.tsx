import { FC, useState } from "react"
//Utility Imports
import { Checkbox, CheckboxGroup, useDisclosure, VStack, Avatar } from "@chakra-ui/react"
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

import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
    AutoCompleteCreatable,
    AutoCompleteGroup
} from "@choc-ui/chakra-autocomplete";

import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
  } from "@chakra-ui/react";

import { Customer } from "@prisma/client";

import useSWR from 'swr'




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

  const fetcher = (url:string) => fetch(url).then((res) => res.json())

  interface CustomerTable {
    uniqueId: string | undefined;
  }

  const CustomrTable:FC<CustomerTable> = (props) => {
    const { data, error } = useSWR(
        props.uniqueId ? `/api/Customer/GetSingleCustomer?uniqueid=${props.uniqueId}` : null,
        fetcher,
        {
          onSuccess: (data) => {},
        }
      );
      console.log(data)
      return (
        <TableContainer rounded={8} border="2px solid" borderColor="gray.500">
          <Table variant="striped">
            <TableCaption>Customers</TableCaption>
            <Thead>
              <Tr>
                <Th>Customer Name</Th>
                <Th>Phone</Th>
                <Th>Enlisted At</Th>
                <Th>Total Kg</Th>
                <Th>Total Amount</Th>
                <Th>First Purchase</Th>
                <Th>Last Purchase</Th>
                <Th>Purchase Count</Th>
              </Tr>
            </Thead>
            <Tbody>
                  {data?.map((item:any) => 
                      <Tr key={item.phone}>
                      <Td>{item.name}</Td>
                      <Td>{item.phone}</Td>
                      <Td>{item.branch_id}</Td>
                      <Td>{item.total_kg}</Td>
                      <Td>{item.total_amount?.toLocaleString()} NGN</Td>
                      <Td>{item.first_purchase}</Td>
                      <Td>{item.last_purchase}</Td>
                      <Td>{item.purchase_count}</Td>
                  </Tr>
                  )}
                    
              </Tbody>
            <Tfoot>
            <Tr>
                <Th>Customer Name</Th>
                <Th>Phone</Th>
                <Th>Enlisted At</Th>
                <Th>Total Kg</Th>
                <Th>Total Amount</Th>
                <Th>First Purchase</Th>
                <Th>Last Purchase</Th>
                <Th>Purchase Count</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      );
}

const Search:FC<ModalProps> = (props) => {

 

    //const [ customer, setCustomer ] = useState()
    const [ customer, setCustomer ] = useState<Customer | null>(null)

    const [returned, setReturned] = useState<Customer[]>([]);
    const { data, error } = useSWR( props.branch ? `/api/Customer/GetCustomers?branch=${props.branch}` : null,
    fetcher, {
    });

    const transformedCustomer = data?.map((customer:Customer) => ({
      names: `${customer.name} ${customer.phone} ${customer.uniqueId}` , 
      ...customer
  
    }))
  

    const customerComplete = transformedCustomer?.map((person:any, oid:number) => (
        <AutoCompleteItem
          key={`option-${oid}`}
          value={person}
          textTransform="capitalize"
          align="center"
        >
          <Avatar size="sm" name={person.name}/>
          <Text ml="4">{person.name} , {person.uniqueId}, {person.phone}</Text>
        </AutoCompleteItem>
    ))
    



      const handleChange = (counter:number, item:number, actions:FormikProps<any>) => {
        actions.setFieldValue(`kgs.${counter}.size`, item)
      }
    
    return (
        <Modal size="2xl" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Customer Search</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={2}>
            <AutoComplete
                openOnFocus
                onChange={(e, value:any) => {
                    setCustomer(value.originalValue)
                    console.log(customer)
                }}
                
               >
                <AutoCompleteInput autoComplete="off" width="full" h="56px" variant="outline" />
                    <AutoCompleteList>
                      <AutoCompleteGroup showDivider>
                        {customerComplete}
                      </AutoCompleteGroup>

                      <AutoCompleteCreatable>
                        {({ value }) => <Text>Add {value} to List</Text>}
                      </AutoCompleteCreatable>
                       
                    </AutoCompleteList>
                      
                </AutoComplete>
            </FormControl>

          <CustomrTable uniqueId={customer?.uniqueId}></CustomrTable>

            <Center mt={2} p={2} color={'blue.900'} bg={'blue.50'}>
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

export default Search