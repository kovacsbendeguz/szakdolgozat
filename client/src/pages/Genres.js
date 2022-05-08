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
        const saved = localStorage.getItem('userData');
        if(saved) {
            return (JSON.parse(saved)).genres
        }
        return []
    });

    const email = localStorage.getItem('email')

    useEffect(() => {
        socket.off('getGenreListOfUser').on('getGenreListOfUser', (list) => {
            setGenreList((genreList) => [...genreList, list])
        })
    }) 

    if(!email || email === ''){
        return(
            <Page>
            <Container>
                <Flex alignItems="center" style={{ marginBottom: 24 }}>
                    <Heading>Jelentkezz be vagy regisztrálj a megtekintéshez</Heading>
                </Flex>
                <Button onClick={() => {
                    navigate('/login')
                }}>
                    Bejelentkezés
                </Button>
                <Button onClick={() => {
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
