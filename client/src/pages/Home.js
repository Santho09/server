import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { 
  Box, 
  Button, 
  TextField, 
  Chip, 
  Grid, 
  Typography 
} from '@mui/material';
import Blog from '../components/Blog';
import { getAllBlogs, getBlogBySearch } from '../api';
import { useNavigate, useLocation } from 'react-router-dom';

const Home = () => {
  const [search, setSearch] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle adding a tag
  const handleAdd = (tag) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput(''); // Clear the input after adding the tag
    }
  };

  // Handle deleting a tag
  const handleDelete = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  // Prevent form submission on Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  // Add tag on Enter key press
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      handleAdd(tagInput.trim());
    }
  };

  // Perform search and update URL
  const handleSearch = () => {
    if (search.trim() || tags.length > 0) {
      const tagString = tags.join(',');
      navigate(`/blog/search?searchQuery=${search || 'none'}&tags=${tagString || 'none'}`);
    } else {
      navigate('/'); // If search and tags are empty, navigate to the homepage (or fetch all blogs)
    }
  };

  // Fetch blogs from API
  useEffect(() => {
    const getBlogs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getAllBlogs();
        if (response.data && Array.isArray(response.data.blogs)) {
          setBlogs(response.data.blogs);
        } else {
          setError("Failed to load blogs. Unexpected data format.");
          setBlogs([]);
        }
      } catch (error) {
        setError("Failed to load blogs. Please try again later.");
        setBlogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    getBlogs();
  }, []);

  // Update search and tags when URL parameters change
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('searchQuery') || '';
    const tagsQuery = queryParams.get('tags') || '';
    
    setSearch(searchQuery);
    setTags(tagsQuery.split(',').filter(tag => tag !== 'none'));

    const fetchBlogs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // If there are no search terms or tags, fetch all blogs
        if (!searchQuery && !tagsQuery) {
          const response = await getAllBlogs();
          if (response.data && Array.isArray(response.data.blogs)) {
            setBlogs(response.data.blogs);
          } else {
            setError("Failed to load blogs based on search parameters.");
            setBlogs([]);
          }
        } else {
          const response = await getBlogBySearch({
            search: searchQuery.toLowerCase(), // Convert search query to lowercase
            tags: tagsQuery
          });
          if (response.data && Array.isArray(response.data.blogs)) {
            setBlogs(response.data.blogs);
          } else {
            setError("Failed to load blogs based on search parameters.");
            setBlogs([]);
          }
        }
      } catch (error) {
        setError("Failed to fetch blogs. Please try again later.");
        setBlogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [location.search]); // Re-fetch when URL changes

  return (
    <div>
      <Navbar />
      <Box sx={{ padding: 4 }}>
        {/* Search Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Search Blogs Field */}
          <TextField
            name="search"
            label="Search Blogs"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{ maxWidth: 250 }}  // Set the width of the text field
          />

          {/* Add Search Tag Section */}
          <Box sx={{ position: 'relative', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              name="tags"
              label="Add Search Tag"
              variant="outlined"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              sx={{ maxWidth: 250 }} // Set the width of the text field
              placeholder="Press Enter to add tag"
              InputProps={{
                startAdornment: (
                  <>
                    {tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={() => handleDelete(tag)}
                        sx={{ margin: '2px', height: '30px', fontSize: '14px' }}
                      />
                    ))}
                  </>
                ),
              }}
            />
          </Box>

          {/* Search Button */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'black',
              color: 'white',
              height: '56px',
              '&:hover': {
                backgroundColor: '#FFD42F',
                color: 'black',
              },
            }}
            onClick={handleSearch} // Trigger search on button click
          >
            Search
          </Button>
        </Box>

        {/* Search Results Section */}
        {(search.trim() || tags.length > 0) && (
          <Typography variant="h5" sx={{ mb: 3 }}>
            Search Results ({blogs.length})
          </Typography>
        )}

        {/* Blogs Section */}
        <Grid container spacing={4}>
          {isLoading ? (
            <Grid item xs={12}>
              <Typography>Loading blogs...</Typography>
            </Grid>
          ) : error ? (
            <Grid item xs={12}>
              <Typography color="error">{error}</Typography>
            </Grid>
          ) : blogs.length > 0 ? (
            <Grid item xs={12}>
              <Grid container spacing={3}>
                {blogs.map((blog) => (
                  <Grid item key={blog._id} xs={12} sm={6} md={4} lg={3}>
                    <Blog data={blog} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6" color="textSecondary">
                No blogs found.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </div>
  );
};

export default Home;
