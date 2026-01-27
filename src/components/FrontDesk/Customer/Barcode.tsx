import { Center, VStack, HStack, Text, Box, Stack, Skeleton } from "@chakra-ui/react";
import { forwardRef, FC } from "react";

interface BarcodeProps {
    name: string,
    phone: string,
    ref: any
}
const Barcode: FC<BarcodeProps> = forwardRef((props, ref) => {

    
  let Barcode = require('react-barcode');
  
  if(props.name == '' && props.phone == '')  return (
    <Stack mb={4}>
    <Skeleton height='20px' />
    </Stack>
  ) 
  
  return (
    <Box ref={ref}>
    <Center>
      
      <VStack>
      { /* 
        <HStack>
          <Text>Name: {props.name}</Text>
          <Text>Phone: {props.phone}</Text>
        </HStack>
      */}
        <Barcode
          height={48}
          value={`${props.phone.slice(-3)}` + `${props.name.slice(-3).toUpperCase()}`}
        ></Barcode>
      </VStack>
    </Center>
    </Box>
  );
});

export default Barcode;
