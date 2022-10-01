import React, { FC, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Text,
  HStack,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";


import { Box, Flex, Spacer } from "@chakra-ui/react";
const fetcher = (url: any) => fetch(url).then((res) => res.json());
const PriceList: FC<any> = (props) => {
  const toast = useToast()  
  const { data, error } = useSWR(
    props.branch ? `/api/Prices/GetPriceList?branch=${props.branch}` : null,
    fetcher,
    {
      onSuccess: (data) => {},
    }
  );

  const deleteCategory = async (category:string, branch:number) => {
    const res = await fetch(`/api/Prices/DeleteCategory?branch=${props.branch}&category=${category}`, {
        method: 'post',
      }).then( (res) => {
        if(res.ok) {
            toast({
                title: 'Category Deleted.',
                description: `Category Deleted Successfully. `,
                status: 'success',
                duration: 5000,
                isClosable: true,
              })
        } else {
            toast({
                title: 'Error',
                description: "An Error Has Occured.",
                status: 'error',
                duration: 10000,
                isClosable: true,
              })
        }
        
    }
      )
  }

  return (
    <TableContainer rounded={8} border="2px solid" borderColor="gray.500">
      <Table variant="striped">
        <TableCaption>Stock Records</TableCaption>
        <Thead>
          <Tr>
            <Th>#</Th>
            <Th>Category</Th>
            <Th>Details</Th>
            <Th>Manage</Th>
          </Tr>
        </Thead>
        <Tbody>
            {data?.map((item:any, counter:any) => (
              <Tr key={counter}>
                <Td>{counter}</Td>
                <Td>
                    <Flex>
                        <Text
                        fontSize={'sm'}
                        fontWeight={500}
                        bg="cyan.50"
                        p={2}
                        px={4}
                        color={'cyan.900'}
                        rounded={'md'}
                        >{item.category} {item.pricePerKg}</Text>
                    </Flex>
                </Td>
                <Td>{item.availableKgs.map((kg:number) =>(
                    <Flex key={kg} mb={2} justify="space-between">
                        <Text>{kg} Kg </Text>
                        <Text>{(kg * item.pricePerKg).toLocaleString("en-US") } NGN</Text>
                    </Flex>
                    
                ) )}</Td>
                <Td><Button onClick={() => deleteCategory(item.category, item.branch)} colorScheme="red">Delete Category</Button></Td>
              </Tr>
            ))}
          </Tbody>
        <Tfoot>
        <Tr>
            <Th>#</Th>
            <Th>Category</Th>
            <Th>Details</Th>
            <Th>Manage</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};

export default PriceList
