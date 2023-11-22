import Link from "next/link";
import Head from "../../components/head";
import Nav from "../../components/nav";
import WithSubnavigation from "../../components/Navigation/FrontDesk";
//Layout Imports
import { Box, HStack, Center, Heading, useDisclosure } from "@chakra-ui/react";
// Element Imports
import { Text, Button, Spinner, Flex } from "@chakra-ui/react";
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
import SaleForm from "../../components/FrontDesk/Crb/SaleForm";

//React Imports
import { useState, useContext, createContext } from "react";

//Utilities
import { useRadioGroup, useColorModeValue } from "@chakra-ui/react";
import { prisma } from "../../lib/prisma";
import { GetServerSideProps } from "next";
import CashPointForm from "../../components/FrontDesk/CashPoint/CashPointForm";
import useSWR from "swr";
import { withSessionSsr } from "../../lib/withSession";

import summary from '../../data/data'
import Report from "../../components/FrontDesk/CashPoint/Report";
import SwitchLog from "../../components/Common/SwitchLog";
import DayStats from "../../components/Common/DayStats";

const fetcher = (url:string) => fetch(url).then((res) => res.json())
interface BranchDetails {
  id: number
  name: string
  current_tank: string
  desig: string
  balance_stock: number
  company_name: string
}[]

interface BranchAddressId {
  address: string
  branchId: number
}[]

interface BranchContext {
  branch: any
  branchList: any
  data: any
  user: any

}



export const BranchContext = createContext<BranchContext | null>(null);


export default (props: any) => {

  const branch = props.branch
  const branchId = props.branch.branchId
  const branchList = props.branches
  const user = props.user
  const currentDate = new Date().toISOString()
  let resultant:any;
  // const [branch, setBranch] = useState<string | undefined>();
  interface ReturnedQueue {
    kg: number,
    quantity: number,
    amount: number,
    category: string
    branchId: number
  }

  const [currentSale, setCurrentSale] = useState<number | undefined>(0)
  const [returned, setReturned] = useState<ReturnedQueue[]>([]);
  const [customer, setCustomer] = useState(null);
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null)

    const { data, error } = useSWR(`/api/Common/BranchDetails?id=${branch.branchId}`, fetcher, {
      onSuccess: (data) => {
       
  }});

    let [tests] = returned
    console.log(tests)
    
  const getData = async (id: number) => {
     await fetch(`/api/FrontDesk/FetchSaleDetails?id=${id}`)
      .then((response) => response.json())
      .then((data) => resultant = data)
      .then((data) => {
        fetch(`/api/Customer/IsRegistered?id=${data[0].customerId}`, {
        method: 'post',
        body: JSON.stringify(data.customerId),
      }).then( (res) => {
    
        if(res.ok) {
          return res.json()
        } 
        
    }
      ).then((data) => {
        if(!data) {
          console.log("Not Registered")
          setIsRegistered(false)
        } else {
          console.log("Registered")
          setCustomer(data)
          setIsRegistered(true)
        }
        const merged = {
          ...data
        }
      })
    
    }
      )
      setReturned(resultant)
      setCurrentSale(resultant[0].id)

  };

  const Queue = () => {

    const [number, setNumber] = useState<number>(0)
  
    const fetcher = (url:any) => fetch(url).then((res) => res.json())
    const { data, error } = useSWR(`/api/FrontDesk/FetchQueue?id=${branch.branchId}`, fetcher, { refreshInterval: 1000 });
  
    if(!data) return <Center><Spinner></Spinner></Center> // Or If returned equals empty array
  
  
    return (
       <Box mr={2}>
      {
        data.map((item:any, counter:number) => 
        <Button
            onClick={() => getData(item.id)}
            fontSize={16}
            fontWeight={600}
            bg={useColorModeValue("cyan.50", "cyan.900")}
            p={6}
            color={"cyan.900"}
            rounded={"md"}
            mr={2}
          >
            {item.crbNumber}
          </Button>
     
    )}
    </Box>
    );
   
    
  
  };
//Report Helpers
const {isOpen, onClose, onOpen} = useDisclosure()  

  return (
    <div>
      <WithSubnavigation user={user} branch={props.branch}></WithSubnavigation>
      <Head title="Cash Desk" />
      <Box className="main-content" mx={8}>
        {/* Optional Prop Number that determines Number of Stat to Render in the Block */}
        <Center mt={2} className="switch-log">
            <SwitchLog branch={branchId} date={new Date().toISOString()}></SwitchLog>
        </Center>
        <Center className='stats'>
        { /*  <DayStats margin={true} date={currentDate} branch={branchId}></DayStats> */ }
        </Center>

        <Box className="Utils">
          {
            /*
              <Center>
            <Button w="56" onClick={onOpen} colorScheme="purple">Report</Button>
             </Center>
            */
          }
          
        </Box>
        <Box className="queue">
          <Text my={2} fontWeight={500} fontSize="12px"> CRB QUEUE</Text>  
          <Queue></Queue>
        </Box>

        <Box my={4}>
        <BranchContext.Provider value={{branch, branchList, data, user}}>
            <CashPointForm
             isRegistered={isRegistered}
             customer={customer}
             currentSale={currentSale}
             setReturned={setReturned}
             summary={returned}></CashPointForm>
        </BranchContext.Provider>
          
        </Box>

        <Report branch={props.branch} branchId={branchId} isOpen={isOpen} onClose={onClose}></Report>
      </Box>
      <style jsx global>{`
       .css-1zts0j {
        color: #0d0d0d !important;
        font-size: 14px !important;
       }
       .renn {
        background-color: red
       }
      `}</style>
    </div>
  );
};

// Auth Maybe
export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {

  const user = req.session.user;

  if (user?.role !== 'CashPoint Attendant') {
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
      branchId: user?.branch // Uses First Found on Undefined
    },
    select: {
      address: true,
      branchId: true,
      name: true,
      company: {
        select: {
          name: true
        }
      }
    },
  });

  const branches = await prisma.branch.findMany({
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
  

  return {
    props: { branch, user, branches },
  };

},
);
