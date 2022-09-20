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
}
export default (props: PageProps<[]>) => {
  const options = props.branches.map(function (row) {
    return { value: row.address.toLowerCase(), label: row.address };
  });

  const companyOptions = props.companies.map(function (row) {
    return { value: row.companyId, label: row.name };
  });

  const companyCount = props.companies.length;

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
      </Box>
    </Flex>
  );
};

// Auth Maybe
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const branch = await prisma.branch.findFirst({
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

  const branches = await prisma.branch.findMany({
    select: {
      address: true,
      branchId: true,
    },
  });

  return {
    props: { branch, company, companies, branches },
  };
};
