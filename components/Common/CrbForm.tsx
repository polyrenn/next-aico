import { FC } from "react"
import {  Formik, Field, Form, FormikHelpers, FormikProps } from "formik"
import {
  Text,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  FormHelperText,
  Input,
  Checkbox,
  HStack,
  Box
} from '@chakra-ui/react'

interface CrbProps  {
    kg: number
}

const CrbForm:FC<CrbProps> = (props) => {

    const initialValues = {
        kg: false,
        name: ""
    }

    const kilogram = props.kg

    const validateName = (value:string) => {
        let error
        if (!value) {
          error = 'Name is required'
        } 
        return error
      }
    

    return(
        <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => {
              //alert(JSON.stringify(values, null, 2))
              /*
                values.name = capitalizeName(values.name);
             
                createCustomer(values, actions)
                // on callback 
                */
        
      }}
    >
      {(props: FormikProps<any>) => (
        <Form>
          <HStack alignItems="center" w="min-content">
          <Field name="kg">
        {({ field, form }:any) => (
              <FormControl mb={2}>
               <Checkbox size="lg" isChecked={props.values.kg} {...field}>1</Checkbox>
              </FormControl>
            )}
        </Field>
        

          <Field name='name' validate={validateName}>
            {({ field, form, onChange }:any) => (
              <FormControl mb={2} isInvalid={form.errors.name && form.touched.name}>
                <Input type="number" onKeyUp={(e) => {
                    props.setFieldValue("kg", true)
                    !field.value ?  props.setFieldValue("kg", false) : console.log("Populated");
                    
                }
                } 
                 w="min-content" {...field} placeholder='Customer Name' h="56px" textTransform="capitalize" />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}



          </Field>

          <Box className="price-per-kg" p={4} bg="gray.50">
            {600 * kilogram}
        </Box>
        
        <Box p={4} bg="gray.50">
            {props.values.name * 600}
        </Box>

        <Box>
        <Box className="total-kg" p={4} bg="gray.50">
            {props.values.name * kilogram}
        </Box>
        
            </Box>        
       

          </HStack>
       <Text>{props.values.kg ? 'Checked': 'Unchecked'}</Text>
       <Button type="submit" colorScheme="purple">
                Check
       </Button>

        </Form>
      )}
    </Formik>
    )
}

export default CrbForm