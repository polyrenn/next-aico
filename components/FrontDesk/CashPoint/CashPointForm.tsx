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
import { useState, useEffect, MutableRefObject } from "react";
import ReactToPrint from "react-to-print";
import { useRef } from "react";
import { FC } from "react";

//Custom Components
import CreateCustomer from "../Customer/CreateCustomer";
import SummaryCard from "../Crb/SummaryCard";
import ReceiptCard from "./Receipt";

interface CashFormProps {
  pricePerKg: number;
  post: any;
}

const CashPointForm: FC<any> = (props) => {

    const formikRef = useRef<FormikProps<any>>(null);
 


   const [payment, setPayment] = useState('Renn');
   const [narrative, setNarrative] = useState('')
   const [amount, setAmount] = useState<number | null>()

    let cashPointRef = useRef<null | HTMLDivElement>(null);

    function validateEmpty(value:string) {
        let error
        if (value == '') {
          error = 'Field required'
        } 
        return error
      }

      function validateAmount(value:number) {
        let error
        if (!value) {
          error = 'Amount is required'
        } 
        return error
      }    

  const initialValues = {
    payment: "",
    amount: "",
    narrative: ""
  };

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
          }}
        >
          {(props: FormikProps<any>) => (
            <Form>

            <Stack mb={4} spacing={1}>
              <Heading size="md" >Payment</Heading>
              <Text color={'grey.500'}>Enter payment information</Text>
            </Stack>


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
                

              
              <Field validate={validateAmount} name='amount'>
            {({ field, form, onChange }:any) => (
              <FormControl isInvalid={form.errors.amount && form.touched.amount}>
              <FormLabel color={'gray.500'} htmlFor="amount">Amount</FormLabel>
                <Input {...field} id="amount" h='56px' type="number" min="1" />
                <FormErrorMessage>{form.errors.amount}</FormErrorMessage>
            </FormControl>
            )}
          </Field> 

          
          <ReactToPrint
              onBeforePrint={() => 
                props.isValid ? alert("Is Valid"): alert("Invalid")
              }
              onPrintError={() => {props.isValid ? alert("Is Valid"): alert("Invalid")}}   
              trigger={() => <Button my={4} colorScheme="purple" type="submit" width="full">Print Receipt</Button>}
              content={() => cashPointRef}
          />
          <AutoSubmitToken></AutoSubmitToken>
            </Form>
          )}
        </Formik>
      </Box>

      <Divider orientation="vertical" />
      <ReceiptCard
      values={formikRef}
      narrative={narrative}
      payment={payment}
      amount={amount}
       ref={(el:any) => (cashPointRef = el)} summary={props.summary}></ReceiptCard>
    </Flex>
  );
};

export default CashPointForm;
