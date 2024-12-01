import { locations } from '../data/locations';
import styled from '@emotion/styled';
import { 
  FaCalendarAlt,    // Calendar icon
  FaUser,           // User icon
  FaBullseye,       // Target/hobbies icon
  FaGraduationCap,  // Graduation cap icon
  FaStar,           // Star icon
  FaUsers,          // Users icon
  FaCity,           // City icon
  FaIndustry       // Industry icon
} from 'react-icons/fa';  // Using Font Awesome icons
import { motion } from 'framer-motion';

const StyledContent = styled.div`
  color: #374151;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  margin-top: 3rem;
  text-align: center;
  
  h2 {
    font-weight: 500;
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: #1f2937;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #4b5563;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const ContainersWrapper = styled(motion.div)`
  display: flex;
  gap: 24px;
  margin: 32px auto 0;
  max-width: 800px;
`;

const InfoContainer = styled.div`
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1),
    0 1px 2px 0 rgb(0 0 0 / 0.05);
  position: relative;
  overflow: hidden;
`;

const PersonalContainer = styled(InfoContainer)`
  flex: 0 0 60%;
`;

const CityContainer = styled(InfoContainer)`
  flex: 0 0 40%;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateX(8px);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const IconContainer = styled.div`
  background: #f8fafc;
  border-radius: 16px;
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #4b5563;
  box-shadow: 0 2px 4px rgb(0 0 0 / 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: #374151;
    color: white;
  }
`;

const ContentBox = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 0 20px;
  flex-grow: 1;
  min-height: 64px;
  display: flex;
  align-items: center;
  font-weight: 400;
  color: #4b5563;
  text-align: left;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23374151' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.5;
  }
  
  ul {
    margin: 0;
    padding-left: 20px;
    list-style-type: none;
    width: 100%;
    
    li {
      position: relative;
      padding: 4px 0;
      text-align: left;
      
      &:before {
        content: "•";
        color: #3b82f6;
        font-weight: bold;
        position: absolute;
        left: -15px;
      }
    }
  }
  
  p {
    margin: 0;
    font-size: 1rem;
  }
`;

function LocationContent({ location }) {
  if (!location) {
    return (
      <StyledContent className="welcome-message">
        Please select a location to learn about my journey
      </StyledContent>
    );
  }

  const locationData = locations[location];

  return (
    <StyledContent className="location-content">
      <h2>{locationData.location} {locationData.flag}</h2>
      <p>{locationData.description}</p>
      
      <ContainersWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PersonalContainer>
          <InfoRow>
            <IconContainer>
              <FaCalendarAlt />
            </IconContainer>
            <ContentBox>
              <p>Period: {locationData.dateRange}</p>
            </ContentBox>
          </InfoRow>
          
          <InfoRow>
            <IconContainer>
              <FaUser />
            </IconContainer>
            <ContentBox>
              <p>Age: {locationData.ageRange}</p>
            </ContentBox>
          </InfoRow>
          
          <InfoRow>
            <IconContainer>
              <FaBullseye />
            </IconContainer>
            <ContentBox>
              <ul>
                {locationData.hobbies.map((hobby, index) => (
                  <li key={index}>{hobby}</li>
                ))}
              </ul>
            </ContentBox>
          </InfoRow>
          
          <InfoRow>
            <IconContainer>
              <FaGraduationCap />
            </IconContainer>
            <ContentBox>
              <p>{locationData.education}</p>
            </ContentBox>
          </InfoRow>
        </PersonalContainer>

        <CityContainer>
          <InfoRow>
            <IconContainer>
              <FaUsers />
            </IconContainer>
            <ContentBox>
              <p>Population: {locationData.population}</p>
            </ContentBox>
          </InfoRow>
          
          <InfoRow>
            <IconContainer>
              <FaCity />
            </IconContainer>
            <ContentBox>
              <p>Founded: {locationData.founded}</p>
            </ContentBox>
          </InfoRow>
          
          <InfoRow>
            <IconContainer>
              <FaIndustry />
            </IconContainer>
            <ContentBox>
              <p>Known for: {locationData.knownFor}</p>
            </ContentBox>
          </InfoRow>
          
          <InfoRow>
            <IconContainer>
              <FaStar />
            </IconContainer>
            <ContentBox>
              <ul>
                {locationData.highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </ContentBox>
          </InfoRow>
        </CityContainer>
      </ContainersWrapper>
    </StyledContent>
  );
}

export default LocationContent;