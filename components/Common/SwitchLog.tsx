import { Box, HStack, Text, Alert, Flex } from "@chakra-ui/react";
import { FC } from "react";


import useSWR from "swr";
const fetcher = (url:string) => fetch(url).then((res) => res.json())
interface SwitchProps {
    date: any
    branch: any
}
const SwitchLog:FC<SwitchProps> = (props) => {
    const { data:switchLog, error:switchError } = useSWR(`/api/Common/SwitchLog?date=${new Date(props.date).toISOString()}&branch=${131313}`, fetcher, {
        onSuccess: (data) => {
         
    }});
    //Map Switch Log      
    console.log(switchLog == [] ? 'Hey' : 'No')
    return (
        <Box display={switchLog == [] ? 'none' : 'block'}>
             <Flex p={4} w="max-content" bg="yellow.100">
         {switchLog?.map((item:any) => 
            <Flex flexFlow="row wrap" fontWeight={500} key={item.id}>
            <Text> Switched To: {item.meta[0]?.switchedTo}</Text>
            ✳︎
            <Text>Loss: {item.meta[0]?.loss}</Text>
            ✳︎
            <Text>Kg Sold: {item.meta[0]?.total_kg}</Text>
            ✳︎
            <Text>Opening Stock: {item.meta[0]?.opening_old}</Text>
           </Flex>
         )}
        </Flex>
        </Box>
       
    )
}

export default SwitchLog