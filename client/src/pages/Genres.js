import {
    Container,
    Flex,
    Heading,
    List,
    ListItem,
    Button,
  } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Page from '../components/Page'

export default function Genres({socket}) {
    const navigate = useNavigate()

    const [genreList, setGenreList] = useState( () => {
        const saved = sessionStorage.getItem('userData');
        if(saved) {
            return (JSON.parse(saved)).genres
        }
        return []
    });

    const email = sessionStorage.getItem('email')

    useEffect(() => {
        socket.off('getGenreListOfUser').on('getGenreListOfUser', (list) => {
            setGenreList((genreList) => [...genreList, list])
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
            <Heading>Kedvelt kategóriák</Heading>
        </Flex>
        <List spacing={1}>
            {genreList.length > 0 ? genreList.map((element) => {
                return (
                    <ListItem border='1px' key={element}>{element}</ListItem>
                )
            })
            :
            <ListItem key={"noGenres"}>A lista üres</ListItem>
        }
            
        </List>
    </Container>
    </Page>
)}
