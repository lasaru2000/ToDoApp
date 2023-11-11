import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input, Select, Button,message } from 'antd';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import nodata from "../../assets/nodata.png";


const { TextArea } = Input;
interface TextDataItem {
  id: string;
  contentId:number
  title: string;
  priority: string;
  description: string;
}

function Home() {

  const navigate = useNavigate();

  const location = useLocation();

const{ id, name } = location.state;

  const [showButtons, setShowButtons] = useState<boolean[]>(Array(4).fill(false));
  const [editedCardIndex, setEditedCardIndex] = useState<number | null>(null);
  const [textData, setTextData] = useState<TextDataItem[]>([]);

  // to show edit and delete buttons
  const toggleButtons = (index: number) => {
    const newShowButtons = [...showButtons];
    newShowButtons[index] = !newShowButtons[index];
    setShowButtons(newShowButtons);
  };

  // priority levels array
  const levels = [
    {
      value: 'High',
      label: 'High',
    },
    {
      value: 'Medium',
      label: 'Medium',
    },
    {
      value: 'Low',
      label: 'Low',
    },
  ];

  // get data from the server according to user id
    const fetchData = async () => {
      try {
        // The URL from which you want to fetch data
        const apiUrl = `https://localhost:7027/api/content/${id}`;
        const response = await axios.get(apiUrl);
        setTextData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // add new content to the server
    const handleAddClick = async () => {
      if (!inputData.title || !inputData.priority || !inputData.description) {
        warning();
        return;
      }
      try {
        const apiUrl = 'https://localhost:7027/api/content';
        const response = await axios.post(apiUrl, inputData);
        setTextData([...textData, response.data]);
        setInputData((prevInputData) => ({
          ...prevInputData,
          title: '',
          priority: '',
          description: '',
        }));
        success("Successfully added content!!");
        fetchData();
      } catch (error) {
        console.error('Error adding data:', error);
      }
    };
    

  const [inputData, setInputData] = useState<TextDataItem>({
    id: id,
    contentId:0,
    title: '',
    priority: '',
    description: '',
  });

  // edit existing content 
  const handleEditClick = (index: number) => {
    setEditedCardIndex(index);
    setInputData(textData[index]); // Set input data with the data of the card being edited
    toggleButtons(index);
  };


  // send edited card to the server according card index
  const handleSaveClick = async () => {
    if (editedCardIndex !== null) {
      try {
        const apiUrl = `https://localhost:7027/api/content/${textData[editedCardIndex].contentId}`;
        const response = await axios.put(apiUrl, inputData); // Send the updated data to the server
        const updatedData = [...textData];
        updatedData[editedCardIndex] = response.data;
        setTextData(updatedData);
        setInputData({
          id:id,
          contentId: 0,
          title: '',
          priority: '',
          description: '',
        });
        success("Successfully Saved content!!")
        setEditedCardIndex(null);
        fetchData();
      } catch (error) {
        console.error('Error updating data:', error);
      }
    }
  };

  //delete seleted card according card index
  const handleDeleteClick = async (index: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const apiUrl = `https://localhost:7027/api/content/${textData[index].contentId}`;
        await axios.delete(apiUrl);
        const updatedData = textData.filter((item, i) => i !== index);
        setTextData(updatedData);
        success("Successfully Deleted content!!")
      } catch (error) {
        console.error('Error deleting data:', error);
      }
    }
  };
  
  // cansel edit content and clean inputs
  const handleCancelClick = () => {
    // Clear the input data and reset the edited card index
    setInputData({
      id:id,
      contentId:0,
      title: '',
      priority: '',
      description: '',
    });
    setEditedCardIndex(null);
  };

  //user click user icon navigate to login
  const logout = () => {
  
    navigate('/');
   
  };
  
  

  const [messageApi, contextHolder] = message.useMessage();

 // create warning messages for validation
const warning = () => {
  let warningMessage = 'Please fill in all fields before submitting.';
  if (!inputData.title) {
    warningMessage = 'Title is required!!';
  } else if (!inputData.priority) {
    warningMessage = 'Priority is required!!';
  } else if (!inputData.description) {
    warningMessage = 'Description is required!!';
  }

  messageApi.open({
    type: 'error',
    content: warningMessage,
    style:{
      fontSize: "15px",
      color:"tomato",
      fontFamily:'agbalumo'
     }
  });

};
// success messages model
const success = (content:string) => {
  messageApi.open({
    type: 'success',
    content: content,
    style:{
      fontSize: "15px",
      color:"tomato",
      fontFamily:'agbalumo'
     }
  });
}
// color filled circle according to priority value
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return '#f53d3d';
    case 'Medium':
      return '#fae52a';
    case 'Low':
      return '#3df556';
    default:
      return 'black'; // You can set a default color for other cases
  }
};

  return (
    <div className="mainadd">
      {contextHolder}
      <div className='user' onClick={logout}>
        <AccountCircleOutlinedIcon className='user-icon'/>
        <h1>{name}</h1>
        </div>
      <div className="main-conatiner">

        {/* add task component */}
        <div className="add-container">
          <div className="add-compo">
            <h1>Title</h1>
            <div>
              <Input
                type="text"
                className="stylish-inputadd"
                placeholder="Enter title here"
                value={inputData.title}
                onChange={(e) => {
                  const inputText = e.target.value;
                  if (inputText.length <= 55) {
                    setInputData({ ...inputData, title: inputText });
                  } else {
                    // Truncate the input to 55 characters
                    setInputData({ ...inputData, title: inputText.slice(0, 55) });
                  }
                }}
               
              />
              <Select
                className="selecter"
                placeholder="Priority"
                style={{
                  width: 120,
                }}
                value={inputData.priority || null}

                onChange={(value) => setInputData({ ...inputData, priority: value })}
                options={levels}
              />
            </div>
          </div>
          <div className="add-compo">
            <h1>Description</h1>
            <div style={{ display: 'flex' }}>
              <TextArea
                className="textarea"
                rows={2}
                autoSize={{ minRows: 2, maxRows: 2 }}
                maxLength={250}
                placeholder="Description"
                value={inputData.description}
                onChange={(e) => {
                  const inputText = e.target.value;
                  if (inputText.length <= 300) {
                    setInputData({ ...inputData, description: inputText });
                  } else {
                    // Truncate the input to 300 characters
                    setInputData({ ...inputData, description: inputText.slice(0, 300) });
                  }
                }}
              />
              {editedCardIndex !== null ? (
                <div style={{ display: 'flex', marginTop: '20px' }}>
                  <Button className="button1" type="primary" onClick={handleSaveClick}>
                    Save
                  </Button>
                  <Button className="button1" type="primary" onClick={handleCancelClick}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button className="button" type="primary" onClick={handleAddClick}>
                  Add
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* exisiting card container */}
        <div className="existing-container">
{(textData && textData.length > 0) ? (
    textData.map((item, index) => (
      <div className="card" key={index} onClick={() => toggleButtons(index)}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h1>{item.title}</h1>
          <div style={{ backgroundColor: getPriorityColor(item.priority) }} className="filled-circle"></div>
        </div>
        <p>{item.description}</p>
        {showButtons[index] ? (
          <div className="buttons">
            <Button className="button1" onClick={() => handleEditClick(index)}>
              Edit
            </Button>
            <Button className="button1" onClick={() => handleDeleteClick(index)}>Delete</Button>
          </div>
        ) : null}
      </div>
    ))
  ) : (
    <div className="null-data-message">
      {/* Add the content you want to display when textData is null */}
     <img  src={nodata} alt='No data'/>
    </div>
  )}
</div>

      </div>
    </div>
  );
}

export default Home;
