import Link from "next/link";
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


//React Imports
import { useState, useContext, createContext, FC } from "react";

//Utilities
import { useRadioGroup, useColorModeValue } from "@chakra-ui/react";

import useSWR from "swr";
import { useDisclosure } from "@chakra-ui/react";
import BranchRadios from "../ChangeBranch";
import CustomerTable from "./CustomerTable";
const CompanyComponent: FC<any> = (props) => {

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
    const branches: { name: string, address: string, branchId: number }[] = props.company.branches
    const options:string[] = branches.map(a => a.name);

    
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
      </Box>
    );
  };

  export default CompanyComponent