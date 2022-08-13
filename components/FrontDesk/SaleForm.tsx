//Layout Imports
import {
  Box,
  Flex,
  HStack,
  VStack,
  Divider,
  Stack,
  Spacer,
  Center
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

import { useDisclosure } from "@chakra-ui/react";  
import { useToast } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import SummaryCard from "./SummaryCard";
import ReactToPrint from "react-to-print";
import { useRef } from "react";
import { FC } from "react";

//Custom Components
import CreateCustomer from "./Customer/CreateCustomer";

const SaleForm:FC = (props) => {
  let componentRef = useRef();
  // Loop & Get Kilograms
  let kgs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12.5, 15, 20, 25, 50];
  const listItems = kgs.map((kg) =>
  <option key={kg.toString()} value={kg}>{kg} Kg</option>
);

const countries = [
    { name: "Dan Abramov", image: "https://bit.ly/dan-abramov" },
    { name: "Kent Dodds", image: "https://bit.ly/kent-c-dodds" },
    { name: "Segun Adebayo", image: "https://bit.ly/sage-adebayo" },
    { name: "Prosper Otemuyiwa", image: "https://bit.ly/prosper-baba" },
    { name: "Ryan Florence", image: "https://bit.ly/ryan-florence" },
];

const customerComplete = countries.map((person, oid) => (
    <AutoCompleteItem
      key={`option-${oid}`}
      value={person.name}
      textTransform="capitalize"
      align="center"
    >
      <Avatar size="sm" name={person.name} src={person.image} />
      <Text ml="4">{person.name}</Text>
    </AutoCompleteItem>
))

const { isOpen, onOpen, onClose } = useDisclosure()
const [amount, setAmount] = useState({})
const handleChange = (amount:any) => setAmount(amount)

const valuesRef:any = useRef();


console.log(valuesRef)



 /*   
    //Print Ref
 


  // Price Per Kg
  // Compute Total Kg
  const computeTotal = arr => {
    let res = 0;
    for(let i = 0; i < arr.length; i++){
       res += arr[i].total;
    };
    return res;
 };

  //Category Prop
  let category = props.category;

  // Tank Prop 
  let tank = props.currenttank;

  // Should Reset 
  const [shouldReset, setShouldReset] = useState();
  

  // Post Sales 
  const updateSales = async () => {

    let totalkg = computeTotal(summary);

    let cash = formik.values.payment.cash
    let pos = formik.values.payment.pos
    let transfer = formik.values.payment.transfer


    const userObj = {
      customer: formik.values.customer,
      kg: [
        ...summary
      ],
      totalkg: totalkg,
      payment: formik.values.payment,
      totalvalue: formik.values.payment.cash + formik.values.payment.pos + formik.values.payment.transfer,
      category: category,
      date: new Date(),
      currenttank: tank

    }

    const res = await fetch('/api/postsales', {
      method: 'post',
      body: JSON.stringify(userObj),
    }).then( (res) => {

      if(res.ok) {
          toast({
              title: 'Sales Added.',
              description: "New Sales Added Successfully.",
              status: 'success',
              duration: 3000,
              isClosable: true,
            }),
            setSummary(summary = []),
            formik.values.cart = 0
            setShouldReset(shouldReset = true)
            console.log(shouldReset);
      } else {
          toast({
              title: 'Error',
              description: "An Error Has Occured.",
              status: 'error',
              duration: 10000,
              isClosable: true,
            }),
            setShouldReset(shouldReset = false);
      }
      
  }
    )
   
  }


  // Use Toast Component
  const toast = useToast();

// Cart
    interface SummaryType {
        kg: number
        amount: number
        total: number
    }
    const [cart, setCart] = useState([]);
    const [summary, setSummary] = useState<any | null>(null)

    const handleSummary = () => {
      let intKg = parseFloat(formik.values.selectkg);
      let intamount = parseInt(formik.values.amount);
      formik.values.cart++

      setSummary((summary:any) => [
        ...summary,
        {kg: formik.values.selectkg, amount: formik.values.amount, total: intKg * intamount }
    ]);

    toast({
      title: 'Kg Added.',
      description: "New Kg Added.",
      status: 'success',
      duration: 3000,
      isClosable: true,
    })

    console.log(summary);
    console.log(formik.values.cart)

    }

    const sidebar = (
        <Box w="300px">
          {summary.map((item:any) =>
            <Box key={item.kg} w='100%'>
              <Flex align="center" justify="space-between" rounded="sm" px={4} my={2} bg="#fafafa" h="48px">
              <Text>{item.amount}x</Text>
              <Text key={item.kg}>
              {item.kg} Kg
            </Text>
            
            </Flex>
            </Box>
            
          )}  
        </Box>
      );

    

  let priceperkg = props.sales

  //Refactor to State
  



  const formik = useFormik({
    initialValues: {
      customer: "",
      rememberMe: true,
      checkVal: priceperkg,
      selectkg: "",
      amount: "",
      payment: {
        cash: 0,
        pos: 0,
        transfer: 0,

      },
      cart: 0

      
      

    },
    validate: values => {
      let errors = {};
      if(values.cart < 1) {
       errors.cart = 'Add Kg To Cart To Continue'
      } 
     
      return errors;
     },
    onSubmit: (values, {resetForm}) => {
      
      setCart((cart) => [
        ...summary,
        {kg: formik.values.selectkg, amount: formik.values.amount}
    ]); 
      updateSales();
      alert(JSON.stringify(values, null, 2));
      // Price Per Kg Prop
      console.log(parseInt(formik.values.selectkg) * props.sales);
      let total = [
        {...formik.values},
        {...summary}
      ]
      alert(JSON.stringify(summary, null, 2));
      console.log(summary);
      console.log(total);
      if(shouldReset) {

        resetForm({
          values: ""})
      }
    
      
    }

  });

  //Might Remove
  function handleAdd(e) {
      summary.push(...summary, ...formik.values.selectkg);
      console.log(summary);
  }

   // Payment Methods
 

  
  const isCartError = formik.values.cart < 1

  */
   
  return (
 
    <Flex justify="space-between" px={6} py={6} borderWidth='1px'  borderColor='gray.200' h="100vh">
      <Box bg="white" w="500px" p={4} rounded="md">
      <Formik
            initialValues={{selectkg: '', quantity: '', customer: ''}}
            onSubmit={(values, actions) => {
                alert(JSON.stringify(values, null, 2))
                // on callback 
                actions.setSubmitting(false)
        
      }}
    >
      {({ handleChange, values, setFieldValue }) => (
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
              <FormErrorMessage fontSize="lg"></FormErrorMessage>
            </FormControl>
          </VStack>
        
          
          </HStack>     
          <Button type="submit" my={4} colorScheme="purple" width="full">
              Add
            </Button>

            <VStack spacing={4} align="flex-start">
            
            <Field name="customer">
            {({ field, form}:any) => (
                <FormControl>
                <HStack align='flex-end'>
                <Box w='100%'>
                <FormLabel color={'gray.500'} htmlFor="customer">Customer</FormLabel>
                <AutoComplete
                  onChange={(e, value) => {
                    console.log(value);
                    setFieldValue(
                      "customer",
                      value
                    );
                  }}
                 >
                  <AutoCompleteInput {...field} id="customer" h="56px" variant="outline" />
                      <AutoCompleteList>
                          {customerComplete}
                      </AutoCompleteList>
                  </AutoComplete>
                  <FormHelperText>Customer Search. {field.value}</FormHelperText>
                  </Box>  
              
               
                </HStack>  
              
               <Button onClick={onOpen} my={4} width="full" leftIcon={<AddIcon />} colorScheme='gray'>New Customer</Button>
  
              </FormControl>
            )}
            </Field>
            
  

            
            
            
            <Divider orientation='horizontal' />
           
            <Text color="{grey.500}">Print First</Text>

            <Button type="submit" colorScheme="purple" width="full">
              Post Sales
            </Button>
            
          </VStack>



        

        </Form>
      )}
    </Formik>

    <Formik
      innerRef={valuesRef}
      initialValues={{user: ''}}
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2));
      }}
    >
      {(props: FormikProps<any>) => (
        <Form>
          <Field name="user">
          {({
               field, // { name, value, onChange, onBlur }
               form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
               meta,
             }) => (
              <FormControl>
              <HStack align='flex-end'>
              <Box w='100%'>
              <FormLabel color={'gray.500'} htmlFor="renn">Customer</FormLabel>
              <AutoComplete
                openOnFocus
                onChange={(e, value:any) => {
                console.log(value.value)
                props.setFieldValue("user", value.value)
                setAmount({value})
                }}
                
               >
                <AutoCompleteInput {...field} width="full" h="56px" variant="outline" />
                    <AutoCompleteList>
                        {customerComplete}
                    </AutoCompleteList>
                </AutoComplete>
                <FormHelperText>Customer Search. </FormHelperText>
                </Box>  
            
             
              </HStack>  
            
             <Button onClick={onOpen} my={4} width="full" leftIcon={<AddIcon />} colorScheme='gray'>New Customer</Button>

            </FormControl>
             )}
          </Field>
          <Button type="submit" colorScheme="purple" width="full">
              Post Sales
            </Button>
        </Form>
      )}

    </Formik>
        
      </Box>
     
      <Divider orientation='vertical' />

      <Box p={4} bg="white" w="500px" rounded="md">
          <Stack spacing={1}>
              <Heading size="md" >Summary</Heading>
              <Text color={'grey.500'}>Sales Summary</Text>
            </Stack>
              <VStack w='100%'>
                <Flex>
                {}
                </Flex>
                
              </VStack>
              <Divider my={4} orientation='horizontal' />
              <VStack my={4}>
                <Text color={'grey.500'}>Total</Text>
                <Heading size="md">{}</Heading>
              </VStack>
              
  </Box> 
  <CreateCustomer isOpen={isOpen} onClose={onClose}></CreateCustomer>
      
    </Flex>
  );
}

export default SaleForm


  

