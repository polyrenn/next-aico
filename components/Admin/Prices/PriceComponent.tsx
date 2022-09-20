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
import CreatePrice from "./NewPrice";


const PriceComponent: FC<any> = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    const [tank, setTank] = useState<string>("");
  
    const handleIncrement = (tankName: string) => {
      setTank(tankName);
      console.log(`Switched to ${tankName}`);
    };
  
    return (
      <Flex mt={4} direction="column">
        <Heading mb={2} fontWeight="400" size="md">
          Category
        </Heading>
        <Text>{/* props.branch.currentTank */}</Text>
        <Button onClick={onOpen} leftIcon={<AddIcon />} w="80px" h="80px">
          Add
        </Button>
        <CreatePrice
          branch={props.branch}
          isOpen={isOpen}
          onClose={onClose}
        ></CreatePrice>
      </Flex>
    );
  };

  export default PriceComponent