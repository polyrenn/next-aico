import { FC } from "react"
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
  } from '@chakra-ui/react'

type Summary = {
    kg: string,
    amount: number,
    total: number,
}  

interface TableProps {
    summary: any
    pricePerKg: number

}  

const CrbTable:FC<TableProps> = (props) => {
    return (
        <TableContainer border="1px">
  <Table variant='simple'>
    <TableCaption>Day's Sales</TableCaption>
    <Thead>
      <Tr>
        <Th>Qty</Th>
        <Th>Kg</Th>
        <Th isNumeric>Amount</Th>
      </Tr>
    </Thead>
    <Tbody>
        {props.summary.map((item) => 
             <Tr key={item._id}>
             <Td>{item.amount}</Td> 
             <Td>{item.kg}</Td>
             <Td isNumeric>{item.amount * item.kg * props.pricePerKg}</Td>
           </Tr>
        )}
          
          
    
     
      
    </Tbody>
    <Tfoot>
        <Tr>
        <Th>Qty</Th>
        <Th>Kg</Th>
        <Th isNumeric>Amount</Th>
      </Tr>
    </Tfoot>
  </Table>
</TableContainer>
    )
}

export default CrbTable