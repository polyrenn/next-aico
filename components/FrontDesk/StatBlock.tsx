import { Box, HStack } from "@chakra-ui/react";
import { FC } from "react";
import CustomStat from "./Stat";
import {
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
} from '@chakra-ui/react'

import useSWR from "swr";
const fetcher = (url:string) => fetch(url).then((res) => res.json())
const StatBlock:FC<any> = (props) => {
    // Refactor to Singular Stat With Props Suffix
    const { data, error } = useSWR('/api/Common/Stats', fetcher, {
        onSuccess: (data) => {
         console.log(data)
        }
      });
    return (
        <StatGroup>
        <CustomStat label='Opening Stock' statNumber={data ? data[0].opening_stock: null} helper='KG'></CustomStat>
        <CustomStat label='Balance Stock' statNumber={data ? data[0].balance_stock: null} helper='KG'></CustomStat>
        <CustomStat label='KG Sold' statNumber={data ? data[0].total_kg: 0} helper='KG'></CustomStat>
        <CustomStat label='Sales Count' statNumber={data ? data[0].sales_count: null} helper='Count'></CustomStat>
        </StatGroup>
    )
}

export default StatBlock