import { Button, Typography,Box, Modal } from '@mui/material'
import React from 'react'
import Form from './Form';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate=useNavigate()
  const handleSignin=()=>{
    navigate('/signin')
  }

  return (
    <div>
      <Box
         sx={{
            display:'flex',
            justifyContent:'space-between',
            paddingY:'20px',
            paddingX:'50px',
            paddingBottom:'20px',
            boxShadow:'0px 2px 4px rgba(0,0,0,0.1)'
         }}
         >
          <Typography variant='h4'>Blog Website</Typography>
          <Box>
            <Button
            sx={{
                marginRight:1,
                backgroundColor:'black',
                color:'white',
                borderRadius:10,
                '&:hover':{
                    backgroundColor:'#FFD42F',
                    color:'black'
                }
            }}
            variant='contained'
            onClick={handleOpen}>
                Create Blog
            </Button>
            <Button
            sx={{
                backgroundColor:'black',
                color:'white',
                borderRadius:10,
                '&:hover':{
                    backgroundColor:'#FFD42F',
                    color:'black'
                }
            }}
            variant='contained'
            onClick={handleSignin}>
                Signin
            </Button>
          </Box>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Form />
        </Box>
      </Modal>
    </div>
  )
}

export default Navbar
