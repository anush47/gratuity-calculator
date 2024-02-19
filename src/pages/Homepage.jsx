import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { DateInput, TextInput } from "../components/InputCompnents";
import React, { useEffect, useState } from "react";

function Homepage() {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [salary, setSalary] = useState(16000);
  const [payDate, setPayDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [serviceYears, setServiceYears] = useState();
  const [dayToPay, setDayToPay] = useState();
  const [gratuity, setGratuity] = useState();
  const [lateDays, setLateDays] = useState();
  const [surchargeInterestRate, setSurchargeInterestRate] = useState();
  const [surcharge, setSurcharge] = useState();
  const [totalPayable, setTotalPayable] = useState();

  useEffect(() => {}, []);

  const formatNumber = (number) => {
    // Check if the number is null
    if (number === null) return null;

    // Convert number to string
    let formattedNumber = number.toFixed(2).toString();

    // Split the number into integer and decimal parts
    const parts = formattedNumber.split(".");

    // Add commas for every three digits in the integer part
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Join integer and decimal parts with '.'
    return parts.join(".");
  };

  const calculateServiceYears = (start_day, end_day) => {
    // Convert start_day and end_day to Date objects
    const startDate = new Date(start_day);
    const endDate = new Date(end_day);
    // Calculate the difference in milliseconds between the two dates
    const timeDiff = endDate.getTime() - startDate.getTime();
    // Calculate the difference in years
    const yearsDiff = Math.floor(timeDiff / (1000 * 3600 * 24 * 365));
    setServiceYears(yearsDiff + " years");
    return yearsDiff;
  };

  const calculateDayToPay = (end_day) => {
    // Validate end_day
    if (!end_day || isNaN(new Date(end_day).getTime())) {
      console.error("Invalid end day:", end_day);
      return null;
    }

    // Convert end_day to a Date object
    const endDate = new Date(end_day);

    // Add 30 days to the end day
    const payDate = new Date(endDate.getTime());
    payDate.setDate(payDate.getDate() + 30);

    // Return the pay date
    setDayToPay(payDate.toISOString().split("T")[0]);
    return payDate.toISOString().split("T")[0];
  };

  const calculateGratuity = (years, salary) => {
    const gratuity = (salary / 2) * years;
    setGratuity(formatNumber(gratuity));
    return gratuity;
  };

  const calculateLateDays = (day_to_pay, pay_day) => {
    // Convert day_to_pay and pay_day to Date objects
    const dayToPayDate = new Date(day_to_pay);
    const payDayDate = new Date(pay_day);

    // Calculate the difference in milliseconds between the two dates
    const timeDiff = payDayDate.getTime() - dayToPayDate.getTime();

    // Convert the difference from milliseconds to days
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Return the number of late days (if negative, return 0)
    const _lateDays = Math.max(daysDiff, 0);
    setLateDays(_lateDays);
    return _lateDays;
  };

  const calculateSurchargeInterestRate = (lateDays) => {
    let surchargeRate;

    if (lateDays >= 1 && lateDays <= 30) {
      surchargeRate = 0.1; // 10% for late between 1 day to 1 month
    } else if (lateDays > 30 && lateDays <= 90) {
      surchargeRate = 0.15; // 15% for late between 1 month to 3 months
    } else if (lateDays > 90 && lateDays <= 180) {
      surchargeRate = 0.2; // 20% for late between 3 months to 6 months
    } else if (lateDays > 180 && lateDays <= 365) {
      surchargeRate = 0.25; // 25% for late between 6 months to 1 year
    } else if (lateDays > 365) {
      surchargeRate = 0.3; // 30% for late more than 1 year
    } else {
      surchargeRate = 0; // No surcharge for on-time payments
    }
    setSurchargeInterestRate(surchargeRate * 100 + " %");
    return surchargeRate;
  };

  const calculateSurchage = (surchargeInterestRate, gratuity) => {
    const _surcharge = gratuity * surchargeInterestRate;
    setSurcharge(formatNumber(_surcharge));
    return _surcharge;
  };

  const calculateTotalPayable = (surcharge, gratuity) => {
    const total = gratuity + surcharge;
    setTotalPayable(formatNumber(total));
    return total;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    switch (e.target.id) {
      case "start_day":
        setStartDate(value);
        break;

      case "end_day":
        setEndDate(value);
        break;

      case "salary":
        setSalary(value);
        break;

      case "pay_day":
        setPayDate(value);
        break;

      default:
        break;
    }
  };

  const validate = () => {
    if (!startDate) {
      alert("Please enter start date");
      return false;
    }
    if (!endDate) {
      alert("Please enter the end day of your reservation.");
      return false;
    }
    if (isNaN(Number(salary)) || salary < 0) {
      alert("Please enter a valid number for the salary.");
      return false;
    }
    if (!payDate) {
      alert("Please indicate when you will be paid.");
      return false;
    }
    return true;
  };

  const handleClick = (e) => {
    switch (e.target.id) {
      case "calculate-btn":
        if (!validate()) {
          return;
        }
        //console.log(startDate + endDate + salary + payDate);
        const _serviceYears = calculateServiceYears(startDate, endDate);
        const _dayToPay = calculateDayToPay(endDate);
        const _gratuity = calculateGratuity(_serviceYears, salary);
        const _lateDays = calculateLateDays(_dayToPay, payDate);
        const _surchargeInterestRate =
          calculateSurchargeInterestRate(_lateDays);
        const _surcharge = calculateSurchage(_surchargeInterestRate, _gratuity);
        const _total = calculateTotalPayable(_surcharge, _gratuity);
        // console.log(
        //   _serviceYears,
        //   _dayToPay,
        //   _gratuity,
        //   _lateDays,
        //   _surchargeInterestRate,
        //   _surcharge,
        //   _total
        // );

        break;

      default:
        break;
    }
  };

  const Detail = ({ title, data }) => {
    return (
      <div className="mb-3">
        <label className="form-label me-2 mb-0 text-light">{title}:</label>
        <label className="form-label h5 me-2 mb-0 text-light">{data}</label>
      </div>
    );
  };

  return (
    <div className="container-fluid vh-100 bg-dark text-light">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-4">
          <div className="card p-4 bg-primary text-light">
            <label className="h4">Input</label>
            <div className="card-body">
              <div className="mb-3 input-group">
                <label className="form-label h5 me-2 mb-0 text-light">
                  Start day:{" "}
                </label>
                <DateInput
                  className="input-group-append"
                  key_name="start_day"
                  handleChangeFunction={handleChange}
                />
              </div>

              <div className="mb-3 input-group">
                <label className="form-label h5 me-2 mb-0 text-light">
                  End day:{" "}
                </label>
                <DateInput
                  className="input-group-append"
                  key_name="end_day"
                  handleChangeFunction={handleChange}
                />
              </div>

              <div className="mb-3 input-group">
                <label className="form-label h5 me-2 mb-0 text-light">
                  Salary:{" "}
                </label>
                <TextInput
                  className="input-group-append"
                  key_name="salary"
                  handleChangeFunction={handleChange}
                />
              </div>

              <div className="mb-5 input-group">
                <label className="form-label h5 me-2 mb-0 text-light">
                  Pay day :
                </label>
                <DateInput
                  className="input-group-append"
                  key_name="pay_day"
                  handleChangeFunction={handleChange}
                  value={payDate}
                />
              </div>

              <div className="mb-3">
                <Button id="calculate-btn" variant="dark" onClick={handleClick}>
                  Calculate
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-4 bg-success text-light">
            <label className="h4">Details</label>
            <div className="card-body">
              <Detail title={"Service Years"} data={serviceYears} />
              <Detail title={"Gratuity"} data={gratuity} />
              <Detail title={"Day to pay"} data={dayToPay} />
              <Detail title={"Late days"} data={lateDays} />
              <Detail
                title={"Surcharge Interest Rate"}
                data={surchargeInterestRate}
              />
              <Detail title={"Surcharge"} data={surcharge} />
              <Detail title={"Total Payable"} data={totalPayable} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
