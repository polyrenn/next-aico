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
   const [amount, setAmount] = useState<number>(0)
   const customerProp = props.customer
   const currentChange = props.customer?.change

    let cashPointRef = useRef<null | HTMLDivElement>(null);

    const [ isDisabled, setIsDisabled ] = useState<boolean>(true)

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
        return error
      }    

  const initialValues = {
    payment: "",
    amount: "",
    narrative: "",
    change: false,
    usechange: false
  };

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

  const cashValidation = Yup.object().shape({
    payment: Yup.string()
    .required('Required'),

    amount: Yup.string()
    .required('Required'),

    narrative: Yup.string()
    .required('Required'),
  });


  const checkIsDisabled = (formik:FormikProps<any>): boolean | undefined => {
    if(formik.dirty && formik.isValid) {
      return false
    } else {
      return true
    }
  }

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
              <Text>{customerProp?.change} NGN</Text>
            </HStack>
          </Box> 
      );
  }
    
  

  const AutoSubmitToken = () => {
    // Grab values and submitForm from context
    const { values, submitForm } = useFormikContext() as any
    useEffect(() => {
     setPayment(values.payment);
     setNarrative(values.narrative)
     setAmount(values.amount)

     console.log(payment)
    }, [values, submitForm]);
    return null;
  };

  const handleSubmit = async (
    values: {payment: string, amount: string, narrative: string, change: boolean, usechange: boolean}, 
    actions:any) => {

    const [destructuredSum] = props.summary;

    const todayInDate = new Date().toISOString().split('T')[0]

    const data = {
      saleNumber: props.summary[0].crbNumber,
      amount: destructuredSum.amount,
      timestamp: new Date(),
      date: new Date(todayInDate),
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

   // alert(JSON.stringify(data, null, 2))
  
    
    const res = await
    fetch(`/api/FrontDesk/InsertSale?isreg${isRegistered}&change=${change}&ischange=${values.change}&usechange=${values.usechange}&tank=${branchDetails[0].current_tank}`, {
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

const delcineSale = async (actions:FormikProps<any>,
  values: {payment: string, amount: string, narrative: string, change: boolean, usechange: boolean}
  ) => {

  const [destructuredSum] = props.summary;

  const data = {
    saleNumber: props.summary[0].crbNumber,
    amount: destructuredSum.amount,
    timestamp: new Date(),
    category: destructuredSum.category,
    totalKg: destructuredSum.totalKg,
    description: destructuredSum.description,
    customerId: destructuredSum.customerId,
    branchId: destructuredSum.branchId,
    declineReason: values.narrative
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
  props.setReturned([]) 

}

const handleAfterPrint = () => {
  props.setReturned([]);
}

const [destructuredSum] = props.summary

  return (
    <Flex
      justify="center"
      px={6}
      py={6}
      borderWidth="1px"
      borderColor="gray.200"
      h="fit-content"
    >
      <Box bg="white" w="2xl" p={4} rounded="md">
        <Formik
          validationSchema={cashValidation}
          innerRef={formikRef}
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            //alert(JSON.stringify(values, null, 2));
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


          {/* Sale Description */}
          <Divider mt={4}></Divider>
          <Flex flexFlow="row wrap" my={4}>
            {destructuredSum?.description.map((item:any) => 
              <Flex py={2} pr={8} borderBottom="1px" borderBottomColor="gray.200" alignItems="flex-start" flexFlow="column" justifyContent="space-between">
                <Text fontWeight={600} color="cyan.600">Total Kg: {item.total} KG</Text>
                <Text fontWeight={600} color="cyan.600">Quantity: {item.quantity}</Text>
                  <Text fontWeight={600} color="cyan.600">Amount: {item.amount} NGN</Text>
              </Flex>  
            )}
          </Flex>
          <Center rounded={8} py={4} bg="green.500" color="white" className="purchase-amount">
                <Text fontSize={22} fontWeight={600}>Purchase Amount: {destructuredSum?.amount?.toLocaleString()}</Text>
            </Center>
          <Divider></Divider>

           {/* Sale Change */}   
          <Box mb={2} mt={4} p={2} borderWidth="1px">
            <HStack justifyContent="space-between">
              <Text>Sale Change</Text>
              <Text>{props.values.amount ? props.values.amount - destructuredSum?.amount: 0}</Text>
            </HStack>
          </Box>

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
          

              <Field name="payment">
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
                      variant="filled"
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

              <Field name="narrative">
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
                      variant="filled"
                      placeholder="Narrative"
                      _placeholder={{ opacity: 0.2, color: 'gray.500' }}
                    >
                      <option>Successful</option>
                      <option>Declined - Cyliner Error</option>
                      <option>Declined - Atm Declined</option>
                      <option>Declined - Uncorresponding Cylinder</option>
                    </Select>
                    <FormErrorMessage>{form.errors.narrative}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
                

              {/* validate={() => validateAmount(props.values.amount, destructuredSum?.amount)} */}
              <Field name='amount'>
            {({ field, form, onChange }:any) => (
              <FormControl isInvalid={form.errors.amount && form.touched.amount}>
              <FormLabel color={'gray.500'} htmlFor="amount">Amount Paid</FormLabel>
                <Input rounded={6} borderColor="green.500" variant="outline" {...field} id="amount" h='56px' type="number" min="1" />
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

          
          <ReactToPrint
              onAfterPrint={() => handleAfterPrint()}
              trigger={() => <Button isLoading={props.isSubmitting} isDisabled={checkIsDisabled({...props})} my={4} colorScheme="purple" type="submit" width="full">Print Receipt</Button>}
              content={() => cashPointRef}
          />
          <Button w="full" color="white" onClick={() => delcineSale({...props}, props.values)} bg="red.500">Decline Sale</Button>
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
