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

import { Button } from "@chakra-ui/react";

//Icon Imports
import { RemoveIcon } from "../../Icons/Icons";

//Styles
import styles from "./CrbTable.module.css"


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
    const computeTotal = (arr:any) => {
    let res = 0;
    for(let i = 0; i < arr.length; i++){
       res += arr[i].total;
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
        <TableContainer rounded={8} border='2px solid' borderColor='gray.900'>
  <Table className={styles.receipt} variant='simple'>
    <TableCaption color="#0d0d0d">Proceed to Cashpoint</TableCaption>
    <Thead>
      <Tr>
        <Th >Kg</Th>
        <Th >Qty</Th>
        <Th >Total Kg</Th>
        <Th   isNumeric>Amount</Th>
      </Tr>
    </Thead>
    <Tbody>
        {props.summary.map((item:any, counter:number) => 
             <Tr fontWeight="600" key={counter}>
             {/* <Td><Button
             onClick={() => console.log(counter)  Remove Summary Item & Update Cart }
              bg="red.400" color="white" leftIcon={<RemoveIcon/>} size="sm" rounded="full"></Button></Td>
             */}
             <Td >{item.kg}</Td>
             <Td >{item.quantity}</Td> 
             <Td >{item.total}</Td> 

          
             <Td  isNumeric>{item.amount}</Td>
           </Tr>
        )}

        <Tr fontWeight="600">
            
            <Th>Total</Th>
            <Td >{`${computeTotalQty(props.summary)}`}</Td>

            <Td >{`${computeTotal(props.summary)}`}</Td>
            <Td  isNumeric>{`${computeTotal(props.summary) * props.pricePerKg}`}</Td>
        </Tr>
          
          
    
     
      
    </Tbody>
  </Table>
</TableContainer>
    )
}

export default CrbTable