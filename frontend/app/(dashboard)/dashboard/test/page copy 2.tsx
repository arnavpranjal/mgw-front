"use client"
import React, { useState } from 'react';

function DynamicOptionsForm() {
  const [options, setOptions] = useState(['Option 1', 'Option 2']);
  const [selectedOption, setSelectedOption] = useState('');
  const [newOption, setNewOption] = useState('');
  const [editingOption, setEditingOption] = useState(null); // State to track the currently editing option
  const [editValue, setEditValue] = useState(''); // State to hold the edit input value

  const handleAddOption = (e:any) => {
    e.preventDefault();
    if (newOption && !options.includes(newOption)) {
      setOptions([...options, newOption]);
      setNewOption('');
    }
  };

  const handleDeleteOption = (optionToDelete:any) => {
    setOptions(options.filter(option => option !== optionToDelete));
    if (selectedOption === optionToDelete) {
      setSelectedOption('');
    }
  };

  const handleEditOption = (option:any) => {
    setEditingOption(option);
    setEditValue(option);
  };

  const handleEditChange = (e:any) => {
    e.preventDefault();
    setEditValue(e.target.value);
  };

  const handleSubmitEdit = (originalOption:any) => {
   
    const updatedOptions = options.map(option => option === originalOption ? editValue : option);
    setOptions(updatedOptions);
    setEditingOption(null);
    setEditValue('');
    if (selectedOption === originalOption) {
      setSelectedOption(editValue);
    }
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log('Form submitted with selected option:', options);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      
        <div className="mb-4">
          <ul>
            {options.map((option, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-100 rounded px-4 py-2 my-2">
                {editingOption === option ? (
                  <form  className="flex flex-grow">
                    <input
                      type="text"
                      value={editValue}
                      onChange={handleEditChange}
                      className="flex-grow shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <button
                    onClick={() => handleSubmitEdit(option)}
             
                      className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    >
                      Save
                    </button>
                  </form>
                ) : (
                  <>
                    {option}
                    <div>
                      <button
                        type="button"
                        onClick={() => handleEditOption(option)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteOption(option)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder="Add new option"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <button
            onClick={handleAddOption}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3 w-full"
          >
            Add Option
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default DynamicOptionsForm;
