import Link from "next/link";
import Head from "../../components/head";
import Nav from "../../components/nav";
import WithSubnavigation from "../../components/Navigation/FrontDesk";
//Layout Imports
import {
  Box,
  VStack,
  Stack,
  Flex,
  Grid,
  GridItem,
  HStack,
  Center,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { Tab, Tabs, TabList, TabPanel, TabPanels } from "@chakra-ui/react";
// Element Imports
import { Text, Button, Spinner, Avatar } from "@chakra-ui/react";
import { Radio, RadioGroup } from "@chakra-ui/react";
// Components
import { useToast } from "@chakra-ui/react";

// Icons
import { PhoneIcon, AddIcon, WarningIcon } from "@chakra-ui/icons";
import SaleForm from "../../components/FrontDesk/Crb/SaleForm";

//React Imports
import { useState, useContext, createContext, FC } from "react";

//Utilities
import { useRadioGroup, useColorModeValue } from "@chakra-ui/react";
import { prisma } from "../../lib/prisma";
import { GetServerSideProps } from "next";
import useSWR from "swr";
import { useDisclosure } from "@chakra-ui/react";
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
    AutoCompleteCreatable,
    AutoCompleteGroup
} from "@choc-ui/chakra-autocomplete";

import AdminNav from "../../components/Navigation/Admin";
import CategoryRadios from "../../components/FrontDesk/ChangeCategory";
import CompanyComponent from "../../components/Admin/Customers/CompanyComponent";
import StockTable from "../../components/Admin/Stock/StockTable";
import { withSessionSsr } from "../../lib/withSession";

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

  companies: T[];

  customers: []
}

export default (props: PageProps<[]>) => {

    //Navigation Helpers
    const [collapsed, setCollapsed] = useState<boolean>(true);
    const [toggled, setToggled] = useState<boolean>(false);
  
    const handleCollapsedChange = (checked:boolean) => {
      setCollapsed(checked);
    };
  
    const handleToggleSidebar = (value:boolean) => {
      setToggled(value);
    };
  
    const handleToggleClose = (value:boolean) => {
      setToggled(value);
    };

  console.log(props.companies);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ stockBranch, setStockBranch ] = useState<number>()
  const [tank, setTank] = useState<string | null>(null);
  const logInfo = (info: string) => {
    console.log(info);
    //setTank(info)
    return info;
  };

  

  const handleBranchChange = (branchId:number) => {
    setStockBranch(branchId)
  }


  return (
    <Flex height="100vh" width="100vw">
      <Head title="Admin - Staff"></Head>
      <Box height="100%" className="navigation">
        <AdminNav toggled={toggled}  handleToggleClose={handleToggleClose} company={props.company}></AdminNav>
      </Box>

      <Box overflowY="auto" w="100%" className="main-content">
        <WithSubnavigation handleCollapsedChange={handleCollapsedChange} handleToggleSidebar={handleToggleSidebar} branch={props.branch}></WithSubnavigation>
        <Box p={6} className="staffs">
        <Flex my={2} justify="space-between">
        <HStack>
              <Heading color="gray.800" size="sm">Staff</Heading>
              <Center
                rounded="sm"
                w="24px"
                h="24px"
                bg="green.200"
                color="green.500"
              >
               3
              </Center>
            </HStack>
                <Button onClick={() => console.log(stockBranch)} colorScheme="blue">Add Staff</Button>
            </Flex>
            <StockTable branch={stockBranch}></StockTable>
        </Box>
      </Box>
    </Flex>
  );
};

// Auth Maybe
export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {

    const user = req.session.user;
    if (user?.role !== 'Admin') {
      return {
        redirect: {
          destination: '/Login',
          permanent: false,
        },
      }
    }

    if (!user) {
      return {
        redirect: {
          destination: '/Login',
          permanent: false,
        },
      }
    }

  const branch = await prisma.branch.findFirst({
    select: {
      address: true,
      branchId: true,
    },
  });

  const branches = await prisma.branch.findMany({
    select: {
      name: true,  
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

  const customers = await prisma.customer.findMany({
    where: {
        branchId: 131313
    },
    select: {
        name: true,
        phone: true
    }
  });

  return {
    props: { branch, company, branches, companies, customers },
  };
});
