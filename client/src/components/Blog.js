import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import { Box, Modal } from '@mui/material';
import EditForm from './EditForm';
import { deleteBlog } from '../api';

export default function Blog({ data }) {
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

  const handleDelete = async () => {
    try {
      const response = await deleteBlog(data._id);
      console.log("Blog deleted successfully", response.data);
      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.log("Failed to delete the blog:", error.message);
    }
  };

  // Ensure `data` is valid
  if (!data) {
    return null;
  }

  return (
    <Box
      sx={{
        width: '100%',
        padding: '10px',
        boxSizing: 'border-box',
      }}
    >
      <Card
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 6,
        }}
      >
        <Box
          sx={{
            width: '100%',
            position: 'relative',
            paddingTop: '56.25%', // 16:9 Aspect Ratio
          }}
        >
          <CardMedia
            component="img"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              backgroundColor: '#f5f5f5',
            }}
            image={data.selectedFile || '/api/placeholder/345/220'}
            title={data.title || 'Blog image'}
          />
        </Box>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {data.title || 'Untitled'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.description || 'No description available'}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              fontSize: '20px',
              lineHeight: '25px',
              margin: '10px 0',
              fontWeight: 400,
            }}
          >
            {(Array.isArray(data.tags) ? data.tags : []).map((tag) => `#${tag}`).join(' ')}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleDelete}>
            <Delete />
          </Button>
          <Button size="small" onClick={handleOpen}>
            <Edit />
          </Button>
        </CardActions>
      </Card>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <EditForm blogData={data} onClose={handleClose} />
        </Box>
      </Modal>
    </Box>
  );
}
