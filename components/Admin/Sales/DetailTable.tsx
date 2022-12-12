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
    Button,
    Box
  } from '@chakra-ui/react'

type Summary = {
    kg: string,
    amount: number,
    total: number,
}  

interface TableProps {
    summary: any

}  

const DetailTable:FC<TableProps> = (props) => {
    const computeTotal = (arr:any) => {
    let res = 0;
    for(let i = 0; i < arr.length; i++){
       res += arr[i].description.total;
    };
    return res;
 };

 const computeTotalQty = (arr:any) => {
  let res = 0;
  for(let i = 0; i < arr.length; i++){
     res += arr[i].quantity;
  };
  return res;
};
    return (
        <TableContainer rounded={8} border='2px solid' borderColor='gray.500'>
  <Table variant='simple'>
    <TableCaption>Details</TableCaption>
    <Thead>
    <Tr>
        <Th>Kg</Th>
        <Th>Qty</Th>
        <Th>Total Kg</Th>
        <Th isNumeric>Amount</Th>
      </Tr>
    </Thead>
    <Tbody>
   

       
    {props.summary.map((item:any, counter:number) => 
            item.description.map( (inner:any, counter:number) => 
            <Tr key={counter}>
            <Td>{inner.kg} KG</Td>
             <Td>{inner.quantity}</Td> 
             <Td>{inner.total} KG</Td> 
             <Td isNumeric>{inner.amount} NGN</Td>
          </Tr>
            )
            
        )}

        {props.summary.map((item:any, counter:number) => 
             <Tr key={counter}>
             <Th>Total</Th>
             <Td>{`${computeTotalQty(item.description)}`}</Td>
             <Td>{item.total_kg} KG</Td>
             <Td isNumeric>{item.amount} NGN</Td>
         </Tr>
        )}
          
    
     
      
    </Tbody>
    <Tfoot>
        <Tr>
        <Th>Kg</Th>
        <Th>Qty</Th>
        <Th>Total Kg</Th>
        <Th isNumeric>Amount</Th>
      </Tr>
    </Tfoot>
  </Table>
</TableContainer>


    )
}

export default DetailTable