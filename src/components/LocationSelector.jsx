import styled from '@emotion/styled';
import { locations } from '../data/locations';

const Container = styled.div`
  display: flex;
  width: 120%;
  height: 40vh;
  overflow: hidden;
  margin-left: -10%;
  border-radius: 1rem;
  box-shadow: 
    0 10px 30px -5px rgba(0, 0, 0, 0.2),
    0 4px 6px -2px rgba(0, 0, 0, 0.05),
    0 0 0 1px rgba(0, 0, 0, 0.05),
    inset 0 2px 4px 0 rgba(255, 255, 255, 0.04);

  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
    flex-direction: column;
    height: auto;
    min-height: 60vh;
  }
`;

const LocationPanel = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1f2937;
  position: relative;
  transform: skew(-20deg);
  margin: 0 -1px;
  border-right: 1px solid #4b5563;
  transition: all 500ms ease-in-out;
  overflow: hidden;
  cursor: none;
  
&:first-of-type {
    margin-left: -10%;
    padding-left: 10%;
  }
  
  &:last-of-type {
    border-right: none;
    margin-right: -10%;
    padding-right: 10%;
  }

  @media (max-width: 768px) {
    transform: none;
    min-height: 120px;
    border-right: none;
    border-bottom: 1px solid #4b5563;
    margin: 0;
    padding: 0;
    
    &:first-of-type {
      margin-left: 0;
      padding-left: 0;
    }
    
    &:last-of-type {
      margin-right: 0;
      padding-right: 0;
      border-bottom: none;
    }
  }

  &:hover {
    flex: 5;
    background-color: #374151;

    @media (max-width: 768px) {
      flex: 3;
    }
  }
`;

const CustomCursor = styled.div`
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  font-size: 2rem;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.2s ease;

  &.visible {
    opacity: 1;
  }
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: -50%;
  width: 220%;
  bottom: 0;
  background-image: url(${props => props.backgroundImage});
  background-size: cover;
  background-position: center;
  transform: skew(20deg);
  transition: all 500ms ease-in-out;

  @media (max-width: 768px) {
    left: 0;
    width: 100%;
    transform: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.2);
    transition: opacity 500ms ease-in-out;
  }

  ${LocationPanel}:hover & {
    &::before {
      opacity: 0;
    }
  }
`;

const LocationText = styled.span`
  position: relative;
  color: rgba(255, 255, 255, 0.9);
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  transform: rotate(-90deg) skew(-20deg);
  transition: all 500ms ease-in-out;
  -webkit-text-fill-color: rgba(255, 255, 255, 0.9);
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.9);
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3);
  z-index: 1;

  @media (max-width: 768px) {
    transform: none;
    font-size: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    
    &::after {
      position: static;
      transform: none;
      font-size: 2rem;
      opacity: 1;
      visibility: visible;
    }
  }

  ${LocationPanel}:hover & {
    transform: skew(20deg);

    @media (max-width: 768px) {
      transform: none;
    }
  }
`;

function LocationSelector({ onLocationSelect, selectedLocation }) {
  const handleMouseMove = (e, flag) => {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      cursor.textContent = flag;
      cursor.classList.add('visible');
    }
  };

  const handleMouseLeave = () => {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
      cursor.classList.remove('visible');
    }
  };

  return (
    <>
      <CustomCursor className="custom-cursor" />
      <Container>
        {Object.keys(locations).map((locationKey) => (
          <LocationPanel
            key={locationKey}
            onClick={() => onLocationSelect(locationKey)}
            onMouseMove={(e) => handleMouseMove(e, locations[locationKey].flag)}
            onMouseLeave={handleMouseLeave}
          >
            <BackgroundImage backgroundImage={locations[locationKey].images[0]} />
            <LocationText data-flag={locations[locationKey].flag}>
              {locations[locationKey].title}
            </LocationText>
          </LocationPanel>
        ))}
      </Container>
    </>
  );
}

export default LocationSelector;