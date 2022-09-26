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
    Form,
    Field,
    FieldProps,
  } from 'formik';
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
}

const fetcher = (url:string) => fetch(url).then((res) => res.json())




const SaleForm:FC<SaleFormProps> = (props) => {

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



 
   
  return (
 
    <Flex justify="space-between" px={6} py={6} borderWidth='1px'  borderColor='gray.200' h="100vh">
      <Box bg="white" w="500px" p={4} rounded="md">
    <Formik
      innerRef={valuesRef}
      initialValues={{selectkg: '', quantity: '', customer: '', cart: 0}}
      validationSchema={SaleSchema}
     
     
      onSubmit={async (values, actions)  => {
        alert(JSON.stringify(values, null, 2));
        console.log(valuesRef.current.values.quantity * 2)
        actions.setSubmitting(true)
        await handleSubmit(values, actions)
        actions.resetForm();
        actions.setFieldValue("customer", "")
        setCustomer("")
        setSummary([])
      }}
    >
      {(props: FormikProps<any>) => (
        <Form>


        <HStack>
          <Field name='selectkg'>
            {({ field, form }:any) => (
              <FormControl>
              <FormLabel color={'gray.500'} htmlFor="category">Select Kg</FormLabel>
              <Select
                {...field}
                id="selectkg"
                name="selectkg"
                h="56px"
                placeholder="Select Kg"
          >
          {listItems}
          </Select>
            </FormControl>
            )}
          </Field>


          <Field name='quantity'>
            {({ field, form, onChange }:any) => (
              <FormControl>
              <FormLabel color={'gray.500'} htmlFor="quantity">Quantity</FormLabel>
                <Input {...field} id="quantity" h='56px' type="number" min="1" />
            </FormControl>
            )}
          </Field> 

          <VStack>

            <FormControl>
              <FormErrorMessage fontSize="lg">Inproper</FormErrorMessage>
            </FormControl>
          </VStack>
          
          </HStack>
          
          <Field>
            {({ field, form }:any) => (
              <FormControl isInvalid={form.errors.selectkg}>
                 <FormErrorMessage fontSize="lg">Select Kg to continue</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field>
            {({ field, form }:any) => (
              <FormControl isInvalid={form.errors.quantity}>
                 <FormErrorMessage fontSize="lg">Invalid Quantity</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field>
            {({ field, form }:any) => (
              <FormControl isInvalid={form.errors.cart}>
                 <FormErrorMessage fontSize="lg">{form.errors.cart}</FormErrorMessage>
              </FormControl>
            )}
          </Field>            

          <Field>
          {({ field, form }:any) => (
                <Button isDisabled={!form.touched.customer ? true : false}
                 onClick={handleSummary}
                 mt={4}
                 colorScheme="purple"
                 width="full">
                 Add
                </Button>
            )}
          </Field>

           <Button color="gray.100" mb={4} mt={2}  width="full"  onClick={handleCancel} bg="gray.700">
                  Cancel
                </Button>    
         
  
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

          <Divider my={4} orientation="horizontal"></Divider>

          <ReactToPrint
              trigger={() =>  <Button isDisabled={!props.isValid} isLoading={props.isSubmitting} colorScheme="purple" type="submit" width="full">Complete</Button>}
              content={() => componentRef}
              onAfterPrint={() => {alert("Hey")}}
          />
         
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


  

