//Layout Imports
import { Stack, HStack, Box, Button } from "@chakra-ui/react";
//Element Imports
import { Text } from "@chakra-ui/react";
//React Imports
import { FC, useEffect, useState } from "react";
//Utility Imports
import { useColorModeValue } from "@chakra-ui/react";
import useSWR from "swr";
import { useDisclosure  } from "@chakra-ui/react";
import UpdatePrice from "./UpdatePrice";


interface CategoryProps {
  branch: number | undefined;
}

export const colorCode = (item:string) => {
    switch (item) {
        case 'Domestic':
            return 'teal.300'
    
        case 'Dealer':
            return 'green.300'

        case 'Eatery':
            return 'blue.300'
        
        case 'Civil Servant':
            return 'yellow.300'

        case 'Other':
            return 'yellow.300'            
                    
        default:
            break;
    }
}



const fetcher = (url: any) => fetch(url).then((res) => res.json());
const Category: FC<CategoryProps> = (props) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { data, error } = useSWR(
        props.branch ? `/api/Prices/GetCategories?branch=${props.branch}` : null,
        fetcher,
        {
          onSuccess: (data) => {
          },
        }
      );

    useEffect(() => {
        
    })

  return (
    <Box  my={4}>
    <Text mb={1} size="lg" color="gray.500">Price Per Kg</Text>   
    <HStack>
      {data?.map((item: any, counter:number) => (
        <HStack
          key={counter}
          fontSize={"sm"}
          fontWeight={500}
          bg={colorCode(item.category)}
          p={2}
          px={4}
          rounded={"md"}
        >
          <Text>{item.category}</Text>
          <Text>{item.pricePerKg}</Text>
        </HStack>
      ))}
      <Button onClick={onOpen}>Update</Button>
    </HStack>
    <UpdatePrice isOpen={isOpen} onClose={onClose} branch={props.branch}></UpdatePrice>
    </Box>
  );
};

export default Category;
