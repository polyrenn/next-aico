import { Box, HStack, Text, Flex, Alert, Stack } from "@chakra-ui/react";
import { FC } from "react";


import useSWR from "swr";
const fetcher = (url:string) => fetch(url).then((res) => res.json())
interface DayProps {
    date: any
    branch: any,
    margin: boolean
}
const DayStats:FC<DayProps> = (props) => {
    const date = new Date(props.date)
    const { data:dayStats, error:statError } = useSWR(`/api/Common/DayStats?date=${date.toISOString()}&branch=${props.branch}`, fetcher, {
        onSuccess: (data) => {
    }});
    //Map Day Stats     
    return (
        <Flex color="teal.500" fontSize={18} flexFlow="column wrap" py={props.margin ? 4 : 0}>
         {dayStats?.map((item:any) => 
            <Flex flexFlow="row wrap" fontWeight={500} key={item.id}>
            <Text mb={1} mr={1}>Load Number : {item.load_number}</Text>
            <Text mr={1}>|</Text>  
            <Text mb={1} mr={1}>Current Tank: {item.current_desig}</Text>
            <Text mr={1}>|</Text>
            <Text mb={1} mr={1}>Opening Stock: {item.opening_stock}</Text>
            <Text mr={1}>|</Text>
            <Text mb={1} mr={1}>Balance Stock: {item.closing_stock}</Text>
            <Text mr={1}>|</Text>
            <Text mb={1} mr={1}>Kg Sold: {item.total_kg}</Text>
            <Text mr={1}>|</Text>
            <Text mb={1} mr={1}>Sales Count: {item.sales_count}</Text>
           </Flex>
         )}
        </Flex>
    )
}

export default DayStats