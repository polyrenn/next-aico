import React, { FC, useEffect, useState } from "react";
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
  Button
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";

import { Box, Flex, Spacer } from "@chakra-ui/react";
import { Staff } from "@prisma/client";
const fetcher = (url: any) => fetch(url).then((res) => res.json());
type MyFnType = () => void;
type UserChange = (user: string) => void;
interface TableProps {
    branch: number | undefined,
    staff: Staff[]
    onOpenEdit: MyFnType
    userChange: UserChange
}
const StaffTable: FC<TableProps> = (props) => {

  const toast = useToast()  
  const { data, error } = useSWR(
    props.branch ? `/api/Customer/GetCustomers?branch=${props.branch}` : null,
    fetcher,
    {
      onSuccess: (data) => {},
    }
  );

  const handleEditClick = (user:string) => {
    props.onOpenEdit()
    props.userChange(user)
  }

  const deleteStaff = async (username:string) => {
    const res = await fetch(`/api/Staff/DeleteStaff?username=${username}`, {
        method: 'post',
      }).then( (res) => {
        if(res.ok) {
            toast({
                title: 'Staff Deleted.',
                description: `Staff Deleted Successfully. `,
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
  console.log(data)
  return (
    <TableContainer rounded={8} border="2px solid" borderColor="gray.500">
      <Table variant="striped">
        <TableCaption>Staffs</TableCaption>
        <Thead>
          <Tr>
            <Th>Designation</Th>
            <Th>Username</Th>
            <Th>Company</Th>
            <Th>Branch Id</Th>
            <Th>Branch Name</Th>
            <Th>Password</Th>
            <Th></Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
            {props.staff.map((item) => 
                <Tr>
                    <Td>{item.role}</Td>
                    <Td>{item.username}</Td>
                    <Td>{item.companyID}</Td>
                    <Td>{item.branchId}</Td>
                    <Td></Td>
                    <Td></Td>
                    <Td></Td>
                    <Td>
                        <Button onClick={() => deleteStaff(item.username)} colorScheme="red">Delete</Button>
                    </Td>
                    <Td>
                        <Button onClick={() => handleEditClick(item.username)}>Edit Password</Button>
                    </Td>
                </Tr>
            )}
          </Tbody>
        <Tfoot>
        <Tr>
            <Th>Designation</Th>
            <Th>Username</Th>
            <Th>Company</Th>
            <Th>Branch Id</Th>
            <Th>Branch Name</Th>
            <Th>Password</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};

export default StaffTable;
