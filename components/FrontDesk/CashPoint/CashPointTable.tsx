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

const CashPointTable:FC<TableProps> = (props) => {
    const computeTotal = (arr:any) => {
    let res = 0;
    for(let i = 0; i < arr.length; i++){
       res += arr[i].description.total;
    };
    return res;
 };
    return (
        <TableContainer rounded={8} border='2px solid' borderColor='gray.500'>
  <Table variant='simple'>
    <TableCaption>Proceed to Cashpoint</TableCaption>
    <Thead>
      <Tr>
        <Th>Qty</Th>
        <Th>Kg</Th>
        <Th isNumeric>Amount</Th>
      </Tr>
    </Thead>
    <Tbody>
    {props.summary.map((item:any, counter:number) => 
            item.description.map( (inner:any, counter:number) => 
            <Tr key={counter}>
            <Td>{inner.quantity}</Td> 
            <Td>{inner.kg}</Td>
            <Td isNumeric>{inner.amount}</Td>
          </Tr>
            )
            
        )}

        {props.summary.map((item:any, counter:number) => 
             <Tr key={counter}>
             <Th>Total</Th>
             <Td>{item.totalKg}</Td>
             <Td isNumeric>{item.amount}</Td>
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

export default CashPointTable