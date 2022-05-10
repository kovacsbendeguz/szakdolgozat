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
  FiUser,
} from 'react-icons/fi'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

const code = sessionStorage.getItem('code')

let LinkItems = [
  { name: 'Főmenü', icon: FiHome, to: '/' },
  { name: 'Szoba', icon: FiCodesandbox, to: `/room/${code}` },
  { name: 'Filmek', icon: FiFilm, to: '/films' },
  { name: 'Kategóriák', icon: FiGrid, to: '/genres' },
]

const getHeaderText = (path) => {
  const code = sessionStorage.getItem('code')
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
  const code = sessionStorage.getItem('code')

  if(isOpen){
      /*if(sessionStorage.getItem("token")){
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
      }*/
  }

  return (
  <Box minH="100vh" backgroundColor={"#2e3136"}>
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
      bg={useColorModeValue('#2e3136', 'gray.900')}
      color={'white'}
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
        borderColor={"white"}
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'rgb(233, 48, 56, 0.8)',
          color: 'white',
          shadow: '0px 0px 60px 1px #e93038',
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
    if (!sessionStorage.getItem("token")) {
        userMiniMenu = 
        <MenuList
          bg= 'rgb(46, 49, 54, 0.9)'
          color= 'white'
          border={'none'}
          borderRadius='lg'
          shadow='0px 0px 60px 1px #e93038'
        >
            <MenuItem 
            borderRadius="lg"
            _hover={{
              bg: 'rgb(233, 48, 56, 0.8)',
              color: 'white',
              shadow: '0px 0px 60px 1px #e93038',
            }}
            onClick={() => {
                navigate('/login')
            }}
            >Bejelentkezés
            </MenuItem>
            <MenuItem 
            borderRadius="lg"
            _hover={{
              bg: 'rgb(233, 48, 56, 0.8)',
              color: 'white',
              shadow: '0px 0px 60px 1px #e93038',
            }} 
            onClick={() => {
                navigate('/registration')
            }}>Regisztráció
            </MenuItem>
        </MenuList>
    } else {
        userMiniMenu = 
        <MenuList
          bg= '#2e3136'
          _hover={{
            bg: 'rgb(233, 48, 56, 0.8)',
            color: 'white',
            shadow: '0px 0px 60px 1px #e93038',
          }}
        >
            <MenuItem onClick={() => {
              sessionStorage.removeItem('token')
              sessionStorage.removeItem('email')
              sessionStorage.removeItem('userData')
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
          color={'white'}
          height="20"
          alignItems="center"
          bg={useColorModeValue('#2e3136')}
          
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
          border='none'
          _hover={{
            bg: 'rgb(233, 48, 56, 0.15)',

            color: 'white',
            shadow: '0px 0px 60px 1px #e93038',
          }}
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
              <Flex alignItems="center">
                  <Menu>
                      <MenuButton
                          py={2}
                          transition="all 0.3s"
                          color={'white'}
                          _focus={{ boxShadow: 'none' }}
                          border='none'
                          _hover={{
                            bg: 'rgb(233, 48, 56, 0.15)',
                            borderRadius: 'lg',
                            color: 'white',
                            shadow: '0px 0px 60px 1px #e93038',
                          }}
                      >
                          <HStack >
                          User
                          <Icon as={FiUser}></Icon>
                          <VStack
                              //display={{ base: 'none', md: 'flex' }}
                              alignItems="flex-start"
                              spacing="1px"
                              ml="2"
                          >
                              <Text fontSize="sm" >User</Text>
                          </VStack>

                          <Box /*display={{ base: 'flex', md: 'none' }}*/>
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
