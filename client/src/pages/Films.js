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
        socket.off('getMovieListOfUser').on('getMovieListOfUser', (list) => {
            setMovieList((movieList) => [...movieList, list])
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
            <Heading>Jobbra húzott filmek</Heading>
        </Flex>
        <Button onClick={() => {
                    console.log("HÁH")
                }}>
                    Frissítés
                </Button>
        <List spacing={1}>
            {movieList.length > 0 ? movieList.map((element) => {
                return (
                    <ListItem border='1px' key={element.imdbID}>{element.name} (IMDB: {element.imdbID}) mentve: {element.dateOfSave}</ListItem>
                )
            })
            :
            <ListItem key={"noMovies"}>A lista üres</ListItem>
        }
            
        </List>
    </Container>
    </Page>
)}
