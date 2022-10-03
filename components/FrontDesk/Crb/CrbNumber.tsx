import { FC } from "react"
import { Center, Spinner, Box, Button, useColorModeValue, Text } from "@chakra-ui/react"
import useSWR from "swr"
import { useState } from "react"

const CrbNumber:FC<any> = (props) => {
    // Crb Number Should Be #1 on no data
    const getData = async (id: number) => {
       return 5
     };

     const [number, setNumber] = useState<number>(0)

     const fetcher = (url:string) => fetch(url).then((res) => res.json())
     const { data, error } = useSWR('/api/dummycrb', fetcher, {
       onSuccess: (data) => {

       }
     });
   
   // if(!data) return <Center><Spinner></Spinner></Center>
     
   
   
     return (
       <Text fontSize={'sm'}
       fontWeight={500}
       bg={useColorModeValue('cyan.50', 'cyan.900')}
       p={2}
       px={4}
       my={2}
       width="fit-content"
       color={'cyan.900'}
       rounded={'md'}> CRB #{data ? data?.crbNumber + 1: 1}</Text>
     )
}

export default CrbNumber