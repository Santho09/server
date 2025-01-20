import React,{useState} from 'react'
import {Box, Button, TextField, Typography} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom';
import demo from "../images/demo.jpg"
import { signup } from '../api';
const Signup = () => {
    const [formData,setFormData]=useState({
        name:'',
        email:'',
        password:'',
        confirmPassword:''
    })
    const navigate=useNavigate()
    const handleInputChange=(e)=>{
        const {name,value}=e.target
        setFormData(prevState=>({
            ...prevState,
            [name]:value
        }))
    }
    const handleSignUp=async(e)=>{
            console.log(formData)
            try{
                 const response=await signup(formData)
                 console.log("Signup successfull",response.data)
                 navigate('/signin')
            }
            catch(error){
              console.log("Signup Failed",error)
              setFormData({email:'',password:'',name:'',confirmPassword:''})
            }
        }
  return (
    <Box display='flex' height='100vh'>
     <Box flex="1" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <img src={demo} style={{maxHeight:'60vh',maxWidth:'100%'}} alt="demo"/>
    </Box>
    <Box flex="1" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Typography fontSize="50px" fontWeight="bold">Sign up</Typography>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt={3} width={'30vw'}>
        <TextField
              id='name'
              name='name'
              label='Name'
              variant='outlined'
              style={{marginTop: '30px',width:'80%'}}
              value={formData.name}
              onChange={handleInputChange}
            />
           <TextField
              id='email'
              name='email'
              label='Email'
              variant='outlined'
              style={{marginTop: '30px',width:'80%'}}
              value={formData.email}
              onChange={handleInputChange}
            />
            <TextField
              id='password'
              name='password'
              label='Password'
              variant='outlined'
              style={{marginTop: '30px',width:'80%'}}
              value={formData.password}
              onChange={handleInputChange}
            />
            <TextField
              id='confirmPassword'
              name='confirmPassword'
              label='Confirm Password'
              variant='outlined'
              style={{marginTop: '30px',width:'80%'}}
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <Link to ='/signin' style={{textDecoration:'underline'}}>
              <Typography style={{marginTop:'20px', fontWeight:'bold',textDecoration:'none','&:hover':{
                textDecoration:'underline'
              }}}>
                Already a user?
              </Typography>
            </Link>
            <Button style={{border:'1px solid black',marginTop:'10%',width:'80%',fontSize:'20px',fontWeight:'semi-bold',color:'white',borderRadius:'15px',backgroundColor:'black'}}
            onClick={handleSignUp}>
                Sign up
            </Button>
        </Box>
    </Box>
    </Box>
  )
}

export default Signup

