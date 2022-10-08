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
import { withSessionSsr } from "../../lib/withSession";
import AdminNav from "../../components/Navigation/Admin";
import CategoryRadios from "../../components/FrontDesk/ChangeCategory";
import CompanyComponent from "../../components/Admin/Customers/CompanyComponent";
import StockTable from "../../components/Admin/Stock/StockTable";

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

  const customerComplete = props.customers.map((person, oid) => (
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

  const handleBranchChange = (branchId:number) => {
    setStockBranch(branchId)
  }


  return (
    <Flex height="100vh" width="100vw">
      <Head title="Admin - Stock"></Head>
      <Box height="100%" className="navigation">
        <AdminNav  handleToggleClose={handleToggleClose} toggled={toggled} company={props.company}></AdminNav>
      </Box>

      <Box overflowY="auto" w="100%" className="main-content">
        <WithSubnavigation handleCollapsedChange={handleCollapsedChange} handleToggleSidebar={handleToggleSidebar} branch={props.branch}></WithSubnavigation>
        <Box p={6} className="branches">
          {props.companies.map((item: any) => (
            <Box key={item.id}>
              <Heading key={item.id} size="sm">
                {item.name}
              </Heading>
              <CompanyComponent handleBranchChange={handleBranchChange} company={item}></CompanyComponent>
            </Box>
          ))}
        </Box>

        <Box p={6} className="customers">
            <Flex my={2} justify="space-between">
                <Text fontSize="medium" color="gray.500">AicoGas - {stockBranch}</Text>
                <Box>
                <AutoComplete
                creatable
                openOnFocus
                onChange={(e, value:any) => {
                
                }}
                
               >
                <AutoCompleteInput w="256px" autoComplete="off" variant="outline" />
                    <AutoCompleteList>
                      <AutoCompleteGroup showDivider>
                        {customerComplete}
                      </AutoCompleteGroup>

                      <AutoCompleteCreatable>
                        {({ value }) => <Text>Add {value} to List</Text>}
                      </AutoCompleteCreatable>
                       
                    </AutoCompleteList>
                      
                </AutoComplete>
                </Box>
               
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
