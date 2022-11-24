import { Box, HStack, Text, Alert, Flex } from "@chakra-ui/react";
import { FC } from "react";


import useSWR from "swr";
const fetcher = (url:string) => fetch(url).then((res) => res.json())
interface SwitchProps {
    date: any
    branch: any
}
const SwitchLog:FC<SwitchProps> = (props) => {
    const { data:switchLog, error:switchError } = useSWR(`/api/Common/SwitchLog?date=${new Date(props.date).toISOString()}&branch=${props.branch}`, fetcher, {
        onSuccess: (data) => {
         
    }});
    //Map Switch Log      
    return (
        <Box display={switchLog && switchLog?.length < 1 ? 'none' : 'block'}>
             <Flex w="max-content">
         {switchLog?.map((item:any) => 
            <Flex color="red.500" flexFlow="row wrap" fontWeight={500} key={item.id}>
            <Text mr={1}> Previous Tank: {item.meta[0]?.old_name}</Text>
            <Text mr={1}>|</Text>
            <Text mr={1}>Opening Stock: {item.meta[0]?.opening_old}</Text>
            <Text mr={1}>|</Text>
            <Text mr={1}>Balance Stock: {item.meta[0]?.loss}</Text>
            <Text mr={1}>|</Text>
            <Text mr={1}>Kg Sold: {item.meta[0]?.total_kg}</Text>
           </Flex>
         )}
        </Flex>
        </Box>
       
    )
}

export default SwitchLog