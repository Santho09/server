import { Box, Button, Chip, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import FileBase from 'react-file-base64';
import { createBlog } from '../api';
import { useNavigate } from 'react-router-dom';

const Form = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    selectedFile: '',
  });
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const compressImage = async (base64Str) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  };

  const handleFileUpload = async ({ base64 }) => {
    try {
      const compressed = await compressImage(base64);
      setFormData({ ...formData, selectedFile: compressed });
    } catch (err) {
      console.error('Error compressing image:', err);
      alert('Error processing image. Please try a different one.');
    }
  };

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const author = localStorage.getItem("author");
      if (!author) {
        alert('Please login first');
        return;
      }

      if (!formData.title.trim() || !formData.description.trim()) {
        alert('Please fill in all required fields');
        return;
      }

      const blogData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        selectedFile: formData.selectedFile,
        author,
        tags: tags.map(tag => tag.trim())
      };

      const response = await createBlog(blogData);
      console.log("Blog created successfully", response.data);
      window.location.reload()
      navigate('/');
    } catch (error) {
      console.error("Error creating blog:", error);
      alert(error.response?.data?.mssg || "Failed to create blog. Please try again.");
      
      // Only reset form on specific errors
      if (error.response?.status === 500) {
        setFormData({
          title: formData.title,
          description: formData.description,
          selectedFile: ''  // Only reset the file
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Box flex="1" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Typography fontSize="40px" fontWeight="bold">
          Create Blog
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center" width="30vw">
          <TextField
            id="title"
            name="title"
            label="Title"
            variant="outlined"
            required
            style={{ marginTop: '30px', width: '80%' }}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            id="description"
            name="description"
            label="Description"
            variant="outlined"
            required
            multiline
            rows={4}
            style={{ marginTop: '30px', width: '80%' }}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <TextField
            id="tagInput"
            name="tagInput"
            label="Add Tag"
            variant="outlined"
            style={{ marginTop: '30px', width: '80%' }}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => (e.key === 'Enter' ? handleAddTag() : null)}
          />
          <Box style={{ marginTop: '20px', width: '80%' }}>
            {tags.map((tag, index) => (
              <Chip 
                key={index} 
                label={tag} 
                onDelete={() => handleDeleteTag(tag)} 
                style={{ margin: '5px' }} 
              />
            ))}
          </Box>

          <div style={{ marginTop: '30px', width: '80%' }}>
            <FileBase 
              type="file" 
              multiple={false} 
              onDone={handleFileUpload}
            />
          </div>

          <Button
            style={{
              border: '1px solid black',
              marginTop: '10%',
              width: '80%',
              fontSize: '20px',
              fontWeight: 'semi-bold',
              backgroundColor: 'black',
              color: 'white',
              borderRadius: '15px',
            }}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Form;