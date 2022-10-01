import Link from "next/link";
import Head from "../../components/head";
import Nav from "../../components/nav";
import WithSubnavigation from "../../components/Navigation/FrontDesk";
//Layout Imports
import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  Stack,
  VStack,
  Center,
  Heading,
  Select as ChakraSelect,
} from "@chakra-ui/react";
// Element Imports
import { Text, Button, Spinner } from "@chakra-ui/react";
import { Radio, RadioGroup } from "@chakra-ui/react";
// Components
import StatBlock from "../../components/FrontDesk/StatBlock";
import PriceLabel from "../../components/FrontDesk/PriceLabel";
import CategoryRadios from "../../components/FrontDesk/ChangeCategory";
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
import SaleForm from "../../components/FrontDesk/Crb/SaleForm";

//React Imports
import { useState, useContext, createContext } from "react";

//Utilities
import { useRadioGroup, useColorModeValue } from "@chakra-ui/react";
import { prisma } from "../../lib/prisma";
import { GetServerSideProps } from "next";
import CashPointForm from "../../components/FrontDesk/CashPoint/CashPointForm";
import useSWR from "swr";
import Select from "react-select";
import { withSessionSsr } from "../../lib/withSession";


import summary from "../../data/data";
import AdminNav from "../../components/Navigation/Admin";

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

  branchAggregations: {
    company: {
      name: string;
  };
  branchId: number;
  name: string | null;
  _count: {
      declined: number;
      queue: number;
      sales: number;
  };
  }[]

  user: {
    id: number,
    admin: boolean
  };
}
export default (props: PageProps<[]>) => {
  const options = props.branches.map(function (row) {
    return { value: row.address.toLowerCase(), label: row.address };
  });

  const companyOptions = props.companies.map(function (row) {
    return { value: row.companyId, label: row.name };
  });

  const companyCount = props.companies.length;
  console.log(props.user)
  return (
    <Flex height="100vh" width="100vw">
      <Head title="Admin - Stock"></Head>
      <Box height="100%" className="navigation">
        <AdminNav company={props.company}></AdminNav>
      </Box>

      <Box overflowY="auto" w="100%" className="main-content">
        <WithSubnavigation branch={props.branch}></WithSubnavigation>
        <Box p={6} className="company-block">
          <Flex justify="space-between">
            <HStack>
              <Heading size="sm">Company</Heading>
              <Center
                rounded="sm"
                w="24px"
                h="24px"
                bg="green.200"
                color="green.500"
              >
                {companyCount}
              </Center>
              <Button leftIcon={<AddIcon/>}>New</Button>
            </HStack>

            <HStack>
              <Box width={48}>
                <Select
                  instanceId="branch-select"
                  placeholder="Select Branch"
                  options={companyOptions}
                />
              </Box>
              <Button colorScheme="green">Add Branch</Button>
            </HStack>
          </Flex>
        {/*
          <Box>
            {props.companies.map((item) =>
              <Box>
                 <Select
                  instanceId={item.id}
                  placeholder="Select Branch"
                  options={options}
                />
                <Heading size="sm">{item.name}</Heading>
                {item.branches.map((branch) =>
                  <Text>{branch.address}</Text>
                )}
               </Box> 
            )}
          </Box>

                */}


<Flex justify="space-between">
            <HStack>
              <Heading size="sm">Staff</Heading>
              <Center
                rounded="sm"
                w="24px"
                h="24px"
                bg="green.200"
                color="green.500"
              >
                {companyCount}
              </Center>
              <Button leftIcon={<AddIcon/>}>New</Button>
            </HStack>

            <HStack>
              <Box width={48}>
                <Select
                  instanceId="branch-select"
                  placeholder="Select Branch"
                  options={companyOptions}
                />
              </Box>
              <Button colorScheme="green">Add Staff</Button>
            </HStack>
          </Flex>     

        </Box>

        <Flex flexFlow="row wrap" className="sales-summary">
          
        {props.branchAggregations.map((item:any) => 
            <Flex ml={2} mb={4} flexFlow="column" width="30%" className="item" borderWidth="1px" rounded="sm">

            <Stack p={4} borderBottomWidth="1px" width="full" justifyContent="space-between" direction="row" className="heading">
                <Stack spacing={0} direction="column">
                 <Heading size="sm">{item.company_name}</Heading>
                 <Text color="gray.500">{item.name}</Text>
                </Stack>

                <HStack>
                  <Text
                   fontSize={'sm'}
                   fontWeight={500}
                   bg="gray.100"
                   py={1}
                   px={2}
                   rounded={'sm'}
                  >Tank A</Text>
                </HStack>
               
            </Stack>

            <Stack my={4} mx={4} spacing={4} p={2} bgColor="gray.50" className="content">

                <HStack justifyContent="space-between">
                  <Text>Successful Sales</Text>
                  <Text>{item.sales_count}</Text>
                </HStack>

                <HStack justifyContent="space-between">
                  <Text>Kg Sold</Text>
                  <Text>{item.total_kg}</Text>
                </HStack>

                <HStack justifyContent="space-between">
                  <Text>Total Amount</Text>
                  <Text>{item.amount_sold}</Text>
                </HStack>

                <HStack justifyContent="space-between">
                  <Text>Delcined Sales</Text>
                  <Text>{item.declined_count}</Text>
                </HStack>

                <HStack justifyContent="space-between">
                  <Text>Crbs on queue</Text>
                  <Text>{item.queue_count}</Text>
                </HStack>


            </Stack>

          </Flex>     
        )}      
         

        </Flex>

     
    </Box>
    </Flex>
  );
};

// Auth Maybe

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    if (!user) {
      return {
        redirect: {
          destination: '/Login',
          permanent: false,
        },
      }
    }

    const branch = await prisma.branch.findFirst({
      where: {
        branchId: user?.branch
      },
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

     
const today = new Date().toISOString()
const formattedDate = today.split('T')[0]

const branchAggregations = await prisma.$queryRaw
`SELECT b.id,
b.name, 
(select cast(count(*) as integer) as sales_count from sales s where b.branch_id = s.branch_id
     and timestamp > ${formattedDate}::timestamp
),
(select cast(count(*) as integer) as queue_count from queue q where b.branch_id = q.branch_id
     and timestamp > ${formattedDate}::timestamp
),
(select cast(count(*) as integer) as declined_count from declined_sales d where b.branch_id = d.branch_id
     and timestamp > ${formattedDate}::timestamp
),
(select cast(sum(s.total_kg) as float) as total_kg from sales s where b.branch_id = s.branch_id
     and timestamp > ${formattedDate}::timestamp
),
(select cast(sum(s.amount) as float) as amount_sold from sales s where b.branch_id = s.branch_id
     and timestamp > ${formattedDate}::timestamp
),
companies.name as company_name
FROM branches b
Left JOIN companies
ON b.company_id = companies.company_id
ORDER BY b.id asc 
`; // Refactor to Swr
  
    const branches = await prisma.branch.findMany({
      select: {
        address: true,
        branchId: true,
      },
    });
  

    

    if (user.admin !== true) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        user: req.session.user,
        branch, company, companies, branches, branchAggregations
      },
    };
  },
 
);