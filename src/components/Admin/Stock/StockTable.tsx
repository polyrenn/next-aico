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
const StockTable: FC<any> = (props) => {
  const { data, error } = useSWR(
    props.branch ? `/api/Stock/GetStocks?id=${props.branch}` : null,
    fetcher,
    {
      onSuccess: (data) => {},
    }
  );
  return (
    <TableContainer rounded={8} border="2px solid" borderColor="gray.500">
      <Table variant="striped">
        <TableCaption>Stock Records</TableCaption>
        <Thead>
          <Tr>
            <Th>#</Th>
            <Th>Date</Th>
            {/* <Th>Load Number</Th> */}
            <Th>Tank</Th>
            <Th>Supply Cost</Th>
            {/*  <Th>Offload Type</Th> */}
            <Th>Total Kg</Th>
          </Tr>
        </Thead>
        <Tbody>
            {data?.map((item:any, counter:any) => (
              <Tr key={item._id}>
                <Td>{counter}</Td>
                <Td>{item.date.split('T')[0]}</Td>
                <Td>{item.designation}</Td>
                <Td>{item.value.toLocaleString('en-US')}</Td>
                <Td>{item.kg.toLocaleString('en-US')}</Td>
              </Tr>
            ))}
          </Tbody>
        <Tfoot>
          <Tr>
            <Th>#</Th>
            <Th>Date</Th>
            {/*   <Th>Load Number</Th> */}
            <Th>Tank</Th>
            <Th>Supply Cost</Th>
            {/*   <Th>Offload Type</Th> */}
            <Th>Total Kg</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};

export default StockTable;
