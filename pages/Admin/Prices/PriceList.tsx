import Link from "next/link";
import Head from "../../../components/head";
import Nav from "../../../components/nav";
import WithSubnavigation from "../../../components/Navigation/FrontDesk";
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

//React Imports
import { useState, useContext, createContext, FC } from "react";

//Utilities
import { useRadioGroup, useColorModeValue } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import useSWR from "swr";
import { prisma } from "../../../lib/prisma";
import { useDisclosure } from "@chakra-ui/react";

import AdminNav from "../../../components/Navigation/Admin";
import CategoryRadios from "../../../components/FrontDesk/ChangeCategory";
import PriceList from "../../../components/Admin/Prices/PriceList";
import BranchRadios from "../../../components/Admin/ChangeBranch";

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

interface Tank {
    amount: number;
    branchId: number;
    designation: string;
    id: number;
    tankId: string;
}

const CompanyComponent: FC<any> = (props) => {
    const toast = useToast();
    // const [branch, setBranch] = useState<{ tanks: {}[]; address: string }>();
    const [branch, setBranch] = useState<number>();
    const handleIncrement = (currBranch: any) => {
      setBranch(currBranch);
      console.log(currBranch);
    };
  
    let current
  
  
    const handleChange = (value: any) => {
      toast({
        title: `The value got changed to ${value}!`,
        status: "success",
        duration: 2000,
      });
  
      let branchId = branches.find(
        (element) => element.name === value
      )?.branchId;
      const tanks = branches.find((element) => element.name === value)?.tanks;
      current = branches.find((element) => element.name === value)?.currentTank;
      setBranch(branchId)
      props.handleBranchChange(branchId);
      console.log(current)
  
    };
  
    const handleSelect = (params: any) => {
      setBranch(params);
      console.log(branch);
    };
  
    const { value, getRootProps, getRadioProps } = useRadioGroup({
      name: "framework",
      onChange: handleChange,
    });
  
    const group = getRootProps();
    const branches: { name: string, address: string; branchId: number; tanks: Tank[], currentTank: string }[] =
      props.company.branches;
    const options: string[] = branches.map((a) => a.name);
    console.log(branches);
  
    return (
      <Box mb={8}>
        <Heading key={props.company.id} size="sm">
          {props.comapany?.name}
        </Heading>
        <Text color="gray.500">Select Branch {branch}</Text>
        <HStack my={2}>
          {options.map((value, index) => {
            const radio = getRadioProps({ value });
            return (
              <BranchRadios key={value} {...radio}>
                {value}
              </BranchRadios>
            );
          })}
        </HStack>
        <Box mt={2} className="branch-blocks">
          <HStack>
            {props.company.branches.map((branch: any) => (
              <Box key={branch.id}></Box>
            ))}
          </HStack>
        </Box>
      </Box>
    );
  };

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
      <Head title="Admin - Price List"></Head>
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

        <Box p={6} className="price-list">
            <Flex my={2} justify="space-between">
                <Text fontSize="medium" color="gray.500">AicoGas - {stockBranch}</Text>
                <Button onClick={() => console.log(stockBranch)} colorScheme="blue">Add Stock</Button>
            </Flex>
            <PriceList branch={stockBranch}></PriceList>
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
