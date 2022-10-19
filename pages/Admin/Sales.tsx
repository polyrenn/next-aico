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
import { Text, Button, Spinner, Input } from "@chakra-ui/react";
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
import styles from "./Sales.module.css"

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

  console.log(props.user)
  const today = new Date()
  const [ currentDate, setCurrentDate ] = useState(today)

  const { data, error } = useSWR(`/api/Sales/SalesSummary?date=${new Date(currentDate).toISOString()}`, fetcher, {
    onSuccess: (data) => {
     
    }});  

  const handleChange = (event:any) => {
    setCurrentDate(event.target.value)
  }
 

  return (
    <Flex height="100vh" width="100vw">
      <Head title="Admin - Sales"></Head>
      <Box height="100%" className="navigation">
        <AdminNav handleToggleClose={handleToggleClose} toggled={toggled} collapsed={collapsed} company={props.company}></AdminNav>
      </Box>

      <Box overflowY="auto" w="100%" className="main-content">
        <WithSubnavigation handleCollapsedChange={handleCollapsedChange} handleToggleSidebar={handleToggleSidebar} branch={props.branch}></WithSubnavigation>
        <Box p={6} className="actions">

        <Heading color="gray.500" size="lg">Sales Summary for {new Date(currentDate).toDateString()}</Heading>
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
        <TableCaption>Sales Records</TableCaption>
        <Thead>
          <Tr>
            <Th></Th>
            {props.branches.map((item) => 
                <Th>
                    <Stack direction="column">
                    <Text>{item.name}</Text>
                    <Button w="min-content">
                    <Link href={`/Admin/Sales/SalesLog?branch=${item.branchId}`}>Go to Sales Log</Link>
                    </Button>
                    </Stack>
                   
                </Th>
            )}
          </Tr>
        </Thead>
        <Tbody>
           <Tr>
            <Td>Opening Sales</Td>
            {data?.openingSales.map((item:Sales) =>
                <Td>
                <Stack direction="column">
                    <Text>Invoice: #{item.sale_number}</Text>
                    <Text>Time: {item.timestampTime}</Text>
                    <Text>Customer: {item.customer_id}</Text>
                    <Text>Total Kg: {item.total_kg} KG</Text>
                    <Text>Change: {item.change}</Text>
                </Stack>
                
                </Td>
            )}
            </Tr> 

           <Tr>
            <Td>Closing Sales</Td>
            {data?.closingSales.map((item:Sales) =>
                <Td>
                <Stack direction="column">
                    <Text>Invoice: #{item.sale_number}</Text>
                    <Text>Time: {item.timestampTime}</Text>
                    <Text>Customer: {item.customer_id}</Text>
                    <Text>Total Kg: {item.total_kg} KG</Text>
                    <Text>Change: {item.change}</Text>
                </Stack>
                
                </Td>
            )}
            </Tr> 

            <Tr>
            <Td>Total Invoice</Td>
            {data?.totalInvoice.map((item:any) =>
                <Td>
                <Stack direction="column">
                    <Text>{item.sales_count}</Text>
                </Stack>
                
                </Td>
            )}
            </Tr>

            <Tr>
            <Td>Total Kg</Td>
            {data?.totalKg.map((item:any) =>
                <Td>
                <Stack direction="column">
                    <Text>{item.total_kg} KG</Text>
                </Stack>
                
                </Td>
            )}
            </Tr>

             <Tr>
            <Td>Total Cash</Td>
            {data?.totalCash.map((item:any) =>
                <Td>
                <Stack direction="column">
                    <Text>{item.total_cash_amount} NGN</Text>
                </Stack>
                
                </Td>
            )}
            </Tr>

             <Tr>
            <Td>Total POS</Td>
            {data?.totalPos.map((item:any) =>
                <Td>
                <Stack direction="column">
                    <Text>{item.total_pos_amount} NGN</Text>
                </Stack>
                
                </Td>
            )}
            </Tr>

             <Tr>
            <Td>Total Credit</Td>
            </Tr>

            <Tr backgroundColor="teal.400">
            <Td>Total Amount</Td>
            {data?.totalAmount.map((item:any) =>
                <Td>
                <Stack direction="column">
                    <Text>{item.amount_sold} NGN</Text>
                </Stack>
                
                </Td>
            )}
            </Tr> 

            <Tr>
               <Td textAlign="center" colSpan={100}>Tank Analysis</Td> 
            </Tr>

            <Tr>
            <Td>Current Tank</Td>
            {data?.currentTank.map((item:any) =>
                <Td>
                <Stack direction="column">
                    <Text>{item.desig}</Text>
                </Stack>
                
                </Td>
            )}
            </Tr>

            <Tr>
            <Td>Opening Stock</Td>
            {data?.openingStock.map((item:any) =>
                <Td>
                <Stack direction="column">
                    <Text>{item.opening_stock} KG</Text>
                </Stack>
                
                </Td>
            )}
            </Tr>
            
            <Tr>
            <Td>Balance Stock</Td>
            {data?.closingStock.map((item:any) =>
                <Td>
                <Stack direction="column">
                    <Text>{item.closing_stock} KG</Text>
                </Stack>
                
                </Td>
            )}
            </Tr>

             <Tr>   
            <Td>Closing Stock</Td>
            {data?.closingStock.map((item:any) =>
                <Td>
                <Stack direction="column">
                    <Text>{item.closing_stock} KG</Text>
                </Stack>
                
                </Td>
            )}
            </Tr>        

            
         
            
          </Tbody>
        <Tfoot>
        <Tr>
            <Th></Th>
            {props.branches.map((item) => 
                <Th>{item.name}</Th>
            )}
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
      where: {
        branchId: user?.branch
      },
      select: {
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
      orderBy: {
        id: 'asc'
      }
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