import styled from '@emotion/styled';

const HeaderContainer = styled.header`
    text-align: center;
    padding: 2rem 0;
`;

const Title = styled.h1`
    position: relative;
    font-weight: 900;
    font-size: 3rem;
    margin: 0;
    font-family: 'Inter', system-ui, sans-serif;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    background: linear-gradient(to bottom, 
        #ffffff 0%, 
        #ffffff 50%, 
        #ff0000 50%, 
        #ff0000 100%
    );
    -webkit-background-clip: text;
    color: transparent;
    background-clip: text;
    filter: drop-shadow(4px 4px 0px rgba(0, 0, 0, 0.1))
           drop-shadow(0px 2px 20px rgba(0, 0, 0, 0.15));
    transition: transform 0.2s ease;
    
    &:hover {
        transform: scale(1.02);
    }
`;

function Header() {
    return (
        <HeaderContainer>
            <Title>Patryk Sobczak</Title>
        </HeaderContainer>
    );
}

export default Header;