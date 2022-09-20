import Link from 'next/link';
import Head from '../components/head';
import Nav from '../components/nav';
import WithSubnavigation  from '../components/Navigation/FrontDesk';
import { Box, Button, Text, Select } from '@chakra-ui/react';
import { useState } from 'react';
import { GetServerSideProps } from 'next';

export default (props) => {
  
  const [currentBranch, setCurrentBranch] = useState({})

  console.log(currentBranch)

  const handleChange = (branch) => {
      setCurrentBranch(branch)
      console.log(branch.tank)
  }

  const arrOfObjs = [
    {
      branch: "Airport",
      branchId: 141414,
      tankID: 242424,
      tanks: ["TankAirA", "TankAirB"]
    },
    {
      branch: "Ugbor",
      branchId: 363636,
      tankID: 646466,
      tanks: ["TankUgbA", "TankUgbB"]
    },

    {
      branch: "Aduwawa",
      branchId: 734244,
      tankID: 266524,
      tanks: ["TankWawaA", "TankWawaB"]
    },
  ]

  return(
  <div>
    <WithSubnavigation branch={props.branch}></WithSubnavigation>
    <Head title="Home" />
    <Nav />
    <Box mx={8} className="hero">
      <h1 className="title">Welcome to Create Next App (Create Next.js App building tools)</h1>
      <p className="description">To get started, edit <code>pages/index.js</code> and save to reload.</p>
      <div className="row">
        <Link href="//nextjs.org/docs/">
          <a className="card">
            <h3>Getting Started &rarr;</h3>
            <p>Learn more about Next.js on official website</p>
          </a>
        </Link>
        <Link href="//github.com/create-next-app/create-next-app">
          <a className="card">
            <h3>Create Next App&rarr;</h3>
            <p>Was this tools helpful?</p>
          </a>
        </Link>
      </div>
    </Box>

    <Text>{currentBranch.branch}</Text>

    <Box>
      {arrOfObjs.map((item, counter) => 
            <Button variant="outline" onClick={() => handleChange(item)} mx={4} key={counter}>
                {item.branch}
            </Button>
        )}
    </Box>

    <Box>
      <Select
      placeholder="Tank"
      width="300px"
      onChange={(e) => console.log(e.target.value)}
      >
         {currentBranch?.tanks?.map((item, counter) => 
           <option value={item}>{item}</option>
        )}
      </Select>
    </Box>

    <style jsx>{`
      .hero {
        width: 100%;
        color: #333;
      }
      .title {
        margin: 0;
        width: 100%;
        padding-top: 80px;
        padding-bottom: 12px;
        line-height: 1.15;
        font-size: 37px;
      }
      .title, .description {
        text-align: center;
      }
      .row {
        max-width: 587px;
        margin: 80px auto 40px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }
      .card {
        padding: 18px 18px 24px;
        width: 220px;
        text-align: left;
        text-decoration: none;
        color: #434343;
        border: 1px solid #9B9B9B;
      }
      .card:hover {
        border-color: #067df7;
      }
      .card h3 {
        margin: 0;
        color: #067df7;
        font-size: 18px;
      }
      .card p {
        margin: 0;
        padding: 12px 0 0;
        font-size: 13px;
        color: #333;
      }
    `}</style>
  </div>
)};

export const getServerSideProps = async ({ params }) => {
  const post = await prisma.customer.findMany({
    select: {
      name: true,
      branchId: true
    },
  });

  const branch = await prisma.branch.findFirst({
    select: {
      address: true,
      branchId: true
    },
  });

  const prices = await prisma.prices.findFirst({
    where: {
      branchId: 131313
    },
  });
  
  

  return {
    props: { post, branch, prices },
  };
};