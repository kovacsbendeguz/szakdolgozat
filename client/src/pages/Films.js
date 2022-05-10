import {
    Container,
    Flex,
    Heading,
    List,
    ListItem,
    Text,
    Button,
  } from '@chakra-ui/react'
import '../themes/Pages.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Page from '../components/Page'

export default function Films({socket}) {
    const navigate = useNavigate()

    const [movieList, setMovieList] = useState( () => {
        const saved = sessionStorage.getItem('userData');
        if(saved) {
            return (JSON.parse(saved)).movies
        }
        return []
    });

    const email = sessionStorage.getItem('email')

    useEffect(() => {
        socket.off('getMovieListOfUser').on('getMovieListOfUser', (userData) => {
            console.log(userData)
            setMovieList(userData.movies)
        })
    }) 

    if(!email || email === ''){
        return(
            <Page>
            <Container
                borderRadius={'30px'}
                padding={'1em'}
                backgroundColor={'rgb(233, 48, 56, 0.01)'}
                shadow= '0px 0px 60px 1px #e93038'
                color= 'white'>
                <Flex alignItems="center" style={{ marginBottom: 24 }}>
                    <Heading>Jelentkezz be vagy regisztrálj a megtekintéshez</Heading>
                </Flex>
                <Button 
                    backgroundColor="#2e3136"
                    border={'1px'}
                    borderColor={'#e93038'}
                    marginLeft="1em"
                    marginRight="1em"
                    _hover={{
                        bg: 'rgb(233, 48, 56, 0.8)',
                        color: 'white',
                        shadow: '0px 0px 60px 1px #e93038',
                      }}
                    onClick={() => {
                        navigate('/login')
                    }}>
                    Bejelentkezés
                </Button>
                <Button 
                    backgroundColor="#2e3136"
                    border={'1px'}
                    borderColor={'#e93038'}
                    _hover={{
                        bg: 'rgb(233, 48, 56, 0.8)',
                        color: 'white',
                        shadow: '0px 0px 60px 1px #e93038',
                      }}
                    onClick={() => {
                    navigate('/registration')
                }}>
                    Regisztráció
                </Button>
            </Container>
            </Page>
        )
    }

    return(
    <Page>
    <Container>
        <Flex alignItems="center" style={{ marginBottom: 24 }}>
            <Heading>Jobbra húzott filmek</Heading>
        </Flex>
        <Button 
            backgroundColor="#2e3136"
            border={'1px'}
            borderColor={'#e93038'}
            _hover={{
                bg: 'rgb(233, 48, 56, 0.8)',
                color: 'white',
                shadow: '0px 0px 60px 1px #e93038',
              }}
            onClick={() => {
                socket.emit('refreshMovieListOfUser', email)
            }}>
                    Frissítés
                </Button>
        <List spacing={1}>
            {movieList.length > 0 ? movieList.map((element) => {
                return (
                    <ListItem border='1px' borderColor='#e93038' padding='1px' key={element.imdbID}>
                        <Heading size={'md'}>{element.name}</Heading>
                        <Text size='sm'>IMDB: {element.imdbID}</Text>
                        <Text size='sm'>Mentve: {element.dateOfSave}</Text>
                    </ListItem>
                )
            })
            :
            <ListItem key={"noMovies"}>A lista üres</ListItem>
        }
            
        </List>
    </Container>
    </Page>
)}
