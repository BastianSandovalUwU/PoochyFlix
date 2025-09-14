import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlay, FaPlus, FaSearch, FaBars } from 'react-icons/fa';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 68px;
  background: linear-gradient(180deg, rgba(0,0,0,0.7) 10%, transparent);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4%;
  z-index: 1000;
  transition: background-color 0.3s ease;

  &.scrolled {
    background-color: rgba(0, 0, 0, 0.9);
  }
`;

const Logo = styled(Link)`
  color: #e50914;
  font-size: 24px;
  font-weight: 700;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: #f40612;
  }
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  list-style: none;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 400;
  transition: color 0.3s ease;

  &:hover {
    color: #b3b3b3;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

interface SearchInputProps {
  expanded: boolean;
}

const SearchInput = styled.input<SearchInputProps>`
  background: transparent;
  border: 1px solid #ffffff;
  border-radius: 4px;
  color: #ffffff;
  padding: 8px 12px;
  width: ${props => props.expanded ? '200px' : '0'};
  opacity: ${props => props.expanded ? '1' : '0'};
  transition: all 0.3s ease;

  &::placeholder {
    color: #b3b3b3;
  }

  &:focus {
    outline: none;
    border-color: #ffffff;
  }
`;

const SearchButton = styled.button`
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #b3b3b3;
  }
`;

const UploadButton = styled(Link)`
  background: #e50914;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background: #f40612;
  }
`;

const MobileMenuButton = styled.button`
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 8px;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar: React.FC = () => {
  const [searchExpanded, setSearchExpanded] = useState<boolean>(false);

  const handleSearchToggle = (): void => {
    setSearchExpanded(!searchExpanded);
  };

  return (
    <Nav id="navbar">
      <Logo to="/">
        <FaPlay />
        PoochyFlix
      </Logo>

      <NavItems>
        <NavItem to="/">Inicio</NavItem>
        <NavItem to="/upload">Subir Video</NavItem>
      </NavItems>

      <RightSection>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Buscar videos..."
            expanded={searchExpanded}
            onBlur={() => setTimeout(() => setSearchExpanded(false), 200)}
          />
          <SearchButton onClick={handleSearchToggle}>
            <FaSearch />
          </SearchButton>
        </SearchContainer>

        <UploadButton to="/upload">
          <FaPlus />
          Subir
        </UploadButton>

        <MobileMenuButton>
          <FaBars />
        </MobileMenuButton>
      </RightSection>
    </Nav>
  );
}

export default Navbar;
