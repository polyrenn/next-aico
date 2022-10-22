import Link from "next/link";
import Head from "../components/head";
import Nav from "../components/nav";
import WithSubnavigation from "../components/Navigation/FrontDesk";
import { Box, Checkbox, HStack, Select } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { GetServerSideProps } from "next";
import {
  Formik,
  Field,
  Form,
  FormikHelpers,
  FormikProps,
  FieldArray,
} from "formik";
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
} from "@chakra-ui/react";

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

import { prisma } from "../lib/prisma";
import CrbForm from "../components/Common/CrbForm";

export default (props: any) => {
  type FormValues = {
      friends: []
  };

  const kgs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12.5, 15, 20, 25, 50];
  const [priceKgs, setPriceKgs] = useState<number[]>([1,2,3])


  const [summary, setSummary] = useState(); // Type State Later

  const formRef = useRef<FormikProps<FormValues>>(null);

  console.log(formRef)

  const [currentBranch, setCurrentBranch] = useState({});

  console.log(currentBranch);

  const handleChange = (branch) => {
    setCurrentBranch(branch);
    console.log(branch.tank);
    setPriceKgs([3,5,6,7,8,9])
  };

  const createSummary = (values:any, actions:FormikHelpers<FormValues> ) => { // Type Values 
    const result = values.friends.filter((word:any) => word.kg == true);
    setSummary(result)
    console.log(summary)
  }


  const arrOfObjs = [
    {
      branch: "Airport",
      branchId: 141414,
      tankID: 242424,
      tanks: ["TankAirA", "TankAirB"],
    },
    {
      branch: "Ugbor",
      branchId: 363636,
      tankID: 646466,
      tanks: ["TankUgbA", "TankUgbB"],
    },

    {
      branch: "Aduwawa",
      branchId: 734244,
      tankID: 266524,
      tanks: ["TankWawaA", "TankWawaB"],
    },
  ];

  const initialValues = {
    friends: [
      
    ],
  };

  const saleValidation = Yup.object().shape({
    friends: Yup.array()
      .required('Must have friends')
      .min(1, 'Minimum of 3 friends'),
  });

  return (
    <div>
      <WithSubnavigation branch={props.branch}></WithSubnavigation>
      <Head title="Home" />
      <Nav />
      <Box mx={8} className="hero">
        <h1 className="title">
          Welcome to Create Next App (Create Next.js App building tools)
        </h1>
        <p className="description">
          To get started, edit <code>pages/index.js</code> and save to reload.
        </p>
        <div className="row">
          <Link href="//nextjs.org/docs/">
            <a className="card">
              <h3>Getting Started &rarr;</h3>
              <p>Learn more about Next.js on official website</p>
            </a>
          </Link>
          <Link href="//github.com/create-next-app/create-next-app">
            <a className="card">
              <h3>Create Next App&rarr;</h3>
              <p>Was this tools helpful?</p>
            </a>
          </Link>
        </div>
      </Box>

      <Text>{currentBranch.branch}</Text>

      <Box>
        {arrOfObjs.map((item, counter) => (
          <Button
            variant="outline"
            onClick={() => handleChange(item)}
            mx={4}
            key={counter}
          >
            {item.branch}
          </Button>
        ))}
      </Box>

      <Box>
        <Select
          placeholder="Tank"
          width="300px"
          onChange={(e) => console.log(e.target.value)}
        >
          {currentBranch?.tanks?.map((item, counter) => (
            <option value={item}>{item}</option>
          ))}
        </Select>
      </Box>

{
  /*
    <Box>
        {[1, 2, 3].map((item) => (
          <CrbForm kg={item}></CrbForm>
        ))}
      </Box>
  */
}
      

      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        validationSchema={saleValidation}
        onSubmit={(values, actions) => {
         // alert(JSON.stringify(values, null, 2));
      
         createSummary(values, actions)
        }}
      >
        {(props: FormikProps<any>) => (
          <Form>
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
                    {priceKgs.map((item, counter) => (
                    <Tr key={counter}>
                      <Td>
                      <Field name={`friends.${counter}.kg`}>
        {({ field, form }:any) => (
              <FormControl mb={2}>
               <Checkbox size="lg" isChecked={props.values.friends[counter]?.kg} {...field}>{item}</Checkbox>
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
                            isInvalid={form.errors.name && form.touched.name}
                          >
                            <Input
                              type="number"
                              onKeyUp={(e) => {
                                props.setFieldValue(`friends.${counter}.kg`, true);
                                props.setFieldValue(`friends.${counter}.total`, 600 * field.value);
                                !field.value
                                  ? props.setFieldValue(`friends.${counter}.kg`, false)
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
                        {item * props.values.friends[counter]?.name }
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
            <Button colorScheme="purple" type="submit">
              Check
            </Button>
          </Form>
        )}
      </Formik>

      <style jsx>{`
        .hero {
          width: 100%;
          color: #333;
        }
        .title {
          margin: 0;
          width: 100%;
          padding-top: 80px;
          padding-bottom: 12px;
          line-height: 1.15;
          font-size: 37px;
        }
        .title,
        .description {
          text-align: center;
        }
        .row {
          max-width: 587px;
          margin: 80px auto 40px;
          display: flex;
          flex-direction: row;
          justify-content: space-around;
        }
        .card {
          padding: 18px 18px 24px;
          width: 220px;
          text-align: left;
          text-decoration: none;
          color: #434343;
          border: 1px solid #9b9b9b;
        }
        .card:hover {
          border-color: #067df7;
        }
        .card h3 {
          margin: 0;
          color: #067df7;
          font-size: 18px;
        }
        .card p {
          margin: 0;
          padding: 12px 0 0;
          font-size: 13px;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export const getServerSideProps = async ({ params }) => {
  const post = await prisma.customer.findMany({
    select: {
      name: true,
      branchId: true,
    },
  });

  const branch = await prisma.branch.findFirst({
    select: {
      address: true,
      branchId: true,
    },
  });

  const prices = await prisma.prices.findFirst({
    where: {
      branchId: 131313,
    },
  });

  return {
    props: { post, branch, prices },
  };
};
