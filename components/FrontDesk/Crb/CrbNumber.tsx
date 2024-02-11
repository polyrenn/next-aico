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

     const fetcher = async (url:string) => {
      const res = await fetch(url)
    
      // If the status code is not in the range 200-299,
      // we still try to parse and throw it.
      if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.')
        // Attach extra info to the error object.
        props.error(true)
        throw error
      }
      props.error(false)
      return res.json()
    }
     const { data, error } = useSWR(`/api/dummycrb?id=${branch}`, fetcher);

   
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