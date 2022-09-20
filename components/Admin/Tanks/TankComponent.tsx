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
import CategoryRadios from "../../FrontDesk/ChangeCategory";
import CreateTank from "../Tanks/NewTank";


const TankComponent: FC<any> = (props) => {

    const toast = useToast()

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ isSwitching, setIsSwitching ] = useState<boolean>(false)
    const [tank, setTank] = useState<string>("");
  
    const switchTank =  async (tankName: string) => {
      setTank(tankName);
      setIsSwitching(true)
      const res = await fetch(`/api/Tanks/SwitchTank?branch=${props.branch}&current=${tankName}`, {
        method: 'post',
      }).then( (res) => {
  
        if(res.ok) {
            toast({
                title: 'Tank Switched.',
                description: `Tank Switched Successfully. `,
                status: 'success',
                duration: 10000,
                isClosable: true,
              }),
              setIsSwitching(false)
        } else {
            toast({
                title: 'Error',
                description: "An Error Has Occured.",
                status: 'error',
                duration: 10000,
                isClosable: true,
              }),
              setIsSwitching(false)
             
        }
        
    }
      )
     
    };
  
    return (
      <Flex mt={4} direction="column">
        <Heading mb={2} fontWeight="400" size="md">
          Tanks
        </Heading>
        <Box mb={2}>
          <Text>Current Tank:</Text>
          <Text>{props.currBranchTank}</Text>
        </Box>
        <Text>{/* props.branch.currentTank */}</Text>
        {props?.tanks?.map((item:any) => 
                  <HStack justify="space-between" px={2} width="xs" mb={2} py={6} borderWidth='1px' borderRadius='lg'>
                  <Box className="tank-info">
                    <Text>{item.designation}</Text>
                    <Divider orientation="vertical"/>
                    <Text
                     fontSize={'sm'}
                     fontWeight={500}
                     bg="cyan.50"
                     p={2}
                     px={4}
                     color={'cyan.900'}
                     rounded={'sm'}
                    >{item.amount}</Text>
                  </Box>
                  <Button isLoading={isSwitching} rounded="full" colorScheme="blue" onClick={() => switchTank(item.tankId)}>Switch</Button>
                </HStack>
                 
              )}
        <Button onClick={onOpen} leftIcon={<AddIcon />} w="80px" h="80px">
          Add
        </Button>
        <CreateTank
          branch={props.branch}
          isOpen={isOpen}
          onClose={onClose}
        ></CreateTank>
      </Flex>
    );
  };

  export default TankComponent