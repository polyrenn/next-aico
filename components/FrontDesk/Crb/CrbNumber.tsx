import { FC } from "react"
import { Center, Spinner, Box, Button, useColorModeValue, Text } from "@chakra-ui/react"
import useSWR from "swr"
import { useState, useContext } from "react"
import { BranchContext } from "../../../pages/FrontDesk/Crb"

const CrbNumber:FC<any> = (props) => {
    // Crb Number Should Be #1 on no data
    const getData = async (id: number) => {
       return 5
     };

     const { branchId: branch } = useContext(BranchContext) as any

     const [number, setNumber] = useState<number>(0)

     const fetcher = (url:string) => fetch(url).then((res) => res.json())
     const { data, error } = useSWR(`/api/dummycrb?id=${branch}`, fetcher, {
       onSuccess: (data) => {

       }
     });
   
   // if(!data) return <Center><Spinner></Spinner></Center>
     
   
   
     return (
       <Text fontSize={'lg'}
       fontWeight={700}
       borderWidth={'1px'}
       p={2}
       px={4}
       my={2}
       width="fit-content"
       color={'gray.900'}
       rounded={'md'}> CRB #{data ? data?.crbNumber + 1: 1}</Text>
     )
}

export default CrbNumber