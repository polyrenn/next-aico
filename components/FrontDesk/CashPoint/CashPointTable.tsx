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

//Styles
import styles from "./CrbTable.module.css"

const CashPointTable:FC<TableProps> = (props) => {
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
  <Table className={styles.receipt} variant='simple'>
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
             <Td isNumeric>{inner.amount?.toLocaleString()} NGN</Td>
          </Tr>
            )
            
        )}

        {props.summary.map((item:any, counter:number) => 
             <Tr className={styles.total} key={counter}>
             <Th>Total</Th>
             <Td>{`${computeTotalQty(item.description)}`}</Td>
             <Td>{item.totalKg} KG</Td>
             <Td isNumeric>{item.amount?.toLocaleString()} NGN</Td>
         </Tr>
        )}
       
 
    </Tbody>
  </Table>
</TableContainer>


    )
}

export default CashPointTable