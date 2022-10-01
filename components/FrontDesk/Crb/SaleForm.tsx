//Layout Imports
import {
  Box,
  Flex,
  HStack,
  VStack,
  Divider,
  Stack,
  Spacer,
  Center,
  Radio
} from "@chakra-ui/react";

//Element Imports
import {
    Avatar,
    Input,
    Select,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Button,
    FormHelperText, 
    Checkbox,
    CheckboxGroup,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Heading,
    Text,
} from '@chakra-ui/react'

//Icon Imports
import { PhoneIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'

//Utility Imports
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
    AutoCompleteCreatable,
    AutoCompleteGroup
} from "@choc-ui/chakra-autocomplete";

import {
    useFormik,
    Formik,
    FormikHelpers,
    FormikProps,
    FieldArray,
    Form,
    Field,
    FieldProps,
  } from 'formik';

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

import * as Yup from 'yup';
import useSWR from "swr";

import { useDisclosure } from "@chakra-ui/react";  
import { useToast } from '@chakra-ui/react';
import { useState, useEffect, MutableRefObject } from 'react';
import ReactToPrint from "react-to-print";
import { useRef, FC, useContext } from "react";
import { BranchContext } from "../../../pages/FrontDesk/Crb";
//Custom Components
import CreateCustomer from "../Customer/CreateCustomer";
import SummaryCard from "./SummaryCard";

interface SaleFormProps {
  pricePerKg: number | undefined
  post: any
  branch: any
  category: String | undefined
  availableKgs: number[] | undefined
}

const fetcher = (url:string) => fetch(url).then((res) => res.json())




