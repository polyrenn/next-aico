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
  Input,
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
import CustomerTable from "../../components/Admin/Customers/CustomerTable";
import BranchRadios from "../../components/Admin/ChangeBranch";
import Search from "../../components/Admin/Customers/Search";

import { Customer } from "@prisma/client";

export const BranchContext = createContext<
  { address: string; branchId: number }[]
>([]);

interface PageProps<T> {
  branch: {
    address: string;
    branchId: number;
    name: string;
  };

  branches: {
    name: string;
    address: string;
    branchId: number;
    _count: {
      customers: number
    }
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

  customers: []
}

const CompanyComponent: FC<any> = (props) => {

  //Modal Helpers

  const { isOpen, onClose, onOpen } = useDisclosure()

  const toast = useToast()
 // const [branch, setBranch] = useState<{ tanks: {}[]; address: string }>();
 const [branch, setBranch] = useState<number>()
  const handleIncrement = (currBranch: any) => {
    setBranch(currBranch);
    console.log(currBranch);
  };

 
 
  const handleChange = (value:any) => {
      toast({
        title: `The value got changed to ${value}!`,
        status: 'success',
        duration: 2000,
      });

      let price = branches.find(element => element.name === value)?.branchId;
      setBranch(price)
      props.handleBranchChange(price)
      console.log(branch)
    }

  const handleSelect = (params: any) => {
    setBranch(params);
    console.log(branch);
  };

  const { value, getRootProps, getRadioProps } = useRadioGroup({
      name: 'framework',
      onChange: handleChange
    })

  
  const group = getRootProps()
  const branches: { name: string, address: string, branchId: number, _count: {customers: number} }[] = props.company.branches
  const options:string[] = branches.map(a => a.name);
  console.log(branches)

  
  return (
    <Box mb={8}>
      <Heading key={props.company.id} size="sm">
        {props.comapany?.name}
      </Heading>
      <Text color="gray.500">Select Branch {branch}</Text>
      <Flex alignContent="flex-start" flexFlow={{ base: 'row wrap',}} my={2}>
      {options.map((value, index) => {
      const radio = getRadioProps({ value })
      return (
         <BranchRadios key={value} {...radio}>
          {value}
        </BranchRadios>
       
      )
    })}
    </Flex>
    <CustomerTable branch={branch}></CustomerTable>
    </Box>
  );
};

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
  const [ branch, setBranch ] = useState<number>()
  const [tank, setTank] = useState<string | null>(null);
  const logInfo = (info: string) => {
    console.log(info);
    //setTank(info)
    return info;
  };

  const transformedCustomer = props.customers.map((customer:Customer) => ({
    names: customer.name + customer.phone + customer.uniqueId, 
    ...customer

  }))

  const customerComplete = transformedCustomer.map((person:any, oid) => (
    <AutoCompleteItem
      key={`option-${oid}`}
      value={person}
      textTransform="capitalize"
      align="center"
    >
      <Avatar size="sm" name={person.name}/>
      <Text ml="4">{person.name} , {person.uniqueId}, {person.phone}</Text>
    </AutoCompleteItem>
))

  const handleBranchChange = (branchId:number) => {
    setBranch(branchId)
  }

  // Branch Radios
  const toast = useToast()
  const [ branchId, setBranchId ] = useState<number>()  

  const handleChange = (value: any) => {
    toast({
      title: `The value got changed to ${value}!`,
      status: "success",
      duration: 2000,
    });

    let transformedValue = value.split(/(\d+)/)[0]
    transformedValue = transformedValue.trim()

    let branchId = branches.find(
        (element) => element.name == transformedValue
    )?.branchId;
    
    setBranchId(branchId)
    console.log(transformedValue)

  };

  const { value, getRootProps, getRadioProps } = useRadioGroup({
    name: "framework",
    onChange: handleChange,
  });

  const group = getRootProps();

  const branches: { name: string, address: string; branchId: number; _count: {customers: number}}[] =
    props.branches; 
  const options: string[] = branches.map((a) => `${a.name} ${a._count.customers} Members`);


  return (
    <Flex height="100vh" width="100vw">
      <Head title="Admin - Customers"></Head>
      <Box height="100%" className="navigation">
        <AdminNav  handleToggleClose={handleToggleClose} toggled={toggled} company={props.company}></AdminNav>
      </Box>

      <Box overflowY="auto" w="100%" className="main-content">
        <WithSubnavigation user={user} handleCollapsedChange={handleCollapsedChange} handleToggleSidebar={handleToggleSidebar} branch={props.branch}></WithSubnavigation>
        <Box mt={4} px={6} className="branches">
        <Heading mb={2} color="gray.500" size="lg">Customer Loyalty</Heading>
          { /*
          {props.companies.map((item: any) => (
            <Box key={item.id}>
              <Heading key={item.id} size="sm">
                {item.name}
              </Heading>
              <CompanyComponent branch={branch} handleBranchChange={handleBranchChange} company={item}></CompanyComponent>
            </Box>
          ))} */}
        </Box>

            <Box px={6} className="branches">
            <Input width="max-content" onClick={onOpen} type="text" placeholder="Search"></Input>
            <Flex alignContent="flex-start" flexFlow={{ base: 'row wrap',}} my={2}>
        {options.map((value, index) => {
        const radio = getRadioProps({ value })
        return (
           <BranchRadios key={value} {...radio}>
            {value}
          </BranchRadios>
         
        )
      })}
      </Flex>
            
        </Box>

      { /*
        <Box p={6} className="customers">
            <Flex my={2} justify="space-between">
                <Text fontSize="medium" color="gray.500">AicoGas - {branch}</Text>
                <Box>
                <Text mb={1} color="gray.500">Search Customer</Text>     
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
        </Box>
          */ }
        <Box px={6}>
          <CustomerTable branch={branchId}></CustomerTable>  
        </Box>  
        
        <Search branch={branchId} onClose={onClose} isOpen={isOpen}></Search>
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
      _count: {
        select: {
          customers: true
        }
      }
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

  const companies = await prisma.company.findMany({
    include: {
      branches: {
        include: {
          tanks: true,
          _count: {
            select: {
              customers: true
            }
          }
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
  });//Swr

  return {
    props: { branch, company, branches, companies, customers, user },
  };
});
