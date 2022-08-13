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

const StatBlock:FC = () => {
    // Refactor to Singular Stat With Props Suffix 
    return (
        <StatGroup>
        <CustomStat label='Opening Stock' statNumber={12345} helper='KG'></CustomStat>
        <CustomStat label='Balance Stock' statNumber={12345} helper='KG'></CustomStat>
        <CustomStat label='KG Sold' statNumber={12345} helper='KG'></CustomStat>
        <CustomStat label='Sales Count' statNumber={12345} helper='Count'></CustomStat>
        </StatGroup>
    )
}

export default StatBlock