import { FC } from "react"
import { Center, Spinner, Box, Button, useColorModeValue } from "@chakra-ui/react"
import useSWR from "swr"
import { useState } from "react"

const Queue:FC<any> = (props) => {

    const getData = async (id: number) => {
       return 5
     };

    const [number, setNumber] = useState<number>(0)
  
    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { data, error } = useSWR('/api/FrontDesk/FetchQueue', fetcher, {
      onSuccess: (data) => {
        setNumber(data.id)
      }
    });
  
    if(!data) return <Center><Spinner></Spinner></Center>
    
  
  
    return (
       <Box>
      {
        data.map((item:any, counter:number) => 
        <Button
            onClick={() => getData(item.id)}
            fontSize={"sm"}
            fontWeight={500}
            bg={useColorModeValue("cyan.50", "cyan.900")}
            px={4}
            color={"cyan.900"}
            rounded={"md"}
          >
            {item.id}
          </Button>
     
    )}
    </Box>
    );
}

export default Queue