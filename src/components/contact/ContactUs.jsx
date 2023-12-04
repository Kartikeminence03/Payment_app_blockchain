import { useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../backend_Url/baseUrl';
import { toast } from 'react-toastify';
import '../../pages/home/Home.css'

const style = {
    display: "inline-block",
    position: "relative",
  };

const ContactUs = () => {
    const [contact,setContact] = useState({firstName:"",lastName:"",phone:"",perEmail:"",digiMessage:""});
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const messageInput = (event)=>{
    console.log(event.target.value);
    setContact({...contact,[event.target.name]: event.target.value});
  }

  const sendMessage = async()=>{
    try {
      const response = await axios.post(`${baseUrl}send-message`, {
        contact
      });

      const message = await response.data;
      toast.success(message.message)
    } catch (error) {
      toast.error(error)
    }
  };

  const {firstName,lastName,phone,perEmail,digiMessage} = contact;

  return (
    <div className="claim-container" style={{marginTop: "350px"}}>
          <div className="claim-content">
            <h2>Contact Us</h2>
            <div className="pay-container">
              <span className="pay-label1">First Name</span>
              <div style={style}>
                <input
                name='firstName'
                  scale="md"
                  className="progress-input pay-input"
                  id="pay-input"
                  onChange={messageInput}
                  type="text"
                  // value={reEmail}
                  required
                />
              </div>
              <span className="pay-label1">Last Name</span>
              <div style={style}>
                <input
                name='lastName'
                  scale="md"
                  className="progress-input pay-input"
                  id="pay-input"
                  onChange={messageInput}
                  type="text"
                  // value={reEmail}
                  required
                />
              </div>
            </div>

            <div className="pay-container">
              <span className="pay-label1">Phone Number</span>
              <div style={style}>
                <input
                name='phone'
                  scale="md"
                  className="progress-input pay-input"
                  id="pay-input"
                  onChange={messageInput}
                  type="text"
                  // value={reEmail}
                  required
                />
              </div>
              <span className="pay-label1">Email Address</span>
              <div style={style}>
                <input
                name='perEmail'
                  scale="md"
                  className="progress-input pay-input"
                  id="pay-input"
                  onChange={messageInput}
                  type="email"
                  // value={reEmail}
                  required
                />
              </div>
            </div>

            <div className="pay-container">
              <span className="pay-label1">Message</span>
              <div style={style}>
                <textarea
                name='digiMessage'
                  scale="md"
                  className="progress-input pay-input"
                  id="pay-input"
                  onChange={messageInput}
                  type="email"
                  // value={reEmail}
                  required
                />
              </div>
            </div>
            {!firstName == "" && !lastName == "" && !perEmail == "" && !phone == "" && !digiMessage == ""? <button
              className="claim-button"
              scale="md"
              id="claim"
              style={{ "margin-top": "40px;" }}
              disabled={buttonDisabled}
              onClick={() => sendMessage()}
            >
              Submit
            </button>: <button
              className="claim-button"
              scale="md"
              id="claim"
              style={{ "margin-top": "40px;" }}
              disabled={!buttonDisabled}
              onClick={() => sendMessage()}
            >
              Submit
            </button>}
          </div>
        </div>
  )
}

export default ContactUs