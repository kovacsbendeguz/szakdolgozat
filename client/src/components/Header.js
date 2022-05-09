import React from 'react'
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import {
  FiHome,
  FiBell,
  FiChevronDown,
  FiMenu,
  FiFilm,
  FiGrid,
  FiCodesandbox,
  FiLogIn,
  FiLogOut,
  FiUserPlus,
} from 'react-icons/fi'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

const code = localStorage.getItem('code')

let LinkItems = [
  { name: 'Főmenü', icon: FiHome, to: '/' },
  { name: 'Szoba', icon: FiCodesandbox, to: `/room/${code}` },
  { name: 'Filmek', icon: FiFilm, to: '/films' },
  { name: 'Kategóriák', icon: FiGrid, to: '/genres' },
]

const getHeaderText = (path) => {
  const code = localStorage.getItem('code')
  switch (path) {
    case `/room/${code}`:
      return 'Szoba'
    case '/films':
      return 'Filmek'
    case '/genres':
      return 'Kategóriák'
    default:
      return ''
  }
}

export default function SidebarWithHeader({
  children,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const code = localStorage.getItem('code')

  if(isOpen){
      if(localStorage.getItem("token")){
          LinkItems = [
              { name: 'Főmenü', icon: FiHome, to: '/' },
              { name: 'Szoba', icon: FiCodesandbox, to: `/room/${code}` },
              { name: 'Filmek', icon: FiFilm, to: '/films' },
              { name: 'Kategóriák', icon: FiGrid, to: '/genres' },
              { name: 'Kijelentkezés', icon: FiLogOut, to: '/login' },
          ]
      }
      else {
          LinkItems = [
              { name: 'Főmenü', icon: FiHome, to: '/' },
              { name: 'Szoba', icon: FiCodesandbox, to: `/room/${code}` },
              { name: 'Filmek', icon: FiFilm, to: '/films' },
              { name: 'Kategóriák', icon: FiGrid, to: '/genres' },
              { name: 'Bejelentkezés', icon: FiLogIn, to: '/login' },
              { name: 'Regisztráció', icon: FiUserPlus, to: '/registration' },
          ]
      }
  }

  return (
  <Box minH="100vh">
      <SidebarContent
      onClose={() => onClose}
      display={{ base: 'none', md: 'block' }}
      />
      <Drawer
      autoFocus={false}
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
      returnFocusOnClose={false}
      onOverlayClick={onClose}
      size="full"
      >
      <DrawerContent>
          <SidebarContent onClose={onClose} />
      </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
      {children}
      </Box>
  </Box>
  )
}

function SidebarContent({ onClose, ...rest }) {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          MovieSwipe
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} to={link.to} icon={link.icon} onClick={onClose}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  )
}

function NavItem({
  icon, children, to, ...rest
}) {
  return (
    <NavLink to={to}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </NavLink>
  )
}

function MobileNav({ onOpen, ...rest }) {
    const location = useLocation()
    const navigate = useNavigate()
    const headerText = getHeaderText(location.pathname)

    let userMiniMenu;
    if (!localStorage.getItem("token")) {
        userMiniMenu = 
        <MenuList
            bg='white'
            borderColor='gray.200'
        >
            <MenuItem onClick={() => {
                navigate('/login')
            }}
            >Bejelentkezés
            </MenuItem>
            <MenuDivider />
            <MenuItem onClick={() => {
                navigate('/registration')
            }}>Regisztráció
            </MenuItem>
        </MenuList>
    } else {
        userMiniMenu = 
        <MenuList
            bg='white'
            borderColor='gray.200'
        >
            <MenuItem>Profilom</MenuItem>
            <MenuItem>Beállítások</MenuItem>
            <MenuDivider />
            <MenuItem onClick={() => {
              localStorage.removeItem('token')
              localStorage.removeItem('email')
              localStorage.removeItem('userData')
              navigate('/login')
            }}
            >
            Kijelentkezés
            </MenuItem>
        </MenuList>
            
    }

    return (
    <Flex
        ml={{ base: 0, md: 60 }}
        px={{ base: 4, md: 4 }}
        height="20"
        alignItems="center"
        bg={useColorModeValue('white', 'gray.900')}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
        justifyContent={{ base: 'space-between' }}
        {...rest}
    >
        <Text
        display={{ base: 'flex' }}
        fontSize="2xl"
        fontWeight="bold"
        textAlign="left"
        >
        {headerText}
        </Text>
        <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
        />

        <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
        >
        Logo
        </Text>
        <HStack spacing={{ base: '0', md: '6' }}>
            <IconButton
                size="lg"
                variant="ghost"
                aria-label="open menu"
                icon={<FiBell />}
            />
            <Flex alignItems="center">
                <Menu>
                    <MenuButton
                        py={2}
                        transition="all 0.3s"
                        _focus={{ boxShadow: 'none' }}
                    >
                        <HStack>
                        User
                        <VStack
                            display={{ base: 'none', md: 'flex' }}
                            alignItems="flex-start"
                            spacing="1px"
                            ml="2"
                        >
                            <Text fontSize="sm">User</Text>
                        </VStack>
                        <Box display={{ base: 'none', md: 'flex' }}>
                            <FiChevronDown />
                        </Box>
                        </HStack>
                    </MenuButton>
                    {userMiniMenu}
                </Menu>
            </Flex>
        </HStack>
    </Flex>
  )
}
