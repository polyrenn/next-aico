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
} from "@chakra-ui/react";

//Icon Imports
import { PhoneIcon, AddIcon, WarningIcon } from "@chakra-ui/icons";

//Utility Imports
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  AutoCompleteCreatable,
  AutoCompleteGroup,
} from "@choc-ui/chakra-autocomplete";

import {
  useFormik,
  Formik,
  FormikHelpers,
  FormikProps,
  useFormikContext,
  Form,
  Field,
  FieldProps,
} from "formik";
import * as Yup from "yup";
import useSWR from "swr";

import { useDisclosure } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useState, useEffect, MutableRefObject, useContext } from "react";
import ReactToPrint from "react-to-print";
import { useRef } from "react";
import { FC } from "react";

//Context
import { BranchContext } from "../../../pages/FrontDesk/CashPoint";

//Custom Components
import CreateCustomer from "../Customer/CreateCustomer";
import SummaryCard from "../Crb/SummaryCard";
import ReceiptCard from "./Receipt";

interface CashFormProps {
  pricePerKg: number;
  post: any;
}

const CashPointForm: FC<any> = (props) => {

  const { data: branchDetails }  = useContext(BranchContext)  as any
  console.log(branchDetails)
  const toast = useToast();
    const formikRef = useRef<FormikProps<any>>(null);

 

   const isRegistered = props.isRegistered
   console.log(isRegistered)
   const [payment, setPayment] = useState('Renn');
   const [narrative, setNarrative] = useState('')
   const [amount, setAmount] = useState<number | null>()
   const customerProp = props.customer
   const currentChange = props.customer?.change

    let cashPointRef = useRef<null | HTMLDivElement>(null);

    function validateEmpty(value:string) {
        let error
        if (value == '') {
          error = 'Field required'
        } 
        return error
      }

      function validateAmount(value:number, amount:any) {
        let error
        if (!value) {
          error = 'Amount is required'
        } 
        if(value < amount ) {
          error = 'Cannot Be Less Than Sales Amount'
        }
        return error
      }    

  const initialValues = {
    payment: "",
    amount: "",
    narrative: "",
    change: false,
    usechange: false
  };

  const CustomerDetails = () => {
      if(!props.isRegistered) return null
      return(
        <Box mt={4} p={2} rounded="sm" borderWidth="1px">
            <HStack justifyContent="space-between">
              <Text>Customer</Text>
              <Text>Details</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text>Change</Text>
              <Text>{customerProp?.change}</Text>
            </HStack>
          </Box> 
      );
  }
    
  

  const AutoSubmitToken = () => {
    // Grab values and submitForm from context
    const { values, submitForm } = useFormikContext();
    useEffect(() => {
     setPayment(values.payment);
     setNarrative(values.narrative)
     console.log(payment)
    }, [values, submitForm]);
    return null;
  };

  const handleSubmit = async (
    values: {payment: string, amount: string, narrative: string, change: boolean, usechange: boolean}, 
    actions:any) => {

    const [destructuredSum] = props.summary;

    const data = {
      saleNumber: props.summary[0].crbNumber,
      amount: destructuredSum.amount,
      timestamp: new Date(),
      category: destructuredSum.category,
      totalKg: destructuredSum.totalKg,
      description: destructuredSum.description,
      branch: destructuredSum.branchId,
      customerId: destructuredSum.customerId,
      paymentMethod: values.payment,
      narrative: values.narrative,
      change: parseInt(values.amount) - destructuredSum.amount,
      currentTank: branchDetails[0].desig,
      opening: branchDetails[0].balance_stock,
      balance: branchDetails[0].balance_stock - destructuredSum.totalKg,
      closing: branchDetails[0].balance_stock - destructuredSum.totalKg,
    }
  
    const datetime = data.timestamp

    // Check For Sale Change

    const change = parseInt(values.amount)  - destructuredSum?.amount

    alert(JSON.stringify(data, null, 2))
  
    
    const res = await
    fetch(`/api/FrontDesk/InsertSale?change=${change}&ischange=${values.change}&usechange=${values.usechange}&tank=${branchDetails[0].current_tank}`, {
      method: 'post',
      body: JSON.stringify(data),
    }).then( (res) => {
  
      if(res.ok) {
          toast({
              title: 'Sale Successful.',
              description: `Sale Processed Successfully. At ${datetime} `,
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

    const resDelete = await fetch(`/api/FrontDesk/DeleteQueue?id=${props.currentSale}`, {
      method: 'post',
    }).then( (res) => {
  
      if(res.ok) {
          toast({
              title: 'Removed From Queue.',
              description: `Removed From Queue. At ${datetime} `,
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
  
  }

const delcineSale = async (actions:FormikProps<any>) => {

  const [destructuredSum] = props.summary;

  const data = {
    saleNumber: props.summary[0].crbNumber,
    amount: destructuredSum.amount,
    timestamp: new Date(),
    category: destructuredSum.category,
    totalKg: destructuredSum.totalKg,
    description: destructuredSum.description,
    customerId: destructuredSum.customerId,
    branch: destructuredSum.branchId
  }

    
  const res = await fetch(`/api/FrontDesk/DeclineSale`, {
    method: 'post',
    body: JSON.stringify(data),
  }).then( (res) => {

    if(res.ok) {
        toast({
            title: 'Sale Declined.',
            description: `Sale Declined. `,
            status: 'error',
            duration: 5000,
            isClosable: true,
          }),
          actions.setSubmitting(false);
    } else {
        toast({
            title: 'Error',
            description: "An Error Has Occured.",
            status: 'error',
            duration: 5000,
            isClosable: true,
          }),
          actions.setSubmitting(false);
    }
    
}
  )

  const resDelete = await fetch(`/api/FrontDesk/DeleteQueue?id=${props.currentSale}`, {
    method: 'post',
  }).then( (res) => {

    if(res.ok) {
        toast({
            title: 'Removed From Queue.',
            description: `Removed From Queue. `,
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

}

const [destructuredSum] = props.summary

  return (
    <Flex
      justify="space-between"
      px={6}
      py={6}
      borderWidth="1px"
      borderColor="gray.200"
      h="100vh"
    >
      <Box bg="white" w="500px" p={4} rounded="md">
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            alert(JSON.stringify(values, null, 2));
            handleSubmit(values, actions)
          }}
        >
          {(props: FormikProps<any>) => (
            <Form>

            <Stack mb={4} spacing={1}>
              <Heading size="md" >Payment</Heading>
              <Text color={'grey.500'}>Enter payment information</Text>
            </Stack>


             {/* Customer Details */}
             <CustomerDetails></CustomerDetails>
          

              <Field validate={validateEmpty} name="payment">
                {({ field, form }: any) => (
                  <FormControl
                    mb={2}
                    isInvalid={form.errors.payment && form.touched.payment}
                  >
                    <FormLabel color={"gray.500"} htmlFor="payment">
                      Payment Method
                    </FormLabel>
                    <Select
                      {...field}
                      id="payment"
                      name="payment"
                      h="56px"
                      placeholder="Select Payment Method"
                    >
                      <option value="cash">Cash</option>
                      <option value="pos">Pos</option>
                      <option value="transfer">Transfer</option>
                    </Select>
                    <FormErrorMessage>{form.errors.payment}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field validate={validateEmpty} name="narrative">
                {({ field, form }: any) => (
                  <FormControl
                    mb={2}
                    isInvalid={form.errors.narrative && form.touched.narrative}
                  >
                    <FormLabel color={"gray.500"} htmlFor="narrative">
                      Payment Narrative
                    </FormLabel>
                    <Select
                      {...field}
                      id="narrative"
                      name="narrative"
                      h="56px"
                      placeholder="Narrative"
                      _placeholder={{ opacity: 0.2, color: 'gray.500' }}
                    >
                      <option>Successful</option>
                      <option>Declined</option>
                    </Select>
                    <FormErrorMessage>{form.errors.narrative}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
                

              
              <Field validate={() => validateAmount(props.values.amount, destructuredSum?.amount)} name='amount'>
            {({ field, form, onChange }:any) => (
              <FormControl isInvalid={form.errors.amount && form.touched.amount}>
              <FormLabel color={'gray.500'} htmlFor="amount">Amount Paid</FormLabel>
                <Input {...field} id="amount" h='56px' type="number" min="1" />
                <FormErrorMessage>{form.errors.amount}</FormErrorMessage>
            </FormControl>
            )}
          </Field>

          <HStack mt={4}>    
          <Field name='change'>
            {({ field, form, onChange }:any) => (
              <FormControl>
              <Checkbox isDisabled={!isRegistered} isChecked={props.values.change} size="lg" {...field}>Keep Change</Checkbox>
            </FormControl>
            )}
          </Field>

          <Field name='usechange'>
            {({ field, form, onChange }:any) => (
              <FormControl>
              <Checkbox isDisabled={customerProp?.change < 0} isChecked={props.values.usechange} size="lg" {...field}>Use Change</Checkbox>
            </FormControl>
            )}
          </Field>
          </HStack>

          
          {/* Change, Use Set State for Amount Due */}
          <Box mt={4} p={2} bgColor="purple.200">
            <HStack justifyContent="space-between">
              {isRegistered ? <Box>
                <Text>New Amount Due</Text>
              <Text>{props.values.amount ? destructuredSum?.amount - customerProp?.change: 0}</Text>
              </Box> : 
                <Box>
                <Text>New Amount Due</Text>
              <Text>{props.values.amount ? destructuredSum?.amount : 0}</Text>
              </Box>
              }
            </HStack>
          </Box> 

          <Box mt={4} p={2} borderWidth="1px">
            <HStack justifyContent="space-between">
              <Text>Sale Change</Text>
              <Text>{props.values.amount ? props.values.amount - destructuredSum?.amount: 0}</Text>
            </HStack>
          </Box> 

          
          <ReactToPrint
              onBeforePrint={() => 
                props.isValid ? alert("Is Valid"): alert("Invalid")
              }
              onPrintError={() => {props.isValid ? alert("Is Valid"): alert("Invalid")}}   
              trigger={() => <Button my={4} colorScheme="purple" type="submit" width="full">Print Receipt</Button>}
              content={() => cashPointRef}
          />
          <Button w="full" color="white" onClick={() => delcineSale({...props})} bg="red.500">Decline Sale</Button>
          <AutoSubmitToken></AutoSubmitToken>
            </Form>
          )}
        </Formik>
      </Box>

      <Divider orientation="vertical" />
      <ReceiptCard
      customer={props.customer}
      values={formikRef}
      narrative={narrative}
      payment={payment}
      amount={amount}
       ref={(el:any) => (cashPointRef = el)} summary={props.summary}></ReceiptCard>
    </Flex>
  );
};

export default CashPointForm;