const SaleForm:FC<SaleFormProps> = (props) => {

    const availableKgs = props.availableKgs

    const { branchId: branch } = useContext(BranchContext)  
    const [returned, setReturned] = useState([]);
    const { data, error } = useSWR('/api/Customer/GetCustomers', fetcher, {
      onSuccess: (data) => {
          setReturned(data)
      }
    });
  
    const returnData = () => {
      console.log(data)
    }

     const { data: crbData, error: crbError } = useSWR('/api/dummycrb', fetcher, {
       onSuccess: (data) => {

       }
     });
   

  //Should be async
  
   //Formik Ref
   const valuesRef:any = useRef();
  


  let componentRef = useRef<null | HTMLDivElement>(null);
  
 

  // Loop & Get Kilograms
  let kgs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12.5, 15, 20, 25, 50];
  const listItems = kgs.map((kg) =>
  <option key={kg.toString()} value={kg}>{kg} Kg</option>
  );
    const toast = useToast();
    const [cart, setCart] = useState([]);
    const [summary, setSummary] = useState<{kg: number, quantity: number, total: number, amount: number}[]>([])


    const handleSummary = () => {

      const { current: { values } } = valuesRef;

      let intKg = parseFloat(values.selectkg);
      let intamount = parseInt(values.quantity);
      let totalkg = intKg * intamount

      setSummary((summary) => [
        ...summary,
        {kg: values.selectkg, quantity: values.quantity, total: totalkg, amount: totalkg * props?.pricePerKg }
      ]);

      toast({
        title: 'Kg Added.',
        description: "New Kg Added.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      
    values.cart++
      
    }
    // On focus run customer fetch function
  const countries = [
    { name: "Dan Abramov", image: "https://bit.ly/dan-abramov" },
    { name: "Kent Dodds", image: "https://bit.ly/kent-c-dodds" },
    { name: "Segun Adebayo", image: "https://bit.ly/sage-adebayo" },
    { name: "Prosper Otemuyiwa", image: "https://bit.ly/prosper-baba" },
    { name: "Ryan Florence", image: "https://bit.ly/ryan-florence" },
  ];


const customerComplete = returned.map((person, oid) => (
    <AutoCompleteItem
      key={`option-${oid}`}
      value={person}
      textTransform="capitalize"
      align="center"
    >
      <Avatar size="sm" name={person.name}/>
      <Text ml="4">{person.name}</Text>
    </AutoCompleteItem>
))

const { isOpen, onOpen, onClose } = useDisclosure()
const [customer, setCustomer] = useState('')
const [customerId, setCustomerId] = useState('')
const [ customerType, setCustomerType ] = useState('')

console.log(customerId)
console.log(valuesRef)
console.log(componentRef)

const SaleSchema = Yup.object().shape({
  selectkg: Yup.string()
    .required('Required'),
  quantity: Yup.number()
    .min(1, 'Not Enough Quantity')
    .required('Required'),
  customer: Yup.string()
    .required('Required'),
  cart: Yup.number()
    .min(1, "Cart is empty, Add Kg to Cart")  


    
});

const handleCancel = () => {
  const { current: { values } } = valuesRef;
  values.cart = 0
  setSummary([])
}

// Compute Amount From Summary
const computeTotal = (arr:any) => {
  let res = 0;
  for(let i = 0; i < arr.length; i++){
     res += arr[i].total;
  };
  return res;
};

const handleSubmit = async (values: { customer: string }, actions:any) => {

  const totalKg = computeTotal(summary)
  const saleAmount = computeTotal(summary) * props.pricePerKg
  const category = props.category

  const today = new Date();
  today.setDate(today.getDate() + 1);

  const data = {
    branchId: branch,
    amount: saleAmount,
    category: category,
    description: summary,
    customerId: customerId,
    timestamp: new Date(),
    totalKg: totalKg
  }

  const dataCrb = {
    crbNumber: crbData ? crbData.crbNumber + 1 : 1,
    branchId: branch,
    amount: saleAmount,
    category: category,
    description: summary,
    customerId: customerId,
    timestamp: new Date(),
    totalKg: totalKg
  }

  const datetime = data.timestamp


  const resCrb = await fetch('/api/FrontDesk/InsertCrb', {
    method: 'post',
    body: JSON.stringify(dataCrb),
  }).then( (res) => {

    if(res.ok) {
        toast({
            title: 'Added to Crb.',
            description: `Sale Added to Crb Successfully. At ${datetime} `,
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

  const res = await fetch('/api/FrontDesk/InsertQueue', {
    method: 'post',
    body: JSON.stringify(dataCrb),
  }).then( (res) => {

    if(res.ok) {
        toast({
            title: 'Added to Queue.',
            description: `Sale Added to Queue Successfully. At ${datetime} `,
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
// NEW Formik Use Values & Helpers

const [priceKgs, setPriceKgs] = useState<number[]>([1,2,3])

const formRef = useRef<FormikProps<FormValues>>(null);

type FormValues = {
  friends: []
};

const initialValues = {
  friends: [
    
  ],
  other: [

  ],
};

const saleValidation = Yup.object().shape({
  friends: Yup.array()
    .required('Must have friends')
    .min(1, 'Minimum of 3 friends')   
});

const createSummary = (values:any, actions:any ) => { // Type Values Actions:FormikHelpers<FormValues>
  let result

  if(values.friends.length > 0) {
    result = values.friends.filter((word:any) => word?.isChecked == true);
  }
 
  if(values.other.length > 0) {
    result = values.other.filter((word:any) => word?.isChecked == true);
  }
  setSummary(result)
  console.log(summary)
  actions.setSubmitting(false)
}

const handleSaleCompletion = async (values:any, {...actions}:FormikProps<any>) => {
  const totalKg = computeTotal(summary)
  const saleAmount = computeTotal(summary) * props.pricePerKg
  const category = props.category

  const today = new Date();
  today.setDate(today.getDate() + 1);

  const data = {
    branchId: branch,
    amount: saleAmount,
    category: category,
    description: summary,
    customerId: customerId,
    timestamp: new Date(),
    totalKg: totalKg
  }

  const dataCrb = {
    crbNumber: crbData ? crbData.crbNumber + 1 : 1,
    branchId: branch,
    amount: saleAmount,
    category: category,
    description: summary,
    customerId: customerId,
    timestamp: new Date(),
    totalKg: totalKg
  }

  const datetime = data.timestamp


  const resCrb = await fetch('/api/FrontDesk/InsertCrb', {
    method: 'post',
    body: JSON.stringify(dataCrb),
  }).then( (res) => {

    if(res.ok) {
        toast({
            title: 'Added to Crb.',
            description: `Sale Added to Crb Successfully. At ${datetime} `,
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

  const res = await fetch('/api/FrontDesk/InsertQueue', {
    method: 'post',
    body: JSON.stringify(dataCrb),
  }).then( (res) => {

    if(res.ok) {
        toast({
            title: 'Added to Queue.',
            description: `Sale Added to Queue Successfully. At ${datetime} `,
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

  actions.resetForm()
  actions.setFieldValue("friends", [])
  setSummary([])
}

const pricePerKg = props.pricePerKg

 
   
  return (
 
    <Flex justify="space-between" px={6} py={6} borderWidth='1px'  borderColor='gray.200' h="fit-content">
      <Box bg="white" w="container.md" p={4} rounded="md">     
    <Formik
        innerRef={formRef}
        initialValues={initialValues}
        //validationSchema={saleValidation}
        onSubmit={(values, actions) => {
          alert(JSON.stringify(values, null, 2));
      
          createSummary(values, actions)
        }}
      >
        {(props: FormikProps<any>) => (
          <Form>

            
          <Field name="customer">
          {({
               field, // { name, value, onChange, onBlur }
               form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
               meta,
             }:any) => (
              <FormControl>
              <HStack align='flex-end'>
              <Box w='100%'>
              <FormLabel color={'gray.500'} htmlFor="renn">Customer</FormLabel>
              <AutoComplete
                creatable
                openOnFocus
                onChange={(e, value:any) => {
                props.setFieldValue("customer", value.value)
                setCustomer(value.value)
                setCustomerId(value.originalValue?.uniqueId /* == undefined ? value.value : value.originalValue?.uniqueId */)
                setCustomerType(value.originalValue?.customerType)
                console.log(value)
                returnData()
                }}
                
               >
                <AutoCompleteInput autoComplete="off" {...field} width="full" h="56px" variant="outline" />
                    <AutoCompleteList>
                      <AutoCompleteGroup showDivider>
                        {customerComplete}
                      </AutoCompleteGroup>

                      <AutoCompleteCreatable>
                        {({ value }) => <Text>Add {value} to List</Text>}
                      </AutoCompleteCreatable>
                       
                    </AutoCompleteList>
                      
                </AutoComplete>
                <FormHelperText>Customer Search. </FormHelperText>
                <Text
                rounded="sm"
                width="max-content"
                bg="cyan.50"
                color="cyan.900"
                px={2}
                py={2}
                mt={1}
                >{customerType}</Text>
                </Box>  
            
             
              </HStack>
              <Field>
            {({ field, form }:any) => (
              <FormControl isInvalid={form.errors.customer}>
                 <FormErrorMessage fontSize="lg">Customer Required</FormErrorMessage>
              </FormControl>
            )}
          </Field>  
            
             <Button onClick={onOpen} my={4} width="full" leftIcon={<AddIcon />} colorScheme='gray'>New Customer</Button>

            </FormControl>
             )}
          </Field>

            <FieldArray name="crb">
              {({ insert, remove, push }) => (
                <TableContainer borderWidth="1px" width="container.md">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th></Th>
                        <Th>Qty</Th>
                        <Th>Cyliner Price</Th>
                        <Th>Total Kg</Th>
                        <Th isNumeric>Amount</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                    {availableKgs?.map((item, counter) => (
                    <Tr key={counter}>
                      <Td>
                      <Field name={`friends.${counter}.kg`}>
        {({ field, form }:any) => (
              <FormControl mb={2}>
               <Checkbox size="lg" isChecked={props.values.friends[counter]?.isChecked} {...field}>{item}</Checkbox>
              </FormControl>
            )}
        </Field>
                      </Td>
                      <Td>
                      <Field name={`friends.${counter}.name`}>
                        {({ field, form, onChange }: any) => (
                          <FormControl
                            w="min-content"
                            mb={2}
                          >
                            <Input
                              type="number"
                              onKeyUp={(e) => {
                                props.setFieldValue(`friends.${counter}.isChecked`, true);
                                props.setFieldValue(`friends.${counter}.kg`, item);
                                props.setFieldValue(`friends.${counter}.quantity`, field.value);
                                props.setFieldValue(`friends.${counter}.total`, item * field.value);
                                props.setFieldValue(`friends.${counter}.amount`, field.value * item * pricePerKg );
                                !field.value
                                  ? props.setFieldValue(`friends.${counter}.isChecked`, false)
                                  : console.log("Populated");
                              }}
                              w="min-content"
                              {...field}
                              placeholder="Customer Name"
                              h="56px"
                              textTransform="capitalize"
                              min={1}
                            />
                            <FormErrorMessage>
                              {form.errors.name}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      </Td>
                      <Td>
                      <Box className="price-per-kg" p={4} bg="gray.50">
                        {760 * item}
                      </Box>
                      </Td>

                      <Td>
                      <Box className="total-kg" p={4} bg="gray.50">
                        {item * props.values?.friends[counter]?.name }
                      </Box>
                      </Td>

                      <Td>
                      <Box p={4} bg="gray.50">
                        {item * 760 * props.values.friends[counter]?.name }
                      </Box>
                      </Td>
                     
                     

                      
                    </Tr>
                  ))}
                    </Tbody>
                  </Table>
                 
                </TableContainer>
              )}
            </FieldArray>


            <Heading mb={2} mt={2} size="md">Other</Heading>  
            <FieldArray name="other">
            {({ insert, remove, push }) => (
                <TableContainer borderWidth="1px" width="container.md">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th></Th>
                        <Th>Qty</Th>
                        <Th>Cyliner Price</Th>
                        <Th>Total Kg</Th>
                        <Th isNumeric>Amount</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                    {[1]?.map((item, counter) => (
                    <Tr key={counter}>
                      <Td>
                      <Field name={`other.${counter}.kg`}>
        {({ field, form }:any) => (
              <FormControl mb={2}>
               <Checkbox size="lg" isChecked={props.values?.other[counter]?.isChecked} {...field}>{item}</Checkbox>
              </FormControl>
            )}
        </Field>
                      </Td>
                      <Td>
                      <Field name={`other.${counter}.name`}>
                        {({ field, form, onChange }: any) => (
                          <FormControl
                            w="min-content"
                            mb={2}
                          >
                            <Input
                              type="number"
                              onKeyUp={(e) => {
                                props.setFieldValue(`other.${counter}.isChecked`, true);
                                props.setFieldValue(`other.${counter}.kg`, item);
                                props.setFieldValue(`other.${counter}.quantity`, field.value);
                                props.setFieldValue(`other.${counter}.total`, item * field.value);
                                props.setFieldValue(`other.${counter}.amount`, field.value * item * pricePerKg );
                                !field.value
                                  ? props.setFieldValue(`other.${counter}.isChecked`, false)
                                  : console.log("Populated");
                              }}
                              w="min-content"
                              {...field}
                              placeholder="Customer Name"
                              h="56px"
                              textTransform="capitalize"
                              min={1}
                            />
                            <FormErrorMessage>
                              {form.errors.name}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      </Td>
                      <Td>
                      <Box className="price-per-kg" p={4} bg="gray.50">
                        {760 * item }
                      </Box>
                      </Td>

                      <Td>
                      <Box className="total-kg" p={4} bg="gray.50">
                        {item * props.values?.other[counter]?.name }
                      </Box>
                      </Td>

                      <Td>
                      <Box p={4} bg="gray.50">
                        {item * 760 * props.values.other[counter]?.name }
                      </Box>
                      </Td>
                     
                     

                      
                    </Tr>
                  ))}
                    </Tbody>
                  </Table>
                 
                </TableContainer>
              )}        
            </FieldArray>
            <Flex mt={4} justifyContent="space-between" className="action-buttons">
              <HStack>
              <Button type="submit">
              Check
            </Button>
            <Button color="gray.100" bg="gray.900" >
              Cancel
              </Button>          
              </HStack>

              <HStack>
                <Button isDisabled={summary.length == 0 ? true : false} isLoading={props.isSubmitting}
                 onClick={() => handleSaleCompletion(props.values, {...props})} colorScheme="purple">
                  Complete
                </Button>
                  
              </HStack>
               
            </Flex>
           
          </Form>
        )}
      </Formik>
        
      </Box>
      <Divider orientation='vertical' />
      
      
    <CreateCustomer branch={props.branch} isOpen={isOpen} onClose={onClose}></CreateCustomer>
    <SummaryCard pricePerKg={props.pricePerKg}
     customer={customer}
     summary={summary}
     cancelSummary={setSummary}
     ref={(el:any) => (componentRef = el)}></SummaryCard>
      
    </Flex>
  );
}

export default SaleForm


  

