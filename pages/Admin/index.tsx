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
import { EditIcon } from "../../components/Icons/Icons";
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
import { useDisclosure } from "@chakra-ui/react";


import AdminNav from "../../components/Navigation/Admin";
import EditBranch from "../../components/Admin/EditBranch";
import CreateCompany from "../../components/Admin/CreateCompany";
import CreateBranch from "../../components/Admin/CreateBranch";
import DeleteCompany from "../../components/Admin/DeleteCompany";
import DeleteBranch from "../../components/Admin/DeleteBranch";

export const BranchContext = createContext<
  { address: string; branchId: number }[]
>([]);

interface PageProps<T> {
  branch: {
    address: string;
    branchId: number;
    name: string
  };

  branches: {
    address: string;
    branchId: number;
    name: string;
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
    admin: boolean,
    role: string
  };
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

  // Modal Helpers For Quick Actions
  const { isOpen:isopenEditBranch, onClose:closeEditBranch, onOpen:onOpenEditBranch } = useDisclosure()
  const { isOpen:isopenNewBranch, onClose:closeNewBranch, onOpen:onOpenNewBranch } = useDisclosure()
  const { isOpen:isopenDeleteBranch, onClose:closeDeleteBranch, onOpen:onOpenDeleteBranch } = useDisclosure()
  const { isOpen:isopenNewCompany, onClose:closeNewCompany, onOpen:onOpenNewCompany } = useDisclosure()
  const { isOpen:isopenDeleteCompany, onClose:closeDeleteCompany, onOpen:onOpenDeleteCompany } = useDisclosure()

  const options = props.branches.map(function (row) {
    return { value: row.name.toLowerCase(), label: row.name };
  });

  const companyOptions = props.companies.map(function (row) {
    return { value: row.companyId, label: row.name };
  });

  const companyCount = props.companies.length;
  const branchCount = props.branches.length;
  console.log(props.user)
  return (
    <Flex height="100vh" width="100vw">
      <Head title="Admin"></Head>
      <Box height="100%" className="navigation">
        <AdminNav toggled={toggled}  handleToggleClose={handleToggleClose} company={props.company}></AdminNav>
      </Box>

      <Box overflowY="auto" w="100%" className="main-content">
        <WithSubnavigation user={user} handleCollapsedChange={handleCollapsedChange} handleToggleSidebar={handleToggleSidebar} branch={props.branch}></WithSubnavigation>

        <Heading mt={6} px={6} mb={2} color="gray.500" size="lg">Statistics</Heading> 
        <Flex px={6} flexFlow="row wrap" className="sales-summary">
        {props.branchAggregations.map((item:any) => 
            <Flex key={item.name} mr={2} mb={4} flexFlow="column" w={{base: "100%", md: "30%"}} className="item" borderWidth="1px" rounded="sm">
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
                  >{item.desig}</Text>
                </HStack>
               
            </Stack>

            <Stack my={4} mx={4} spacing={4} p={2} bgColor="gray.50" className="content">

                <HStack justifyContent="space-between">
                  <Text>Successful Sales</Text>
                  <Text>{item.sales_count}</Text>
                </HStack>

                <HStack justifyContent="space-between">
                  <Text>Kg Sold</Text>
                  <Text>{item.total_kg} Kg</Text>
                </HStack>

                <HStack justifyContent="space-between">
                  <Text>Total Amount</Text>
                  <Text>{item.amount_sold?.toLocaleString()} NGN</Text>
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
        {props.user.role == 'Admin' ? 
               <Box p={6} className="actions">

               <Heading mt={6} mb={2} color="gray.500" size="lg">Quick Actions</Heading> 
         <Flex flexFlow={{ base: 'row wrap',}} mb={4} justify="space-between">
           <HStack mb={{base: 2, md: 0}}>
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
            
           </HStack>
       
           <HStack>
             <Button onClick={onOpenNewCompany} leftIcon={<AddIcon/>}>New</Button>
             <Button onClick={onOpenDeleteCompany} colorScheme="red">Delete Company</Button>
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
       
       
       <Flex flexFlow={{ base: 'row wrap',}} justify="space-between">
           <HStack mb={{base: 2, md: 0}}>
             <Heading size="sm">Branch</Heading>
             <Center
               rounded="sm"
               w="24px"
               h="24px"
               bg="green.200"
               color="green.500"
             >
               {branchCount}
             </Center>
           </HStack>
       
           <HStack>
             
             <Button onClick={onOpenNewBranch} leftIcon={<AddIcon/>}>New</Button>
             <Button onClick={onOpenEditBranch} leftIcon={<EditIcon/>}>Edit</Button>
             <Button onClick={onOpenDeleteBranch} colorScheme="red">Delete</Button>
           </HStack>
         </Flex>     
       
               </Box>
       
        : null
        
      }

      {props.user.role == 'Admin' ? 

        <Box p={6} className="company-details">
          <Heading mt={6} mb={2} color="gray.500" size="lg">Company Info</Heading>
          <Box>
            {props.companies.map((item) => 
              <Box>
              <Heading mb={2} size="sm" color="gray.500">{item.name}</Heading>
              <Flex flexFlow="row wrap" className="branch-details">
                {item.branches.map((branch:any) =>
                  <Flex borderColor="blue.100" backgroundColor="blue.50" p={2} key={branch.branchId} mr={2} mb={4} flexFlow="column" w={{base: "100%", md: "30%"}} className="item" borderWidth="1px" rounded="sm">
                    <Box>
                      <Text fontWeight={500} fontSize={18}>{branch.name}</Text>
                    </Box>
                    <Text>{branch.address}</Text>
                  </Flex>
                )}
              </Flex>
              </Box>  
            )}
          </Box> 
        </Box>  
        : null 
        }

     <EditBranch isOpen={isopenEditBranch} onClose={closeEditBranch}></EditBranch>
     <CreateBranch isOpen={isopenNewBranch} onClose={closeNewBranch}></CreateBranch>
     <DeleteBranch isOpen={isopenDeleteBranch} onClose={closeDeleteBranch}></DeleteBranch>
     <CreateCompany isOpen={isopenNewCompany} onClose={closeNewCompany}></CreateCompany>
     <DeleteCompany isOpen={isopenDeleteCompany} onClose={closeDeleteCompany}></DeleteCompany>
    </Box> {/*  Main Content */}
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

let branchAggregations

if(user?.role == 'Admin') {
  branchAggregations = await prisma.$queryRaw`SELECT b.id,
  b.name,
  (select ts.designation as desig from tanks ts where b.current_tank = ts.tank_id),
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
} else {

  branchAggregations = await prisma.$queryRaw`SELECT b.id,
  b.name,
  b.branch_id,
  (select ts.designation as desig from tanks ts where b.current_tank = ts.tank_id),
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
  WHERE b.branch_id = ${user?.branch}::int 
  ORDER BY b.id asc
  `; // Refactor to Swr

}


  
    const branches = await prisma.branch.findMany({
      select: {
        address: true,
        branchId: true,
        name: true
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