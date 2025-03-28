import React from 'react';
import { useEffect, useState } from 'react';
import {useForm} from "react-hook-form"
import CountryCode from "../../../data/countrycode.json"
import { apiConnector } from '../../../services/apiconnector';
import { contactusEndpoint } from '../../../services/api';
import toast from 'react-hot-toast';

const ContactUsForm = () => {
 
    const { register, 
            handleSubmit, 
            reset, 
            formState: { errors, isSubmitSuccessful } 
        } = useForm();

    const [loading, setLoading] = useState(false)
    
    const submitContactForm = async(data) =>{
       console.log("DATA", data);
       try{
           setLoading(true)
           const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data);
         
             console.log("logging in response", response);
             toast.success("Data send successfully")
             if(response.data.success){
                reset({
                    email: "",
                    firstName: "",
                    lastName: "",
                    message: "",
                    phoneNo:"",
                })
             }
       }  
       catch(error){
         console.log("Error" , error.message)
       }
       setLoading(false)   
    };

    useEffect(() =>{
        if (!isSubmitSuccessful) {
            reset({
                email: "",
                firstName: "",
                lastName: "",
                message: "",
                phoneNo:"",
            });
        }
    }, [reset, isSubmitSuccessful]);

    return (
        <form onSubmit={handleSubmit(submitContactForm)}>
            <div className='flex flex-col gap-5 justify-between'>
                {/* first name */}
               <div className='flex flex-row gap-4'>
               <div className='flex flex-col gap-1 w-[48%]'>
                    <label htmlFor='firstName' className='text-sm text-richblack-25'>
                        First Name
                    </label>
                    <input 
                        type='text'
                        name="firstName"
                        id="firstName"
                        placeholder='Enter first name'
                        {...register("firstName", { required: true })}
                        className='h-[40px]  rounded-md  bg-richblack-800 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] text-sm text-richblack-300 px-2'
                    />
                    {
                        errors.firstName && (
                            <span>
                                Please enter your name
                            </span>
                        )
                    }
                </div>

                {/* last name */}
                <div className='flex flex-col gap-1 w-[48%]'>
                    <label htmlFor='lastName' className='text-sm text-richblack-25'>
                        Last Name
                    </label>
                    <input 
                        type='text'
                        name="lastName"
                        id="lastName"
                        placeholder='Enter Last name'
                        {...register("lastName")}
                        className='h-[40px]  rounded-md bg-richblack-800 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] text-sm text-richblack-300 px-2'
                    />
                </div>
               </div>

                {/* email */}
                <div className='flex flex-col gap-1'>
                    <label htmlFor='email' className='text-sm text-richblack-25'>Email Address</label>
                    <input
                        type='email'
                        name="email"
                        id="email"
                        placeholder='Enter email Address'
                        {...register("email", { required: true })}
                        className='h-[40px] rounded-md w-full bg-richblack-800 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] text-sm text-richblack-300 px-2 '
                    />
                    {
                        errors.email && (
                            <span>
                                Please enter your email address
                            </span>
                        )
                    }
                </div>

                {/* phone no. */}
                <div className='flex flex-col gap-1'>
                    <label htmlFor='phonenumber' className='text-sm text-richblack-25'>Phone Number</label>
                        
                        {/* dropdown */}
                   <div className='flex flex-row gap-5'>
                   
                        <select
                        name='dropdown'
                        id= "dropdown"
                        className='h-[40px] rounded-md w-[62px] bg-richblack-800 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] text-sm text-richblack-300 px-2'             
                        {...register("countrycode", {required: true})}
                        >
                            {
                                CountryCode.map((element, index) =>{
                                    return (
                                        <option key={index} value={element.code}>
                                           {element.code}-{element.country}
                                        </option>
                                    )
                                })
                            }

                        </select>
                        
                    
               
                   {/* input */}
                   
                    <input
                    type='number'
                    name='phonenumber'
                    id= "phonenumber"
                    placeholder='12345 67890'
                    className='h-[40px] rounded-md w-[2000px] bg-richblack-800 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] text-sm text-richblack-300 px-2'             
                    {...register("phoneNo", {
                        required:{value: true, message: "Please enter phone no."},
                        maxLength: {value:10, message: "Invalid Phone Number"},
                        minLength: {value:8, message: "Invalid Phonr Number"}
                    })}
                    />
                   
                </div>
                    </div>{
                    errors.message && (
                        <span>
                            {errors.phoneNo.message }
                        </span>
                    )
                }
                {/* message */}
                <div className='flex flex-col gap-1'>
                    <label htmlFor='message' className='text-sm text-richblack-25'>Message</label>
                    <textarea 
                        name="message"
                        id="message"
                        cols="30"
                        rows="5"
                        placeholder='Enter your message here'
                        {...register("message", { required:true })}
                        className=' rounded-md  bg-richblack-800 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] text-sm text-richblack-300 px-2 py-2'             
                    />
                    {
                        errors.message && (
                            <span>
                                Please enter your message
                            </span>
                        )
                    }
                </div>

                <button type='submit' className='font-bold bg-yellow-50 w-full rounded-md  text-black  h-[45px]'>
                    Send Message
                </button>
            </div>
        </form>
    );
};

export default ContactUsForm;
