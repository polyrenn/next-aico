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

 const computeTotalAmount = (arr:any) => {
  let res = 0;
  for(let i = 0; i < arr.length; i++){
     arr[i] == null ? 0 : res += arr[i]?.amount
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
             <Td >{item.kg} KG</Td>
             <Td >{item.quantity}</Td> 
             <Td >{item.total} KG</Td> 

          
             <Td  isNumeric>{item.amount} NGN</Td>
           </Tr>
        )}

        <Tr fontWeight="600">
            
            <Th>Total</Th>
            <Td >{`${computeTotalQty(props.summary)}`}</Td>

            <Td >{`${computeTotal(props.summary)}`} KG</Td>
            <Td  isNumeric>{`${computeTotalAmount(props.summary)}`} NGN</Td>

           {/* <Td  isNumeric>{props.pricePerKg ? `${Math.ceil((props.pricePerKg * computeTotalAmount(props.summary)) /10 ) * 10}`: props.summary[0]?.amount} NGN</Td> */}
        </Tr>
          
          
    
     
      
    </Tbody>
  </Table>
</TableContainer>
    )
}

export default CrbTable