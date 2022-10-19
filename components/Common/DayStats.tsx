import { Box, HStack, Text, Flex, Alert, Stack } from "@chakra-ui/react";
import { FC } from "react";


import useSWR from "swr";
const fetcher = (url:string) => fetch(url).then((res) => res.json())
interface DayProps {
    date: any
    branch: any
}
const DayStats:FC<DayProps> = (props) => {
    const { data:dayStats, error:statError } = useSWR(`/api/Common/DayStats?date=${new Date(props.date).toISOString()}&branch=${131313}`, fetcher, {
        onSuccess: (data) => {
         
    }});
    //Map Switch Log      
    return (
        <Flex flexFlow="column wrap" py={4}>
         {dayStats?.map((item:any) => 
            <Flex flexFlow="row wrap" fontWeight={500} key={item.id}>
            <Text mb={1} mr={1}>Load Number : {item.load_number}</Text>
            <Text>✳︎</Text>
            <Text mb={1} mr={1}>Balance Stock: {item.closing_stock}</Text>
            <Text>✳︎</Text>
            <Text mb={1} mr={1}>Kg Sold: {item.total_kg}</Text>
            <Text>✳︎</Text>
            <Text mb={1} mr={1}>Opening Stock: {item.opening_stock}</Text>
            <Text>✳︎</Text>
            <Text mb={1} mr={1}>Sales Count: {item.sales_count}</Text>
           </Flex>
         )}
        </Flex>
    )
}

export default DayStats