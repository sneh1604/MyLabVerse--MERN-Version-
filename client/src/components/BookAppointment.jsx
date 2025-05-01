import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCalendar, FaCheck, FaTimes } from 'react-icons/fa';

const BookAppointment = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get token from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;

      const response = await axios.get('http://localhost:4000/test-list', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Test list response:', response.data); // Debug log
      
      if (response.data && Array.isArray(response.data)) {
        const activeTests = response.data.filter(test => test.status === true);
        console.log('Filtered active tests:', activeTests); // Debug log
        setTests(activeTests);
      } else {
        setError('Invalid response format from server');
        console.error('Invalid response:', response.data);
      }
    } catch (error) {
      console.error('Error fetching tests:', error.response || error);
      setError(error.response?.data?.message || 'Failed to load available tests');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/available-slots?date=${selectedDate}`, {
        withCredentials: true
      });
      setAvailableSlots(response.data);
    } catch (error) {
      setError('Failed to fetch available slots');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:4000/appointments', {
        testId: selectedTest,
        appointmentDate: selectedDate,
        timeSlot: selectedSlot
      }, {
        withCredentials: true
      });
      navigate('/userdashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const renderTestOptions = () => {
    if (loading) {
      return <option>Loading tests...</option>;
    }
    
    if (error) {
      return <option>Error loading tests</option>;
    }
    
    if (tests.length === 0) {
      return <option>No tests available</option>;
    }
    
    return (
      <>
        <option value="">Select a test</option>
        {tests.map(test => (
          <option key={test._id} value={test._id}>
            {test.name} - ₹{test.cost}
          </option>
        ))}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Book an Appointment</h2>
        
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Test
            </label>
            <div className="mt-1">
              <select
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                required
              >
                {renderTestOptions()}
              </select>
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {selectedDate && availableSlots.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Time Slot
              </label>
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-4 rounded-md text-sm font-medium ${
                      selectedSlot === slot
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/userdashboard')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedTest || !selectedDate || !selectedSlot}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
