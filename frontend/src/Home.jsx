import './Home.css'
import { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaSpotify} from 'react-icons/fa';

function Home() {

  const [music, setMusic] = useState({ is_playing: false, title: "", artist: "", album_cover: "" });

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/music");
        const data = await response.json();
        setMusic(data);
      } catch (error) {
        console.error("Failed to fetch music data");
      }
    };

    fetchMusic(); 
    const interval = setInterval(fetchMusic, 15000); // Pings Last.fm every 15 seconds  

    return () => clearInterval(interval); // Cleans up the loop if the component unmounts
  }, []);

  const [formData, setFormData] = useState({
    client_name: "",
    discord_tag: "",
    description: "",
    budget: ""
  });

  const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/commissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), 
      }); 

      if (response.ok) { 
        alert("Commission request sent successfully!");
        setFormData({client_name: "", discord_tag: "", description: "", budget: ""});
      } else { 
        alert("Failed to send request. Check backend");
      }
    } catch(error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="home-wrapper">
      <div className="app-container">

        <div className="glow-blob glow-top-left"></div>
        <div className="glow-blob glow-bottom-right"></div>

        <div className="stars-layer">
          <div className="star" style={{ top: '15%', left: '20%', width: '3px', height: '3px', animationDuration: '2s' }}></div>
          <div className="star" style={{ top: '65%', left: '10%', width: '2px', height: '2px', animationDuration: '3.5s' }}></div>
          <div className="star" style={{ top: '25%', left: '80%', width: '4px', height: '4px', animationDuration: '2.8s' }}></div>
          <div className="star" style={{ top: '80%', left: '75%', width: '3px', height: '3px', animationDuration: '4s' }}></div>
          <div className="star" style={{ top: '10%', left: '60%', width: '2px', height: '2px', animationDuration: '3s' }}></div>
          <div className="star" style={{ top: '50%', left: '90%', width: '3px', height: '3px', animationDuration: '2.2s' }}></div>
          <div className="star" style={{ top: '40%', left: '30%', width: '3px', height: '3px', animationDuration: '2.5s' }}></div>
        </div>

        <div className="status-pill">
          <div className="status-dot"></div>
          <span>Commissions Open</span>
        </div>

        <div className="social-links">
          <a href="https://github.com/nadimahmad-nve" target="_blank" rel="noopener noreferrer">
          <FaGithub />
          </a>
          <a href="https://www.linkedin.com/in/syed-nadim-ahmad/" target="_blank" rel="noopener noreferrer">
          <FaLinkedin />
          </a>
        </div>

        <h1> Request a Commission </h1>

        <form className="commission-form" onSubmit={handleSubmit}> 
          
          <div className="input-group">
            <label>Client Name</label>
            <input 
              type="text" 
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Discord Tag</label>
            <input 
              type="text" 
              name="discord_tag"
              value={formData.discord_tag}
              onChange={handleChange}
            />
          </div>
          
          <div className="input-group">
            <label>Project Description</label>
            <textarea 
              rows="4" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
            />
          </div>

          <div className="input-group">
            <label>Budget ($USD)</label>
            <input 
              type="number" 
              min="0"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-btn">Submit</button>
        </form>  

        <div className="spotify-widget">
          {music.is_playing ? (
            <img 
              src={music.album_cover} 
              alt={`${music.title} Album Cover`} 
              className="album-cover" 
            />
          ) : (
            <div className="album-cover" style={{ backgroundColor: '#333' }}></div>
          )}
          
          <div className="spotify-info">
            <span className="spotify-label">
              {music.is_playing ? "Currently Listening to" : "Spotify Offline"}
            </span>
            <span className="spotify-song">
              {music.is_playing ? `${music.title} - ${music.artist}` : ""}
            </span>
          </div>
          
          <FaSpotify className="spotify-icon" />
        </div>

      </div>
    </div>
  )
}

export default Home