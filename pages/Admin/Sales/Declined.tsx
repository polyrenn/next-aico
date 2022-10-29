import Link from "next/link";
import { Alert, Link as ChakraLink } from "@chakra-ui/react"; 
import Head from "../../../components/head";
import Nav from "../../../components/nav";
import WithSubnavigation from "../../../components/Navigation/FrontDesk";
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
import { Text, Button, Spinner, Input } from "@chakra-ui/react";
import { Radio, RadioGroup } from "@chakra-ui/react";
// Components
import StatBlock from "../../../components/FrontDesk/StatBlock";
import PriceLabel from "../../../components/FrontDesk/PriceLabel";
import CategoryRadios from "../../../components/FrontDesk/ChangeCategory";
import { useToast } from "@chakra-ui/react";
// Tag Component
import {
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  TagCloseButton,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,

} from "@chakra-ui/react";

// Icons
import { PhoneIcon, AddIcon, WarningIcon } from "@chakra-ui/icons";
import { EditIcon } from "../../../components/Icons/Icons";
import SaleForm from "../../../components/FrontDesk/Crb/SaleForm";

//React Imports
import { useState, useContext, createContext } from "react";

//Utilities
import { useRadioGroup, useColorModeValue } from "@chakra-ui/react";
import { prisma } from "../../../lib/prisma";
import { GetServerSideProps } from "next";
import CashPointForm from "../../../components/FrontDesk/CashPoint/CashPointForm";
import useSWR from "swr";
import Select from "react-select";
import { withSessionSsr } from "../../../lib/withSession";
import { useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";


import AdminNav from "../../../components/Navigation/Admin";
import LogReceipt from "../../../components/Admin/Sales/Receipt";
import SwitchLog from "../../../components/Common/SwitchLog";
import DayStats from "../../../components/Common/DayStats";
import styles from "./Sales.module.css"
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

  branchesDrp: {
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

  formattedSales: {
    name: string;
    sale_number: number;
    total_kg: number;
    amount: number;
    customer_id: string;
    timestamp: string;
    change: number;
    timestampTime: string
 
  }[];

  formattedClosingSales: {
    name: string;
    sale_number: number;
    total_kg: number;
    amount: number;
    customer_id: string;
    timestamp: string;
    change: number;
    timestampTime: string
 
  }[];

  user: {
    id: number,
    admin: boolean
  };
}
const fetcher = (url:string) => fetch(url).then((res) => res.json())
interface Sales {
    name: string;
    sale_number: number;
    total_kg: number;
    amount: number;
    customer_id: string;
    timestamp: string;
    timestampTime: string;
    change: number
}[]
export default (props: PageProps<[]>) => {

    const toast = useToast()

    const { data:branchData, error:branchError } = useSWR(`/api/Common/GetBranches?id=${props.branch}`, fetcher, {
        onSuccess: (data) => {
        }
    })

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

    const colorCode = (item:string) => {
        switch (item) {
            case 'Domestic':
                return 'inherit'
        
            case 'Dealer':
                return 'green.300'
    
            case 'Eatery':
                return 'blue.300'
            
            case 'Civil Servant':
                return 'yellow.300'
            
            case 'Other':
                return 'red.500'    
                        
            default:
                break;
        }
    }  

  const { isOpen, onClose, onOpen } = useDisclosure()  
  const { query } = useRouter()  

  // Select Helpers
  const customStyles = {
    control: (provided:any, state:any) => ({
     ...provided,   
     minHeight: "56px",
     width: "max-content"
    }),

  }  

  const companyOptions = props.branchesDrp?.map(function (row:any) {
    return { value: row.branchId, label: row.name };
  });
  

  console.log(props.user)
  const today = new Date()
  const [ currentDate, setCurrentDate ] = useState(today)
  const [currentSale, setCurrentSale] = useState([]) as any
  const [branch, setBranch] = useState<number | null>(null);

  const { data, error } = useSWR(`/api/Sales/DeclinedSales?date=${new Date(currentDate).toISOString()}&branch=${branch}`, fetcher, {
    onSuccess: (data) => {
     
    }});

  const handleChange = (event:any) => {
    setCurrentDate(event.target.value)
  }

  const handleReceiptPopup = (item:any) => {
    onOpen()
    setCurrentSale([item])
  }

  const deleteSale = async (id:number) => {
    const res = await fetch(`/api/Sales/DeleteSale?id=${id}`, {
        method: 'post',
      }).then( (res) => {
        if(res.ok) {
            toast({
                title: 'Deleted.',
                description: `Deleted Successfully. `,
                status: 'success',
                duration: 5000,
                isClosable: true,
              })
        } else {
            toast({
                title: 'Error',
                description: "An Error Has Occured.",
                status: 'error',
                duration: 10000,
                isClosable: true,
              })
        }
        
    }
      )
  }

 
  return (
    <Flex height="100vh" width="100vw">
      <Head title="Admin - Declined Sales"></Head>
      <Box height="100%" className="navigation">
        <AdminNav handleToggleClose={handleToggleClose} toggled={toggled} company={props.company}></AdminNav>
      </Box>

      <Box overflowY="auto" w="100%" className="main-content">
        <WithSubnavigation user={user} handleCollapsedChange={handleCollapsedChange} handleToggleSidebar={handleToggleSidebar} branch={props.branch}></WithSubnavigation>
        <Box p={6} className="actions">

        <Heading color="gray.500" size="lg">Declined Sales for {new Date(currentDate).toDateString()}</Heading>
        <Flex mt={2}>
        <Box mr={4}>
        <Text mb={1} color="gray.500">Choose Date</Text>    
        <Input
                id="date"
                name="date"
                width="300px"
                type="date"
                variant="outline"
                h="56px"
                onChange={handleChange}
                
              />
        </Box>

        <Box>
        <Text mb={1} color="gray.500">Choose Branch</Text>    
        <Select
                  styles={customStyles}
                  instanceId="branch-select"
                  placeholder="Select Branch"
                  options={companyOptions}
                  onChange={(option:any) => setBranch(option.value)}
                 
        />
        </Box>    
        
        </Flex>

        </Box>

      <Box px={6} className="declined-sales">
      <TableContainer rounded={8} border="2px solid" borderColor="gray.500">
      <Table>
        <TableCaption>Delcined Sales</TableCaption>
        <Thead>
          <Tr>
            <Th>Date/Time</Th>
            <Th>Branch</Th>
            <Th>CRB</Th>
            <Th>Customer</Th>
            <Th>Total Kg</Th>
            <Th>Amount</Th>
            <Th>Reason For Decline</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
            {data?.map((item:any) => 
              <Tr>
                 <Td>{item.timestamp}</Td>
                 <Td>{item.branch_id}</Td>
                 <Td>{item.sale_number}</Td>
                 <Td>{item.customer_id}</Td>
                 <Td>{item.total_kg}</Td>
                 <Td>{item.amount}</Td>
                 <Td>{item.decline_reason}</Td>
                 <Td><Button onClick={() => deleteSale(item.id)} colorScheme="red">Delete</Button></Td>

              </Tr>
               
            )}
          </Tbody>
        <Tfoot>
        <Tr>
        <Th>Date/Time</Th>
            <Th>Branch</Th>
            <Th>CRB</Th>
            <Th>Customer</Th>
            <Th>Total Kg</Th>
            <Th>Amount</Th>
            <Th>Reason For Decline</Th>
            <Th>Action</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
      </Box>          
    </Box> {/*  Main Content */}
    </Flex>
  );
};

// Auth Maybe

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {

    interface OpeningSales {
            name: string;
            sale_number: number;
            total_kg: number;
            amount: number;
            customer_id: string;
            timestamp: string;
            change: number
    }[]
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

    let branchesDrp

    if(user?.role == 'Admin') {
        branchesDrp = await prisma.branch.findMany({
            select: {
              address: true,
              branchId: true,
              name: true
            },
            orderBy: {
              id: "asc"
            }
        });
    } else {
        branchesDrp = await prisma.branch.findMany({
            where: {
              companyID: user?.company
            },
            select: {
              address: true,
              branchId: true,
              name: true
            },
            orderBy: {
              id: "asc"
            }
        });
    }
  
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

let openingSales:OpeningSales[] = await prisma.$queryRaw`SELECT DISTINCT b.name,
(select ts.sale_number from sales ts where b.branch_id = ts.branch_id
     and timestamp > '2020-10-03'::timestamp
     order by id asc limit 1   
),
(select ts.total_kg from sales ts where b.branch_id = ts.branch_id
     and timestamp > '2020-10-03'::timestamp
     order by id asc limit 1   
),
(select ts.customer_id from sales ts where b.branch_id = ts.branch_id
     and timestamp > '2020-10-03'::timestamp
     order by id asc limit 1   
),
(select ts.amount from sales ts where b.branch_id = ts.branch_id
     and timestamp > '2020-10-03'::timestamp
     order by id asc limit 1   
),
(select ts.timestamp::time from sales ts where b.branch_id = ts.branch_id
     and timestamp > '2020-10-03'::timestamp
     order by id asc limit 1   
),
(select ts.change from sales ts where b.branch_id = ts.branch_id
     and timestamp > '2020-10-03'::timestamp
     order by id asc limit 1   
)
From branches b



`; // Refactor to Swr

openingSales = JSON.parse(JSON.stringify(openingSales))

const formattedSales = openingSales.map(item => ({
    timestampTime: new Date(item.timestamp).toLocaleTimeString("en-US", {timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'}),
    ...item
}))

let closingSales:OpeningSales[] = await prisma.$queryRaw`SELECT DISTINCT b.name,
(select ts.sale_number from sales ts where b.branch_id = ts.branch_id
     and timestamp > '2020-10-03'::timestamp
     order by id desc limit 1   
),
(select ts.total_kg from sales ts where b.branch_id = ts.branch_id
     and timestamp > '2020-10-03'::timestamp
     order by id desc limit 1   
),
(select ts.customer_id from sales ts where b.branch_id = ts.branch_id
     and timestamp > '2020-10-03'::timestamp
     order by id desc limit 1   
),
(select ts.amount from sales ts where b.branch_id = ts.branch_id
     and timestamp > '2020-10-03'::timestamp
     order by id desc limit 1   
),
(select ts.timestamp::time from sales ts where b.branch_id = ts.branch_id
     and timestamp > '2020-10-03'::timestamp
     order by id desc limit 1   
),
(select ts.change from sales ts where b.branch_id = ts.branch_id
     and timestamp > '2020-10-03'::timestamp
     order by id desc limit 1   
)
From branches b



`; // Refactor to Swr

closingSales = JSON.parse(JSON.stringify(closingSales))

const formattedClosingSales = closingSales.map(item => ({
    timestampTime: new Date(item.timestamp).toLocaleTimeString("en-US", {timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'}),
    ...item
}))
  
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
        branch, company, companies, branches, branchesDrp, openingSales, formattedSales, formattedClosingSales
      },
    };
  },
 
);