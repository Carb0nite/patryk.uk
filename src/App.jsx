import { useState } from 'react';
import styled from '@emotion/styled';
import Header from './components/Header';
import LocationSelector from './components/LocationSelector';
import LocationContent from './components/LocationContent';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
  color: white;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 4rem;
`;

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <AppContainer>
      <Header />
      <MainContent>
        <LocationSelector 
          onLocationSelect={setSelectedLocation} 
          selectedLocation={selectedLocation}
        />
        <LocationContent location={selectedLocation} />
      </MainContent>
    </AppContainer>
  );
}

export default App; 