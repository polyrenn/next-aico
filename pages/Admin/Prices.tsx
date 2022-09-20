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
import { Text, Button, Spinner } from "@chakra-ui/react";
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
import { GetServerSideProps } from "next";
import useSWR from "swr";
import { prisma } from "../../lib/prisma";
import { useDisclosure } from "@chakra-ui/react";

import AdminNav from "../../components/Navigation/Admin";
import CategoryRadios from "../../components/FrontDesk/ChangeCategory";
import CompanyComponent from "../../components/Admin/Prices/CompanyComponent";
import StockTable from "../../components/Admin/Stock/StockTable";

export const BranchContext = createContext<number | undefined>(0);

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
}

export default (props: PageProps<[]>) => {
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
      <Head title="Admin - Prices"></Head>
      <Box height="100%" className="navigation">
        <AdminNav company={props.company}></AdminNav>
      </Box>

      <Box overflowY="auto" w="100%" className="main-content">
        <WithSubnavigation branch={props.branch}></WithSubnavigation>
        <Box p={6} className="branches">
          {props.companies.map((item: any) => (
            <Box key={item.id}>
              <Heading key={item.id} size="sm">
                {item.name}
              </Heading>
              <BranchContext.Provider value={stockBranch}>
                 <CompanyComponent priceBranch handleBranchChange={handleBranchChange} company={item}></CompanyComponent>
              </BranchContext.Provider>
             
            </Box>
          ))}
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

  return {
    props: { branch, company, branches, companies },
  };
};
