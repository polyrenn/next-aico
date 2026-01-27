import Link from "next/link";
import Head from "../../components/head";
import Nav from "../../components/nav";
import WithSubnavigation from "../../components/Navigation/FrontDesk";
//Layout Imports
import { Box, VStack, Stack, Flex, Grid, GridItem, HStack, Center, Heading, Divider } from "@chakra-ui/react";
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
import { prisma } from "../../lib/prisma";
import { GetServerSideProps } from "next";
import useSWR from "swr";
import { useDisclosure } from "@chakra-ui/react";
import { withSessionSsr } from "../../lib/withSession";


import AdminNav from "../../components/Navigation/Admin";
import CompanyComponent from "../../components/Admin/Tanks/CompanyComponent";
import BranchRadios from "../../components/Admin/ChangeBranch";


export const BranchContext = createContext<{ address: string, branchId: number }[]>([]);

interface PageProps<T> {
    branch: {
        address: string,
        branchId: number,
        name: string
    }

    branches: {
        address: string,
        branchId: number
    }[]

    company: {
        name: string,
        companyId: number
    }

    user: {
      id: number,
      admin: boolean,
      role: string
    };

    companies: T[]
}

const SwitchButton:FC<any> = (props) => {
  const [ isLoading, setisLoading ] = useState<boolean>(false)
  return (
     null
  )
}

const BranchComponent:FC<any> = (props) => {

    const [branch, setBranch] = useState<number>(0)

    const handleIncrement = (currBranch:any) => {
        setBranch(currBranch)
        console.log(currBranch)
    }

    return (
        <Box>
            <Button onClick={props.select}>{props.address}</Button>
        </Box>

)
        
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

  const toast = useToast()
    
  console.log(props.companies)
  const [ branchId, setBranchId ] = useState<number>()  
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [tank, setTank] = useState<string | null>(null);
  const logInfo = (info:string) => {
    console.log(info)
    //setTank(info)
    return info
  }

  const handleBranchChange = (branchId:number) => {
    setBranchId(branchId)
  }

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
    setBranchId(branchId)
    console.log(current)

  };

  const { value, getRootProps, getRadioProps } = useRadioGroup({
    name: "framework",
    onChange: handleChange,
  });

  const group = getRootProps();
  const branches: { name: string, address: string; branchId: number; tanks: Tank[], currentTank: string }[] =
    props.branches; 
  const options: string[] = branches.map((a) => a.name);
  console.log(branches);


  return (
    <Flex height="100vh" width="100vw">
        <Head title="Admin - Tanks"></Head> 
        <Box height="100%" className="navigation">
            <AdminNav  toggled={toggled}  handleToggleClose={handleToggleClose} company={props.company}></AdminNav>
        </Box>
   
   
        <Box overflowY="auto" w="100%" className="main-content">
            <WithSubnavigation user={user} handleCollapsedChange={handleCollapsedChange} handleToggleSidebar={handleToggleSidebar} branch={props.branch}></WithSubnavigation>
            <Box p={6} className="branches">
                {props.companies.map((item:any) =>
                <Box key={item.id}>
                 <Heading key={item.id} size="sm">{item.name}</Heading>
             
                <CompanyComponent handleBranchChange={handleBranchChange} company={item}></CompanyComponent>
                </Box>
                )}  
            </Box>
            {/*
            <Box p={6} className="stocks">
            <Flex my={2} justify="space-between">
            <HStack {...group}>
      {options.map((value) => {
        const radio = getRadioProps({ value })
        return (
          <Box>
           <BranchRadios key={value} {...radio}>
            {value}
          </BranchRadios>
          </Box>
         
        )
      })}
    </HStack>

                <Text fontSize="medium" color="gray.500">AicoGas - {branchId}</Text>
                <Button onClick={() => console.log("stockBranch")} colorScheme="blue">Add Stock</Button>
            </Flex>
            
        </Box>
    */}  


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
    where: {
      companyId: user?.company
    },
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


