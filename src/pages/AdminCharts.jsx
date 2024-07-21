import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Paper,
  Grid,
  IconButton
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import PasswordPrompt from '../components/PasswordPrompt';

const AdminPage = () => {
  const [charts, setCharts] = useState([]);
  const [form, setForm] = useState({
    chartId: '',
    type: 'bar',
    xAxisCaption: '',
    yAxisCaption: '',
    labels: [],
    data: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingChartId, setEditingChartId] = useState('');
  const [isPasswordPromptOpen, setIsPasswordPromptOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCharts();
    }
  }, [isAuthenticated]);

  const fetchCharts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('https://ndrr-charts-api.vercel.app/api/charts');
      setCharts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Failed to fetch charts');
      console.error(err);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleLabelsChange = (e, index) => {
    const newLabels = [...form.labels];
    newLabels[index] = e.target.value;
    setForm({ ...form, labels: newLabels });
  };

  const handleDataChange = (e, index) => {
    const newData = [...form.data];
    newData[index] = parseFloat(e.target.value);
    setForm({ ...form, data: newData });
  };

  const handleAddLabel = () => {
    setForm({ ...form, labels: [...form.labels, ''], data: [...form.data, 0] });
  };

  const handleRemoveLabel = (index) => {
    const newLabels = [...form.labels];
    const newData = [...form.data];
    newLabels.splice(index, 1);
    newData.splice(index, 1);
    setForm({ ...form, labels: newLabels, data: newData });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.type === 'pie' && form.data.reduce((a, b) => a + b, 0) > 100) {
      alert("The total percentage for a pie chart cannot exceed 100%");
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (isEditing) {
        await axios.put(`https://ndrr-charts-api.vercel.app/api/charts/${editingChartId}`, form);
        setIsEditing(false);
        setEditingChartId('');
      } else {
        await axios.post('https://ndrr-charts-api.vercel.app/api/charts', form);
      }
      fetchCharts();
      setForm({
        chartId: '',
        type: 'bar',
        xAxisCaption: '',
        yAxisCaption: '',
        labels: [],
        data: []
      });
    } catch (err) {
      setError('Failed to save chart');
      console.error(err);
    }
    setLoading(false);
  };

  const handleEdit = (chart) => {
    setForm(chart);
    setIsEditing(true);
    setEditingChartId(chart.chartId);
  };

  const handleDelete = async (chartId) => {
    setLoading(true);
    setError('');
    try {
      await axios.delete(`https://ndrr-charts-api.vercel.app/api/charts/${chartId}`);
      fetchCharts();
    } catch (err) {
      setError('Failed to delete chart');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <>
      {isPasswordPromptOpen && !isAuthenticated && (
        <PasswordPrompt
          onPasswordCorrect={() => {
            setIsAuthenticated(true);
            setIsPasswordPromptOpen(false);
          }}
          onClose={() => setIsPasswordPromptOpen(false)}
        />
      )}
      {isAuthenticated && (
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" style={{ marginTop: '10px' }} gutterBottom>
            Admin Page
          </Typography>
          {loading && <Typography>Loading...</Typography>}
          {error && <Typography color="error">{error}</Typography>}
          <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Chart ID"
                    name="chartId"
                    value={form.chartId}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                      name="type"
                      value={form.type}
                      onChange={handleInputChange}
                      required
                    >
                      <MenuItem value="bar">Bar</MenuItem>
                      <MenuItem value="pie">Pie</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {form.type === 'bar' && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="X-Axis Caption"
                        name="xAxisCaption"
                        value={form.xAxisCaption}
                        onChange={handleInputChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Y-Axis Caption"
                        name="yAxisCaption"
                        value={form.yAxisCaption}
                        onChange={handleInputChange}
                        required
                      />
                    </Grid>
                  </>
                )}
                {form.labels.map((label, index) => (
                  <Grid item xs={12} key={index}>
                    <Box display="flex" alignItems="center">
                      <TextField
                        label="Label"
                        value={label}
                        onChange={(e) => handleLabelsChange(e, index)}
                        style={{ marginRight: '10px', flex: 1 }}
                      />
                      <TextField
                        label="Value"
                        type="number"
                        value={form.data[index]}
                        onChange={(e) => handleDataChange(e, index)}
                        style={{ marginRight: '10px', flex: 1 }}
                        required
                      />
                      <IconButton
                        color="secondary"
                        onClick={() => handleRemoveLabel(index)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddLabel}
                    startIcon={<Add />}
                  >
                    Add Label
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                  >
                    {isEditing ? 'Update' : 'Save'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
          <Typography variant="h5" component="h2" gutterBottom>
            Existing Charts
          </Typography>
          {charts.length > 0 ? (
            charts.map((chart) => (
              <Paper
                key={chart.chartId}
                elevation={3}
                style={{ padding: '20px', marginBottom: '20px' }}
              >
                <Typography variant="h6">{chart.chartId}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEdit(chart)}
                  startIcon={<Edit />}
                  style={{ marginRight: '10px', marginTop: '10px'}}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDelete(chart.chartId)}
                  startIcon={<Delete />}
                  style={{ marginTop: '10px'}}
                >
                  Delete
                </Button>
              </Paper>
            ))
          ) : (
            <Typography>No charts found</Typography>
          )}
        </Container>
      )}
    </>
  );
};

export default AdminPage;
