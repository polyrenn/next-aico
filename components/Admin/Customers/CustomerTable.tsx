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
} from "@chakra-ui/react";

import { Box, Flex, Spacer } from "@chakra-ui/react";
const fetcher = (url: any) => fetch(url).then((res) => res.json());
const CustomerTable: FC<any> = (props) => {
  const { data, error } = useSWR(
    props.branch ? `/api/Customer/GetCustomers?branch=${props.branch}` : null,
    fetcher,
    {
      onSuccess: (data) => {},
    }
  );
  console.log(data)
  return (
    <TableContainer rounded={8} border="2px solid" borderColor="gray.500">
      <Table variant="striped">
        <TableCaption>Customers</TableCaption>
        <Thead>
          <Tr>
            <Th>Customer Name</Th>
            <Th>Phone</Th>
            <Th>Enlisted At</Th>
            <Th>Total Kg</Th>
            <Th>Total Amount</Th>
            <Th>First Purchase</Th>
            <Th>Last Purchase</Th>
            <Th>Purchase Count</Th>
          </Tr>
        </Thead>
        <Tbody>
           {data?.map((item:any) => 
                <Tr key={item.phone}>
                    <Td>{item.name}</Td>
                    <Td>{item.phone}</Td>
                    <Td>{item.branchId}</Td>
                    <Td></Td>
                    <Td></Td>
                    <Td></Td>
                    <Td></Td>
                    <Td>{item.purchaseCount}</Td>
                </Tr>
           )}
          </Tbody>
        <Tfoot>
        <Tr>
            <Th>Customer Name</Th>
            <Th>Phone</Th>
            <Th>Enlisted At</Th>
            <Th>Total Kg</Th>
            <Th>Total Amount</Th>
            <Th>First Purchase</Th>
            <Th>Last Purchase</Th>
            <Th>Purchase Count</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};

export default CustomerTable;
