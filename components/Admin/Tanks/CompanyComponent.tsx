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
  Wrap,
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

import useSWR from "swr";
import { useDisclosure } from "@chakra-ui/react";
import BranchRadios from "../ChangeBranch";
import CreateTank from "../Tanks/NewTank";
import TankComponent from "./TankComponent";



interface Tank {
    amount: number;
    branchId: number;
    designation: string;
    id: number;
    tankId: string;
}

const CompanyComponent: FC<any> = (props) => {
  const [currentTank, setCurrentTank] = useState<Tank[] | undefined>();
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

    let branchId = branches.find(
        (element) => element.name === value
    )?.branchId;
    const tanks = branches.find((element) => element.name === value)?.tanks;
    current = branches.find((element) => element.name === value)?.currentTank;
    setBranch(branchId)
    props.handleBranchChange(branchId);
    setCurrentTank(tanks)
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
        const radio = getRadioProps({ value })
        return (
           <BranchRadios key={value} {...radio}>
            {value}
          </BranchRadios>
         
        )
      })}
      </Flex>
      <Box mt={2} className="branch-blocks">
        <HStack>
          {props.company.branches.map((branch: any) => (
            <Box key={branch.id}></Box>
          ))}
        </HStack>
        <TankComponent branch={branch} currBranchTank={current} tanks={currentTank}></TankComponent>
      </Box>
    </Box>
  );
};

export default CompanyComponent;
