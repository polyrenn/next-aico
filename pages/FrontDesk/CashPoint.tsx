import Link from "next/link";
import Head from "../../components/head";
import Nav from "../../components/nav";
import WithSubnavigation from "../../components/Navigation/FrontDesk";
//Layout Imports
import { Box, HStack, Center, Heading } from "@chakra-ui/react";
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
import SaleForm from "../../components/FrontDesk/Crb/SaleForm";

//React Imports
import { useState, useContext, createContext } from "react";

//Utilities
import { useRadioGroup, useColorModeValue } from "@chakra-ui/react";
import { prisma } from "../../lib/prisma";
import { GetServerSideProps } from "next";
import CashPointForm from "../../components/FrontDesk/CashPoint/CashPointForm";
import useSWR from "swr";

import summary from '../../data/data'

const fetcher = (...args) => fetch(...args).then((res) => res.json())


export const BranchContext = createContext<{ address: string, branchId: number }[]>([]);

export default (props: any) => {
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
    const { data, error } = useSWR('/api/dummycrb', fetcher, {
      onSuccess: (data) => {
       
      }
    });

    let [tests] = returned
    console.log(tests)
    
  const getData = async (id: number) => {
     await fetch(`/api/FrontDesk/FetchSaleDetails?id=${id}`)
      .then((response) => response.json())
      .then((data) => resultant = data)

      setReturned(resultant)
      setCurrentSale(resultant[0].id)

  };

  const Queue = () => {

    const [number, setNumber] = useState<number>(0)
  
    const fetcher = (url:any) => fetch(url).then((res) => res.json())
    const { data, error } = useSWR('/api/FrontDesk/FetchQueue', fetcher, {
      onSuccess: (data) => {
       
      }
    });
  
    if(!data) return <Center><Spinner></Spinner></Center> // Or If returned equals empty array
    
  
  
    return (
       <Box>
      {
        data.map((item:any, counter:number) => 
        <Button
            onClick={() => getData(item.id)}
            fontSize={"sm"}
            fontWeight={500}
            bg={useColorModeValue("cyan.50", "cyan.900")}
            px={4}
            color={"cyan.900"}
            rounded={"md"}
          >
            {item.id}
          </Button>
     
    )}
    </Box>
    );
   
    
  
  };

  return (
    <div>
      <WithSubnavigation branch={props.branch[0]}></WithSubnavigation>
      <Head title="Cash Desk" />
      <Box className="main-content" mx={8}>
        {/* Optional Prop Number that determines Number of Stat to Render in the Block */}
        <Box my={4} className="stats">
          <StatBlock></StatBlock>
        </Box>

        <Box className="Utils">
          <Center>
            <Button colorScheme="gray">Report</Button>
          </Center>
        </Box>
        <Box className="queue">
          <Text my={2} fontWeight={500} fontSize="12px"> CRB QUEUE</Text>  
          <Queue></Queue>
        </Box>

        <Box my={4}>
        <BranchContext.Provider value={props.branch}>
            <CashPointForm currentSale={currentSale} summary={returned}></CashPointForm>
        </BranchContext.Provider>
          
        </Box>
      </Box>
    </div>
  );
};

// Auth Maybe
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const branch = await prisma.branch.findMany({
    select: {
      address: true,
      branchId: true,
    },
  });
  return {
    props: { branch },
  };
};
