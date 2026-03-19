import React, { useState, useMemo } from "react";
import Head from "../../components/head";
import WithSubnavigation from "../../components/Navigation/FrontDesk";
import AdminNav from "../../components/Navigation/Admin";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  Button,
  Select as ChakraSelect,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { DownloadIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { withSessionSsr } from "@/lib/withSession";
import { prisma } from "@/lib/prisma";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PageProps {
  user: {
    id: number;
    username: string;
    role: string;
    admin: boolean;
    company: number;
    branch: number;
  };
  branch: {
    address: string;
    branchId: number;
    name: string;
  };
  company: {
    name: string;
    companyId: number;
  };
  branches: {
    branchId: number;
    name: string;
  }[];
}

// Inner component to use react-query hooks
function ReportsContent(props: PageProps) {
  const [toggled, setToggled] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [reportType, setReportType] = useState("daily");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [startDate, setStartDate] = useState(dayjs().startOf("day").format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(dayjs().endOf("day").format("YYYY-MM-DD"));
  
  const toast = useToast();

  const handleToggleClose = (value: boolean) => setToggled(value);
  const handleCollapsedChange = (value: boolean) => setCollapsed(value);
  const handleToggleSidebar = (value: boolean) => setToggled(value);

  // 1. Data Fetching
  const { data, isLoading, error } = useQuery({
    queryKey: ['reportsSummary', reportType, selectedBranch, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams({
        reportType,
        branchId: selectedBranch,
        startDate,
        endDate
      });
      const res = await fetch(`/api/Admin/Reports/Summary?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch report data");
      return res.json();
    }
  });

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);

  // 2. Export Logic: Excel
  const handleExportExcel = () => {
    if (!data) return;
    try {
      const branchesData = data.branches.map((b: any) => ({
        "Branch Name": b.name,
        "Transactions": b.transactionCount,
        "KG Sold": b.totalKg,
        "Total Revenue (NGN)": b.totalAmount
      }));

      // Add Total Row
      const totalRow = {
        "Branch Name": "TOTAL (CUMULATIVE)",
        "Transactions": data.summary.transactionCount,
        "KG Sold": data.summary.totalKg,
        "Total Revenue (NGN)": data.summary.totalAmount
      };

      const ws = XLSX.utils.json_to_sheet([...branchesData, {}, totalRow]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sales Summary");
      XLSX.writeFile(wb, `AicoGas_Report_${dayjs().format('YYYY-MM-DD')}.xlsx`);
    } catch (err) {
      toast({ title: "Excel export failed", status: "error" });
    }
  };

  // 3. Export Logic: PDF
  const handleExportPDF = () => {
    if (!data) return;
    try {
      const doc = new jsPDF();
      
      // Helper to format currency for PDF (Avoid Naira symbol which breaks in jsPDF)
      const pdfCurrency = (val: number) => `NGN ${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

      doc.setFontSize(18);
      doc.text(`${props.company.name} - Sales Report`, 14, 22);
      doc.setFontSize(11);
      doc.text(`Period: ${data.period.type.toUpperCase()} (${dayjs(data.period.start).format('DD/MM/YYYY')} - ${dayjs(data.period.end).format('DD/MM/YYYY')})`, 14, 30);
      
      const tableData = data.branches.map((b: any) => [
        b.name,
        b.transactionCount,
        `${b.totalKg.toLocaleString()} KG`,
        pdfCurrency(b.totalAmount)
      ]);

      // Add Total Row to PDF
      tableData.push([
        "TOTAL (CUMULATIVE)",
        data.summary.transactionCount,
        `${data.summary.totalKg.toLocaleString()} KG`,
        pdfCurrency(data.summary.totalAmount)
      ]);

      autoTable(doc, {
        startY: 40,
        head: [['Branch', 'Transactions', 'KG Sold', 'Revenue']],
        body: tableData,
        foot: [['', '', '', '']], // Placeholder for spacing
        didParseCell: (data) => {
          if (data.row.index === tableData.length - 1) {
             data.cell.styles.fontStyle = 'bold';
             data.cell.styles.fillColor = [240, 240, 240];
          }
        }
      });

      doc.save(`AicoGas_Report_${dayjs().format('YYYYMMDD')}.pdf`);
    } catch (err) {
      toast({ title: "PDF export failed", status: "error" });
    }
  };

  return (
    <Flex height="100vh" width="100vw" overflow="hidden">
      <Head title="Admin - Reports" />
      
      <Box height="100%" display={{ base: toggled ? "block" : "none", md: "block" }}>
        <AdminNav 
          handleToggleClose={handleToggleClose} 
          toggled={toggled} 
          collapsed={collapsed} 
          company={props.company} 
        />
      </Box>

      <Box flex="1" overflowY="auto" bg="gray.50">
        <WithSubnavigation 
          user={props.user} 
          handleCollapsedChange={handleCollapsedChange} 
          handleToggleSidebar={handleToggleSidebar} 
          branch={props.branch} 
        />

        <Box p={6}>
          <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "flex-start", md: "center" }} mb={6}>
            <Box mb={{base: 4}}>
              <Heading size="lg" color="gray.700">Management Reports</Heading>
              <Text color="gray.500">Weekly and Monthly sales accumulation summary</Text>
            </Box>
            <HStack spacing={4}>
              <Button 
                onClick={handleExportExcel}
                leftIcon={<DownloadIcon />} 
                colorScheme="green" 
                variant="outline" 
                size="sm"
                isDisabled={!data}
              >
                Export Excel
              </Button>
              <Button 
                onClick={handleExportPDF}
                leftIcon={<DownloadIcon />} 
                colorScheme="red" 
                variant="outline" 
                size="sm"
                isDisabled={!data}
              >
                Export PDF
              </Button>
            </HStack>
          </Flex>

          {/* Filters */}
          <Box bg="white" p={4} rounded="xl" shadow="sm" mb={8} border="1px" borderColor="gray.100">
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} alignContent="center">
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="gray.400" mb={1} ml={1}>PERIOD</Text>
                <ChakraSelect 
                  value={reportType} 
                  onChange={(e) => setReportType(e.target.value)}
                  icon={<ChevronDownIcon />}
                  bg="gray.50"
                  size="md"
                >
                  <option value="daily">Daily Summary</option>
                  <option value="weekly">Weekly Accumulation</option>
                  <option value="monthly">Monthly Total</option>
                  <option value="custom">Custom Range</option>
                </ChakraSelect>
              </Box>
              
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="gray.400" mb={1} ml={1}>BRANCH</Text>
                <ChakraSelect 
                  value={selectedBranch} 
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  bg="gray.50"
                >
                  <option value="all">All Branches (Cumulative)</option>
                  {props.branches.map(b => (
                    <option key={b.branchId} value={b.branchId}>{b.name}</option>
                  ))}
                </ChakraSelect>
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="bold" color="gray.400" mb={1} ml={1}>START DATE</Text>
                <Input 
                  type="date" 
                  bg="gray.50" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  isDisabled={reportType !== "custom"}
                />
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="bold" color="gray.400" mb={1} ml={1}>END DATE</Text>
                <Input 
                  type="date" 
                  bg="gray.50" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  isDisabled={reportType !== "custom"}
                />
              </Box>
            </SimpleGrid>
          </Box>

          {isLoading ? (
            <Flex justify="center" align="center" h="40vh">
              <Spinner size="xl" color="blue.500" thickness="4px" />
            </Flex>
          ) : error ? (
            <Flex justify="center" align="center" h="40vh">
              <Text color="red.500">Failed to load reports. Please try again.</Text>
            </Flex>
          ) : (
            <>
              {/* Stat Cards */}
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
                <Stat p={5} shadow="sm" border="1px" borderColor="gray.100" rounded="xl" bg="white">
                  <StatLabel color="gray.500" fontWeight="medium">Total Revenue</StatLabel>
                  <StatNumber fontSize="3xl" color="blue.600">{formatCurrency(data?.summary.totalAmount || 0)}</StatNumber>
                  <StatHelpText>
                    <Text as="span" color="green.500" fontWeight="bold">POS: {formatCurrency(data?.summary.posTotal)}</Text> | <Text as="span" color="blue.500">Cash: {formatCurrency(data?.summary.cashTotal)}</Text>
                  </StatHelpText>
                </Stat>

                <Stat p={5} shadow="sm" border="1px" borderColor="gray.100" rounded="xl" bg="white">
                  <StatLabel color="gray.500" fontWeight="medium">Total Gas Sold</StatLabel>
                  <StatNumber fontSize="3xl" color="orange.500">{(data?.summary.totalKg || 0).toLocaleString()} KG</StatNumber>
                  <StatHelpText>Cumulative volume across plants</StatHelpText>
                </Stat>

                <Stat p={5} shadow="sm" border="1px" borderColor="gray.100" rounded="xl" bg="white">
                  <StatLabel color="gray.500" fontWeight="medium">Total Transactions</StatLabel>
                  <StatNumber fontSize="3xl" color="purple.500">{data?.summary.transactionCount || 0}</StatNumber>
                  <StatHelpText>Total invoices created</StatHelpText>
                </Stat>
              </SimpleGrid>

              {/* Detailed Table */}
              <Box bg="white" rounded="xl" shadow="sm" border="1px" borderColor="gray.100" overflow="hidden">
                <Box p={4} borderBottom="1px" borderColor="gray.100" bg="gray.50/50" display="flex" justifyContent="space-between" alignItems="center">
                  <Heading size="sm">Branch Performance Breakdown</Heading>
                  <Text fontSize="xs" color="gray.400" fontWeight="bold">
                    {dayjs(data?.period.start).format('MMM DD')} - {dayjs(data?.period.end).format('MMM DD, YYYY')}
                  </Text>
                </Box>
                <TableContainer>
                  <Table variant="simple">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th>Branch / Plant</Th>
                        <Th isNumeric>Transactions</Th>
                        <Th isNumeric>KG Sold</Th>
                        <Th isNumeric>Revenue</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.branches.map((branch: any) => (
                        <Tr key={branch.branchId} _hover={{ bg: "blue.50" }} transition="0.2s">
                          <Td fontWeight="bold" color="gray.700">{branch.name}</Td>
                          <Td isNumeric>{branch.transactionCount}</Td>
                          <Td isNumeric fontWeight="medium" color="orange.600">{branch.totalKg.toLocaleString()} KG</Td>
                          <Td isNumeric fontWeight="bold" color="blue.600">{formatCurrency(branch.totalAmount)}</Td>
                        </Tr>
                      ))}
                      {/* Total Row */}
                      <Tr bg="gray.50" fontWeight="extrabold">
                        <Td>TOTAL (CUMULATIVE)</Td>
                        <Td isNumeric>{data?.summary.transactionCount}</Td>
                        <Td isNumeric>{(data?.summary.totalKg || 0).toLocaleString()} KG</Td>
                        <Td isNumeric color="blue.700" fontSize="lg">{formatCurrency(data?.summary.totalAmount)}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Flex>
  );
}

const queryClient = new QueryClient();

export default function ReportsPage(props: PageProps) {
  return (
    <QueryClientProvider client={queryClient}>
        <ReportsContent {...props} />
    </QueryClientProvider>
  )
}

export const getServerSideProps = withSessionSsr(async function({ req }) {
  const user = req.session.user;

  if (!user || (user.role !== 'Admin' && user.role !== 'Supervisor')) {
    return {
      redirect: { destination: '/Login', permanent: false },
    };
  }

  const branch = await prisma.branch.findFirst({
    where: { branchId: user.branch },
    select: { address: true, branchId: true, name: true }
  });

  const company = await prisma.company.findFirst({
    where: { companyId: user.company },
    select: { name: true, companyId: true }
  });

  const branches = await prisma.branch.findMany({
    where: user.role === 'Supervisor' ? { companyID: user.company } : {},
    select: { branchId: true, name: true }
  });

  return {
    props: {
      user,
      branch: branch || { address: "", branchId: 0, name: "Unknown" },
      company: company || { name: "Unknown", companyId: 0 },
      branches
    }
  };
});
