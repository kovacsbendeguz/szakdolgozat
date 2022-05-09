import {
    Heading,
    Button,
    Container,
    FormControl,
    FormLabel,
    Input,
    Box,
    SimpleGrid,
    FormErrorMessage, useToast,
} from '@chakra-ui/react'
import { Form, Formik, Field } from 'formik'
import ScrollToBottom from 'react-scroll-to-bottom'
import { useNavigate, useParams } from 'react-router-dom'
import Page from '../components/Page'
import MovieCard from '../components/MovieCard'  
import { useEffect, useState } from 'react'
import Chat from '../components/Chat'

export default function Room({socket}) {
    const navigate = useNavigate()
    const toast = useToast()

    const [counter, setCounter] = useState(() => {
        const saved = localStorage.getItem("counter");
        const initialValue = JSON.parse(saved);
        return initialValue || 0;
    });
    
    const [started, setStarted] = useState(() => {
        const saved = localStorage.getItem("started");
        const initialValue = JSON.parse(saved);
        return initialValue || false;
    });

    const [matched, setMatched] = useState(() => {
        const saved = localStorage.getItem("matched");
        const initialValue = JSON.parse(saved);
        return initialValue || false;
    });

    const [messageList, setMessageList] = useState(() => {
        const saved = localStorage.getItem("messageList");
        const initialValue = JSON.parse(saved);
        return initialValue || [{text:"Welcome", from:"admin", time:""}];
    });

    const [matchedMovie, setMatchedMovie] = useState()
    //const handleChange = (event) => setValue(event.target.value)

    const { id } = useParams()
    const code = localStorage.getItem('code') ? localStorage.getItem('code') : id

    async function buttonClick() {
        while(JSON.parse(localStorage.getItem("list"))[counter] === undefined){
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        setCounter(counter + 1)
        localStorage.setItem('counter', counter+1)
        
        if(counter === (JSON.parse(localStorage.getItem("list")).length-8)){
            socket.emit('endOfFilms')
        }
    }

    useEffect(() => {
        socket.off('start').on('start', (list) => {
            localStorage.setItem('list', JSON.stringify(list))
            
            localStorage.setItem('counter', 0)
            setCounter(1)
            setCounter(0)
            localStorage.setItem('started', true)
            setStarted(true)
        }) 

        socket.off('listaRefresh').on('listaRefresh', (list) => {
            var lista = (JSON.parse(localStorage.getItem("list"))).concat(list)
            localStorage.setItem('list', JSON.stringify(lista))
            console.log(JSON.parse(localStorage.getItem("list")))
        })

        socket.off('foundAMatch').on('foundAMatch', (movie) => {
            setMatchedMovie(movie)
            setMatched(true)
        })

        socket.off('continue').on('continue', () => {
            setMatched(false)
        })

        socket.off('message').on('message', (message) => {
            if(message.from === socket.id) {
                message.from = "Me"
            }
            setMessageList((messageList) => [...messageList, message])
        })

        socket.off('askForNewPref').on('askForNewPref', () => {
            toast({
                position: 'top',
                title: 'Nem található elég film ilyen feltételekkel, indíts új keresést',
                status: 'error',
                duration: 6000,
                isClosable: true,
            })
            navigate(`/newroom`)
        })
        
    })

    if(code === null || code === 'null'){
        return (
            <Page>
            <Container>
                <Heading size='md'>Még nem léptél be szobába</Heading> 
                <Button onClick={() => {
                    navigate(`/`)
                    }}>
                        Vissza a főmenübe
                </Button>
                
            </Container>
            </Page>
        )
    }

    if(matched){
        return (
            <Page>
                <Heading size={'lg'}>Siker 🎉</Heading>
                <Container>
                    <MovieCard {...matchedMovie}></MovieCard>
                    <Button onClick={() => {
                        localStorage.removeItem('code')
                        localStorage.setItem('started', false)
                        localStorage.setItem('counter', 0)
                        localStorage.setItem('matched', false)
        
                        if (!localStorage.getItem('code')) {
                        navigate('/')
                        toast({
                            position: 'top',
                            title: 'Sikeres kilépés',
                            status: 'success',
                            duration: 1000,
                            isClosable: true,
                        })
                        } else {
                        toast({
                            position: 'top',
                            title: 'Hiba a kilépés közben',
                            status: 'error',
                            duration: 1000,
                            isClosable: true,
                        })
                        }
                        }}>
                            Kilépés a szobából
                    </Button>
                    <Button onClick={() => {
                        setMatched(false)
                        socket.emit('everybodyContinue')
                        toast({
                            position: 'top',
                            title: 'Sikeres folytatás',
                            status: 'success',
                            duration: 1000,
                            isClosable: true,
                        })
                        }}>
                            Böngészés folytatása mindenkinek
                    </Button>
                </Container>
            </Page>
        )
    }

    if(!started) {
        return (
            <Page>
                <Button onClick={() => {
                    navigate(`/newroom`)
                }}>
                    Keresés szerkesztése
                </Button>
            <Container>
                <Heading size='md'>A szoba kódja: {code}</Heading> 
                <Button onClick={() => {
                    navigator.clipboard.writeText(code)
                    toast({
                        position: 'top',
                        title: 'Vágólapra másolva',
                        status: 'success',
                        duration: 1000,
                        isClosable: true,
                    })
                    }}>
                        Másolás a vágólapra
                </Button>
                
            </Container>
            </Page>
        )
    }

    return (
        
        <Page>
            <Button onClick={() => {
                navigate(`/newroom`)
            }}>
                Keresés szerkesztése
            </Button>
        <SimpleGrid columns={{sm: 2, md: 2}} spacing={30}>
            <Container>
                <MovieCard {...(JSON.parse(localStorage.getItem("list"))[counter])}></MovieCard>
                <Button 
                    onClick={async () => {
                        await buttonClick()

                        const movieID = JSON.parse(localStorage.getItem("list"))[counter].imdb_id
                        socket.emit('swipeLeft', movieID, (error) => {
                            if (error) {
                                return console.log(error)
                            }
                    
                        })
                        
                    }}
                    background={"red"}
                >Nem jó</Button>
                <Button 
                    onClick={async () => {
                        
                        await buttonClick()

                        const movieID = JSON.parse(localStorage.getItem("list"))[counter].imdb_id
                        const email = localStorage.getItem("email") ? localStorage.getItem("email") : ""
                        socket.emit('swipeRight', movieID, email, (error) => {
                            if (error) {
                                return console.log(error)
                            }
                    
                        })
                    }}
                    background={"green"}
                >Jó</Button>
            </Container>
            <Box borderRadius='md' bg='pink'>
                <Heading>Chatbox</Heading>
                <ScrollToBottom className='chatboxWithScroll'>
                    {messageList.map((message) => {
                        return (
                            <Chat key={message.time} {...message}></Chat>
                        )
                    })}
                </ScrollToBottom>
                <Formik
                    initialValues={{ message: '' }}
                    onSubmit={(values, actions) => {
                        socket.emit('messageFrom', values.message)
                        values.message = ''
                    }}
                    >
                    {(props) => (
                        <Form>
                        <Field name='message'>
                            {({ field, form }) => (
                            <FormControl isInvalid={form.errors.message && form.touched.message} isRequired>
                                <FormLabel htmlFor='message'>Message</FormLabel>
                                <Input {...field} id='message' placeholder='message' />
                                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                            </FormControl>
                            )}
                        </Field>
                        <Button
                            mt={4}
                            colorScheme='teal'
                            type='submit'
                        >
                            Send
                        </Button>
                        </Form>
                    )}
                </Formik>
                
            </Box>
        </SimpleGrid>
       
        
        </Page>
    )
}

