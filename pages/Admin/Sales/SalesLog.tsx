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
            
            case 'Others':
                return 'red.500'    
                        
            default:
                break;
        }
    }  

    const colorCodeText = (item:string) => {
      switch (item) {
          
          case 'Others':
              return 'white'    
                      
          default:
              break;
      }
  }  

  const { isOpen, onClose, onOpen } = useDisclosure()  
  const { query } = useRouter()  

  console.log(props.user)
  const today = new Date()
  const [ currentDate, setCurrentDate ] = useState(today)
  const [currentSale, setCurrentSale] = useState([]) as any

  const { data, error } = useSWR(`/api/Sales/SalesLog?date=${new Date(currentDate).toISOString()}&branch=${query.branch}`, fetcher, {
    onSuccess: (data) => {
     
    }});

  const handleChange = (event:any) => {
    setCurrentDate(event.target.value)
  }

  const handleReceiptPopup = (item:any) => {
    onOpen()
    setCurrentSale([item])
  }

 
  return (
    <Flex height="100vh" width="100vw">
      <Head title="Admin - Sales Log"></Head>
      <Box height="100%" className="navigation">
        <AdminNav handleToggleClose={handleToggleClose} toggled={toggled} collapsed={collapsed} company={props.company}></AdminNav>
      </Box>

      <Box overflowY="auto" w="100%" className="main-content">
        <WithSubnavigation user={user} handleCollapsedChange={handleCollapsedChange} handleToggleSidebar={handleToggleSidebar} branch={props.branch}></WithSubnavigation>
        <Box p={6} className="actions">
        <Flex className="switch-log">
            <SwitchLog branch={query.branch} date={new Date(currentDate).toISOString()}></SwitchLog>
        </Flex>

        <DayStats branch={query.branch} date={new Date(currentDate).toISOString()}></DayStats>


        <Heading color="gray.500" size="lg">Sales Log for {new Date(currentDate).toDateString()}</Heading>
        <Box mt={2}>
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

        </Box>

      <Box px={6} className="sales">
      <TableContainer rounded={8} border="2px solid" borderColor="gray.500">
      <Table className={styles.table}>
        <TableCaption>Sales Log</TableCaption>
        <Thead>
          <Tr>
            <Th>Crb</Th>
            <Th>Customer Details</Th>
            <Th>Description</Th>
            <Th>Total Kg</Th>
            <Th>Amount</Th>
            <Th>Payment Method</Th>
            <Th>Tank</Th>
            <Th>Balance Stock</Th>
            <Th>Time</Th>
          </Tr>
        </Thead>
        <Tbody>
            {!data ? 
                <Tr>
                    <Td colSpan={100}>
                        <Spinner></Spinner>
                    </Td>
                </Tr> : null
        }
            {data?.sales.map((item:any) =>
               item.category != 'Switch' ? 
               
               <Tr key={item.id} color={`${colorCodeText(item.category)}`} backgroundColor={`${colorCode(item.category)}`}>
               <Td>{item.sale_number}</Td>
               <Td>
                   {!item.customer && !item.phone ? 
                   
                   <Stack fontWeight="600">
                           <ChakraLink onClick={() => handleReceiptPopup(item)}>
                               <Box>
                                   <Text>{item.customer_id}</Text>
                               </Box>
                           </ChakraLink>
                       </Stack> : 
                       <Stack fontWeight="600">
                           <ChakraLink onClick={() => handleReceiptPopup(item)}>
                               <Box>
                                   <Text>{item.name}</Text>
                                   <Text>{item.phone}</Text>
                               </Box>
                           </ChakraLink>
                       </Stack>
                    }
               </Td>
               <Td>
                   {item.description.map((desc:any, counter:number) =>
                       <Text key={counter} mb={2}>{desc.quantity} X {desc.kg}Kg {item.category}</Text>
                   )}
               </Td>
               <Td>{item.total_kg}</Td>
               <Td>{item.amount?.toLocaleString()} NGN</Td>
               <Td>{item.payment_method.toUpperCase()}</Td>
               <Td>{item.current_tank}</Td>
               <Td>{item.balance} KG</Td>
               <Td>{item.timestampTime}</Td>
           </Tr> 
           : 
           <Tr>
            <Td colSpan={2} backgroundColor="red.300">
                Switch Alert
                <Text>Total of {item.description[0].old_name}</Text>
            </Td>
            <Td></Td>
            <Td><Text fontWeight={500}>{item.description[0].total_kg} Kg</Text></Td>
            <Td><Text fontWeight={500}>{item.description[0].amount_sold?.toLocaleString()} NGN</Text></Td>
            <Td textAlign="center" fontWeight="600" color="white" backgroundColor="purple.500" colSpan={7}>
                <Stack direction="column">
                    <Text>Loss on previous tank: {item.description[0].loss} Kg</Text>
                    <Text>Switched to: {item.description[0].switchedTo}</Text>
                    <Text>New Tank Opening Stock: {item.description[0].opening_new} Kg</Text>
                </Stack>
               
            </Td>
           </Tr> 
            )}
            {data?.tankAggregations.map((item:any, counter:number) => 
                <Tr key={counter}>
                <Td colSpan={3}>Total of {item.desig}</Td>
                <Td fontWeight={500} borderRightWidth="1px">{item.total_kg} Kg</Td>
                <Td fontWeight={500} borderRightWidth="1px">{item.total_amount_sold?.toLocaleString()} NGN</Td>
                </Tr>
            )}
            

            <Tr>
                <Td textAlign="center" fontWeight={700} colSpan={100}>Day's Summary</Td>
            </Tr>

            <Tr fontWeight={600}>
                <Td colSpan={3}>Sub Total</Td>

                {data?.aggregations.map((item:any, counter:number) =>
                    <Td key={counter} borderRightWidth="1px">Total Kg: {item.total_kg_today} Kg</Td>
                )}

                {data?.aggregations.map((item:any, counter:number) =>
                    <Td key={counter} borderRightWidth="1px" borderLeftWidth="1px" colSpan={1}>Total Amount: {item.total_amount_today?.toLocaleString()} NGN</Td>
                )}

            </Tr>

            <Tr fontWeight={600}>
                <Td colSpan={3}>Total POS</Td>
                {data?.aggregations.map((item:any, counter:number) =>
                    <Td key={counter} borderRightWidth="1px"  borderLeftWidth="1px">{item.total_pos_sold?.toLocaleString()} NGN</Td>
                )}

            </Tr>

            <Tr fontWeight={600}>
                <Td colSpan={3}>Total Cash</Td>
                {data?.aggregations.map((item:any, counter:number) =>
                    <Td key={counter} borderRightWidth="1px" borderLeftWidth="1px">{item.total_cash_sold?.toLocaleString()} NGN</Td>
                )}

            </Tr>

            <Tr fontWeight={600}>
                <Td colSpan={3}>Closing Stock</Td>
                {data?.aggregations.map((item:any, counter:number) =>
                    <Td key={counter} borderRightWidth="1px" borderLeftWidth="1px">{item.closing_stock} Kg</Td>
                )}

            </Tr>
           
            
         
            
          </Tbody>
        <Tfoot>
        <Tr>
            <Th>Crb</Th>
            <Th>Customer Details</Th>
            <Th>Description</Th>
            <Th>Total Kg</Th>
            <Th>Amount</Th>
            <Th>Payment Method</Th>
            <Th>Tank</Th>
            <Th>Balance Stock</Th>
            <Th>Time</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
      </Box>          

    <LogReceipt summary={currentSale} isOpen={isOpen} onClose={onClose}></LogReceipt>  
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
        branch, company, companies, branches, openingSales, formattedSales, formattedClosingSales
      },
    };
  },
 
);