import { Box, Button, Chip, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import FileBase from 'react-file-base64';
import { editBlog } from '../api';
import { useNavigate } from 'react-router-dom';

const EditForm = ({ blogData }) => {
  const [formData, setFormData] = useState({
    title: blogData.title,
    description: blogData.description,
    selectedFile: blogData.selectedFile,
  });
  const [tags, setTags] = useState(blogData.tags || []);
  const [tagInput, setTagInput] = useState('');
  const navigate = useNavigate();

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleSubmit = async () => {
    console.log(formData);
    console.log(tags);
    try {
      const id = blogData._id;
      const response = await editBlog(id, { ...formData, tags });
      console.log('Blog edited Successfully', response.data);
      window.location.reload();
      navigate('/');
    } catch (error) {
      console.log('Failed:', error.message);
    }
  };

  return (
    <div>
      <Box flex="1" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Typography fontSize="40px" fontWeight="bold">
          Edit Blog
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center" width="30vw">
          <TextField
            id="title"
            name="title"
            label="Title"
            variant="outlined"
            style={{ marginTop: '30px', width: '80%' }}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            id="description"
            name="description"
            label="Description"
            variant="outlined"
            style={{ marginTop: '30px', width: '80%' }}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          {/* Tag Input */}
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
              <Chip key={index} label={tag} onDelete={() => handleDeleteTag(tag)} style={{ margin: '5px' }} />
            ))}
          </Box>

          <div style={{ marginTop: '30px', width: '80%' }}>
            <FileBase
              type="file"
              multiple={false}
              onDone={({ base64 }) => setFormData({ ...formData, selectedFile: base64 })}
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
          >
            Edit
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default EditForm;
