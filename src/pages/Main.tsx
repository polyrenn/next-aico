import Link from "next/link";
import Head from "../components/head";
import Script from 'next/script'
import Nav from "../components/nav";


export default (props: any) => {
  

  return (
    <div>
    <Head title="Home" />
    <nav className="navbar navbar-expand-lg navbar-light border border-bottom-3 sticky-top">
      <a className="navbar-brand" href="index.php"><img className="mr-5" src="img/logo.jpeg" width="300px" height="65px" alt="logo" /></a>
      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav">
          <li>
            <a href="#"></a>
          </li>
          <li>
            <a href="#"></a>
          </li>
          <li>
            <a href="#"></a>
          </li>
          <ul className="nav navbar-nav navbar-right pull-right float-right">
            <li className="text-white mr-3">
              <a className="text-primary" href="team.php"><b>Our Team</b></a>
            </li>
            <li className="text-white mr-3">
              <a className="text-primary" href="contact.php"><b>Contact Us</b></a>
            </li>
          </ul>
        </ul>
      </div>
    </nav>
    <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img className="d-block w-100" src="static/gas2.jpeg" height="500px" alt="First slide" />
          <div className="carousel-caption d-none d-md-block">
          </div>
        </div>
        <div className="carousel-item">
          <img className="d-block w-100" src="static/gas4.jpeg" height="500px" alt="First slide" /> 
          <div className="carousel-caption d-none d-md-block"> 
          </div>
        </div>
        <div className="carousel-item">
          <img className="d-block w-100" src="static/gas3.jpeg" height="500px" alt="First slide" /> 
          <div className="carousel-caption d-none d-md-block">
          </div>
        </div>
        <div className="carousel-item">
          <img className="d-block w-100" src="static/gas5.jpeg" height="500px" alt="First slide" /> 
          <div className="carousel-caption d-none d-md-block">
          </div>
        </div>
        <div className="carousel-item">
          <img className="d-block w-100" src="static/gas9.jpeg" height="500px" alt="First slide" /> 
          <div className="carousel-caption d-none d-md-block">
          </div>
        </div>
      </div><a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev"><span className="sr-only">Previous</span></a> <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next"><span className="sr-only">Next</span></a>
    </div>
    <div className="container-fluid bg-primary mt-5 p-5">
      <div className="row">
        <div className="col-12 col-lg-6"><img className="shadow rounded" src="aicowork.jpg" width="100%" height="100%" alt="aicowork" /> </div>
        <div className="col-12 col-lg-6">
          <h2 className="text-white"><b>About Almarence International</b></h2>
          <p className="text-white"><b>Almarence Int. Co. Ltd. RC no 265315 is a 100% indigenous company incorporated under the companies and allied matters act 1968 on the 10th FEB 1995 by the corporate affairs commission (CAC) with keen interest in engineering, oil & gas services and general industrial services.</b></p>
          <p className="text-white"><b>In February 2014, Almarence Int.Co.Ltd gave birth to AICO gas with the aim of trading, distributing & retailing of LPG (Liquefied petroleum gas) for various applications especially for domestic purposes nationwide. Aico gas bottling plant is strategically located in Benin City, Edo State with an installed capacity of over 80 metric tonne (160,000 litres) and filling capacity of over 3000 cylinders per day.</b></p>
        </div>
      </div>
    </div>
    <div className="container-fluid mt-3 p-5">
      <div className="row">
        <div className="col-12 col-lg-5 p-5">
          <h2 className="text-danger"><b>Get the best parts for your plant</b></h2>
          <ul>
            <li><b>Engineering parts</b></li>
            <li><b>Lpg cylinders and accessories</b></li>
            <li><b>Lpg tanks (storage and transport)</b></li>
            <li><b>Lpg pumps and motors</b></li>
            <li><b>Valves (ball,gate,check,globe,butterfly) Flanges</b></li>
            <li><b>Pipes and fittings</b></li>
          </ul>
        </div>
        <div className="col-12 col-lg-7">
        <h2 className=""><b>Procurement and general supplies</b></h2><img className="shadow rounded" src="static/flange.jpg" width="100%" height="350px" alt="flange" /></div>
      </div>
    </div>
    <div className="container-fluid mt-3 p-5">
      <div className="row">
        <div className="col-12 col-lg-7">
        <h2 className=""><b>Engineering Services</b></h2><img className="shadow rounded" src="static/dredge.jpg" width="100%" height="350px" alt="dredge" /></div>
        <div className="col-12 col-lg-5 p-5">
          <h2 className="text-danger"><b>Get the job done with the right team</b></h2>
          <ul>
            <li><b>Piling and Dredging</b></li>
            <li><b>Pipe line welding and construction</b></li>
            <li><b>Engineering,Civil constructions/Fabrication</b></li>
            <li><b>Construction of LPG plants</b></li>
          </ul>
        </div>
      </div>
    </div>
    <div className="container p-3 mt-4">
      <h4 className="display-4 text-danger">Clients</h4>
      <div className="row">
        <div className="col-12 col-lg-4 mb-2 align-self-center">
          <button className="shadow">
          <h4>Mr Food</h4></button>
        </div>
        <div className="col-12 col-lg-4 mb-2">
          <button className="shadow">
          <h4>Sizzlers Fast Food</h4></button>
        </div>
        <div className="col-12 col-lg-4 mb-2">
          <button className="shadow">
          <h4>Mat Ice Food</h4></button>
        </div>
        <div className="col-12 col-lg-4 mb-2">
          <button className="shadow">
          <h4 className="">Osvin Hotel</h4></button>
        </div>
        <div className="col-12 col-lg-4 mb-2">
          <button className="shadow">
          <h4 className="">NNPC Medical Center</h4></button>
        </div>
        <div className="col-12 col-lg-4 mb-2">
          <button className="shadow">
          <h4 className="">Prestige Hotel & Suite</h4></button>
        </div>
        <div className="col-12 col-lg-4 mb-2">
          <button className="shadow">
          <h4 className="">Constential Hotel</h4></button>
        </div>
        <div className="col-12 col-lg-4 mb-2">
          <button className="shadow">
          <h4 className="">Westview Hotel</h4></button>
        </div>
        <div className="col-12 col-lg-4 mb-2">
          <button className="shadow">
          <h4 className="">Western Hotel</h4></button>
        </div>
        <div className="col-12 col-lg-4 mb-2">
          <button className="shadow">
          <h4 className="">Empire Foods</h4></button>
        </div>
        <div className="col-12 col-lg-4 mb-2">
          <button className="shadow">
          <h4 className="">Leaders Bakery</h4></button>
        </div>
        <div className="col-12 col-lg-4 mb-2">
          <button className="shadow">
          <h4 className="">GT Foods</h4></button>
        </div>
        <div className="col-12 col-lg-4 mb-2">
          <button className="shadow">
          <h4 className="">GT Plus</h4></button>
        </div>
        <div className="col-12 col-lg-4 mb-2">
          <button className="shadow">
          <h4 className="">Ritz Carlton Hotel</h4></button>
        </div>
        <div className="col-12 col-lg-4 mb-2">
          <button className="">
          <h4 className="">Royal Marble Hotel</h4></button>
        </div>
      </div>
    </div>
    <footer>
      <div className="container-fluid bg-primary p-4">
        <div className="row">
          <div className="col-12 col-lg-3 pt-3 pb-3">
            <h5 className="text-white" ><b><span className="text-white">Almarence</span><br/>
            International
            Company Limited
            </b>
            </h5>
          </div>
          <div className="col-12 col-lg-3 p-2">
            <address>
              <h4 className="text-white" >AIRPORT ROAD</h4>
              <p className="text-white" >4 LIBERTY AIHIE CLOSE OPP OKO DAILY MARKET, OFF OKO-OGBA AIRPORT ROAD, BENIN CITY, EDO STATE 08150664289</p>
            </address>
          </div>
          <div className="col-12 col-lg-3 p-2">
            <h4 className="text-white" >Contact Us</h4>
            <p className="text-white" ><b>08150664289 or 07050791217<br/>
            Mail: aicogas2014@gmail.com</b></p>
          </div>
          </div>
          </div>
      </footer>
  </div>
  );
};

