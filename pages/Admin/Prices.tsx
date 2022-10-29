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
import { withSessionSsr } from "../../lib/withSession";

import AdminNav from "../../components/Navigation/Admin";
import CategoryRadios from "../../components/FrontDesk/ChangeCategory";
import CompanyComponent from "../../components/Admin/Prices/CompanyComponent";
import StockTable from "../../components/Admin/Stock/StockTable";

export const BranchContext = createContext<number | undefined>(0);

interface PageProps<T> {
  branch: {
    address: string;
    branchId: number;
    name: string
  };

  branches: {
    address: string;
    branchId: number;
  }[];

  company: {
    name: string;
    companyId: number;
  };

  user: {
    id: number,
    admin: boolean,
    role: string
  };

  companies: T[];
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

    const user = props.user

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
        <AdminNav toggled={toggled}  handleToggleClose={handleToggleClose} company={props.company}></AdminNav>
      </Box>

      <Box overflowY="auto" w="100%" className="main-content">
        <WithSubnavigation user={user} handleCollapsedChange={handleCollapsedChange} handleToggleSidebar={handleToggleSidebar} branch={props.branch}></WithSubnavigation>
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
export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {

    const user = req.session.user;
    if (user?.role !== 'Admin' && user?.role !== 'Supervisor') {
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
    where: {
      branchId: user?.branch
    },
    select: {
      address: true,
      branchId: true,
      name: true
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

  let companies

  if(user?.role == 'Admin') {
    companies = await prisma.company.findMany({
      include: {
          branches: {
              include: {
                  tanks: true
              }
          }
      }
  
    });
  } else {
    companies = await prisma.company.findMany({
      where: {
        companyId: user.company
      },
      include: {
          branches: {
              include: {
                  tanks: true
              }
          }
      }
  
    });
  }

  return {
    props: { branch, company, branches, companies, user },
  };
});
