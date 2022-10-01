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
import { PhoneIcon, AddIcon, WarningIcon, UpDownIcon } from "@chakra-ui/icons";

//React Imports
import { useState, useContext, createContext, FC } from "react";

//Utilities
import { useRadioGroup, useColorModeValue } from "@chakra-ui/react";

import useSWR from "swr";
import { useDisclosure } from "@chakra-ui/react";
import CategoryRadios from "../../FrontDesk/ChangeCategory";
import CreateTank from "../Tanks/NewTank";
import UpdateStockModal from "./UpdateStockModal";


const UpdateStock: FC<any> = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    const [tank, setTank] = useState<string>("");
  
    const handleIncrement = (tankName: string) => {
      setTank(tankName);
      console.log(`Switched to ${tankName}`);
    };
  
    return (
      <Flex mt={4} direction="column">
        <Box mb={2}>
        </Box>

        <Button px={2} onClick={onOpen} leftIcon={<UpDownIcon />}  h="80px">
          Update
        </Button>
       <UpdateStockModal
        isOpen={isOpen}
        onClose={onClose}
        branch={props.branch}
       ></UpdateStockModal>
      </Flex>
    );
  };

  export default UpdateStock