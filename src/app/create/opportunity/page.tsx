"use client";

import React, { useState } from "react";
import { createOpp, createOpp1 } from "@/app/api/create/createOpportunity/route";


interface CreateOpportunityFormState  {
    opp_name: string;
    opp_description: string;
    opp_start_date: string;
    opp_end_date: string;
  }

/**
 * Creates form and handles form submission for creating volunteer oppportunity by validating the input fields
 * - Ensures the name field is not empty.
 * - Checks that both start and end dates are provided.
 * - Validates that the end date is the same as or after the start date.
 * - Displays an error message if validation fails.
 * - Logs the form data to the console if all validations pass
 * @returns 
 */
export default function CreateOpportunityForm() {
  //     var state: CreateOpportunityFormState{
  //     opp_name='',
  //     opp_description='',
  //     opp_start_date= new Date(),
  //     opp_end_date = new Date()
  //   };

  //   onChange = (e:)
  

  const [formData, setFormData] = useState<CreateOpportunityFormState> ({
      opp_name: '',
      opp_description: '',
      opp_start_date: new Date().toISOString(),
      opp_end_date: new Date().toISOString(),
  });

  const [errors, setErrors] = useState<String>("");
  const [success, setSuccess] = useState<String>("");

  // function validation (formData){
  //   if (!formData.opp_name.trim()) {
  //     setErrors(" Name is required");
  //     return false;
  //   }

  //   if (!formData.opp_start_date || !formData.opp_end_date) {
  //     setErrors("Both start and end dates are required");
  //     return false;
  //   }
  //   if (!(formData.opp_start_date >= new Date().toISOString())){
  //     setErrors("Start date cannot be in the past")
  //     return false;
  //   }

  //   if (!(formData.opp_start_date <= formData.opp_end_date)) {
  //     setErrors("End date must be same as or after the start date");
  //     return false;
  //   }
  //   return true
  // }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;
      setFormData(prevData => ({...prevData, [name]: value}));
  };

  const onSubmit =  async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrors("");
      setSuccess("");

      if (!formData.opp_name.trim()) {
        setErrors(" Name is required");
        return;
      }

      if (!formData.opp_start_date || !formData.opp_end_date) {
        setErrors("Both start and end dates are required");
        return;
      }
      if (!(formData.opp_start_date >= new Date().toISOString())){
        setErrors("Start date cannot be in the past")
        return;
      }

      if (!(formData.opp_start_date <= formData.opp_end_date)) {
        setErrors("End date must be same as or after the start date");
        return;
      }
      

      // try {
      //   const response = await fetch('/app/api/createOpportunity/route', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(formData),
      //   });

      //   const result = await response.json();
  
      //   if (response.ok) {
      //     console.log('Form Submitted:', result);
      //     // Optionally reset the form here
          // setFormData({
          //   opp_name: '',
          //   opp_description: '',
          //   opp_start_date: new Date().toISOString().split("T")[0],
          //   opp_end_date: new Date().toISOString().split("T")[0],
          // });
      //   } else {
      //     setErrors("Error submitting the form.");
      //   }
      // } catch (error) {
      //   console.error("Error:", error);
      //   setErrors("An unexpected error occurred.");
      // }

      //   const prisma = new PrismaClient();

      //   const opp_name = formData.opp_name
      //   const opp_desc = formData.opp_description
      //   const start_date = formData.opp_start_date
      //   const end_date = formData.opp_end_date

      //   const opp =  await prisma.opportunity.create({data:{
      //     opp_name : opp_name,
      //     opp_description : opp_desc,
      //     opp_start_date : start_date,
      //     opp_end_date : end_date
      //     }, 
      // });
    


      createOpp1(formData)
      console.log("Form Submitted/Sent:", formData);
      setSuccess("Opportunity successfully created!")
      setFormData({
        opp_name: '',
        opp_description: '',
        opp_start_date: new Date().toISOString(),
        opp_end_date: new Date().toISOString(),
      });
    };

  return (
    <>
    <b>Create Opportunity Page</b>
    <div className="Create_Opportunity_Form"></div>
    {/* <form onSubmit={onSubmit}> */}
    <form onSubmit={ onSubmit }>

        <div>
            <label htmlFor="opp_name">Opportunity name:</label>
            <br />
            <input type="text" name="opp_name" id="opp_name" onChange={onChange} value={formData.opp_name} required />
            <br />
        </div>

        <div>
            <label htmlFor="opp_desc">About this opportunity (not required):</label>
            <br/>
            <input type="text" name="opp_description" id="opp_description" onChange={onChange} value={formData.opp_description} />
            <br />
        </div>

        <div>
            <label htmlFor="opp_start_date">Opprtunity start date and time (24hr):</label>
            <br />
            <input type="datetime-local" name="opp_start_date" id="opp_start_date" onChange={onChange} value={formData.opp_start_date} required />
            <br />
        </div>

        <div>
          <label htmlFor="opp_end_date">Opportunity end date and time (24hr):</label>
          <br />
          <input type ="datetime-local" name="opp_end_date" id="opp_end_date" onChange={onChange} value={formData.opp_end_date} required />
        </div>

        {errors && <p style={{ color: "red" }}>{errors}</p>}
        {success && <p style={{color: "green"}}>{success}</p>}

        <br />
        <button type="submit">Submit</button>
    </form>
    </>
    );
}
