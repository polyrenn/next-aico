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
import { withSessionSsr } from "../../../lib/withSession";
import AdminNav from "../../../components/Navigation/Admin";
import CategoryRadios from "../../../components/FrontDesk/ChangeCategory";
import PriceList from "../../../components/Admin/Prices/PriceList";
import BranchRadios from "../../../components/Admin/ChangeBranch";

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
  
      let branchName = branches.find(
        (element) => element.name === value
      )?.name;

      let branchId = branches.find(
        (element) => element.name === value
      )?.branchId;

      const tanks = branches.find((element) => element.name === value)?.tanks;
      current = branches.find((element) => element.name === value)?.currentTank;
      setBranch(branchId)
      props.handleBranchChange(branchName, branchId);
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
        <Flex alignContent="flex-start" flexFlow={{ base: 'row wrap',}} my={2}>
          {options.map((value, index) => {
            const radio = getRadioProps({ value });
            return (
              <BranchRadios key={value} {...radio}>
                {value}
              </BranchRadios>
            );
          })}
        </Flex>
        <Box mt={2} className="branch-blocks">
          <HStack>
            {props.company.branches.map((branch: any) => (
              <Box key={branch.id}></Box>
            ))}
          </HStack>
          <PriceList branch={branch}></PriceList>
        </Box>
      </Box>
    );
  };

export default (props: PageProps<[]>) => {

  //Navigation Helpers
  const [collapsed, setCollapsed] = useState<boolean>(false);
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
  const [ stockBranch, setStockBranch ] = useState<string>()
  const [ branchId, setBranchId ] = useState<number>()
  const [tank, setTank] = useState<string | null>(null);
  const logInfo = (info: string) => {
    console.log(info);
    //setTank(info)
    return info;
  };

  const handleBranchChange = (branchName: string, branchId: number) => {
    setStockBranch(branchName)
    setBranchId(branchId)
  }


  return (
    <Flex height="100vh" width="100vw">
      <Head title="Admin - Price List"></Head>
      <Box height="100%" className="navigation">
        <AdminNav  handleToggleClose={handleToggleClose} toggled={toggled} company={props.company}></AdminNav>
      </Box>

      <Box overflowY="auto" w="100%" className="main-content">
        <WithSubnavigation user={user} handleToggleSidebar={handleToggleSidebar}
        handleCollapsedChange={handleCollapsedChange}
         branch={props.branch}></WithSubnavigation>
        <Box p={6} className="branches">
          {props.companies.map((item: any) => (
            <Box key={item.id}>
              <Heading key={item.id} size="sm">
                {item.name}
              </Heading>
              <BranchContext.Provider value={branchId}>
                 <CompanyComponent priceBranch handleBranchChange={handleBranchChange} company={item}></CompanyComponent>
              </BranchContext.Provider>
             
            </Box>
          ))}
        </Box>

        <Box p={6} className="price-list">
            <Flex my={2} justify="space-between">
           { /* <Heading color="gray.500" size="lg">Price List for {stockBranch}</Heading> */ }
            </Flex>
           {/* <PriceList branch={branchId}></PriceList> */ }
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
      },
      orderBy: {
        id: 'asc'
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
      },
      orderBy: {
        id: 'asc'
      }
  
    });
  }

  return {
    props: { branch, company, branches, companies, user },
  };
});
