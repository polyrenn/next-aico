import { FC } from "react"
import { Center, Spinner, Box, Button, useColorModeValue } from "@chakra-ui/react"
import useSWR from "swr"
import { useState } from "react"

const Queue:FC<any> = (props) => {

    const getData = async (id: number) => {
       return 5
     };

    const [number, setNumber] = useState<number>(0)
  
    const fetcher = (url:any) => fetch(url).then((res) => res.json())
    const { data, error } = useSWR('/api/FrontDesk/FetchQueue', fetcher, {
      onSuccess: async (data) => {
        const resCrb = await fetch(`/api/Customer/IsRegistered?id=${data.customerId}`, {
          method: 'post',
          body: JSON.stringify(data.customerId),
        }).then( (res) => {
      
          if(res.ok) {
            res.json()
          } 
          
      }
        ).then((data) => {
          console.log(data)
        })
      
      }
    });
  
    if(!data) return <Center><Spinner></Spinner></Center>
    
  
  
    return (
       <Box mr={2}>
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
            {item.crbNumber}
          </Button>
     
    )}
    </Box>
    );
}

export default Queue