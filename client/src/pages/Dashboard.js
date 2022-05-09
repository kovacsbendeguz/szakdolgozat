import {
  Button,
  Flex,
  Container,
  FormControl,
  FormLabel,
  Input,
  Box,
  SimpleGrid,
  FormErrorMessage, useToast,
} from '@chakra-ui/react'
import { Form, Formik, Field } from 'formik'
import { useNavigate } from 'react-router-dom'
import Page from '../components/Page'

export default function Dashboard({socket}) {
  const navigate = useNavigate()
  const toast = useToast()

  if(sessionStorage.getItem('code')){
    return (
      <Page>
        <Container>
          <Formik
            initialValues={{ code: '', password: '' }}
            onSubmit={async (values, actions) => {
              sessionStorage.removeItem('code')
              sessionStorage.setItem('started', false)
              sessionStorage.setItem('counter', 0)
              sessionStorage.setItem('matched', false)

              if (!sessionStorage.getItem('code')) {
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
              actions.setSubmitting(false)
          }}
        >
          {(props) => (
            <Form>
              <Button 
                mt={4}
                colorScheme="teal"
                isLoading={props.isSubmitting}
                type="submit"
              >
                Kilépés a szobából
              </Button>                    
            </Form>
          )}
        </Formik>
      </Container>
    </Page>
    )
  }

  return (
    <Page>
      <Container>
        <SimpleGrid columns={{sm: 2, md: 2}} spacing={30}>
          <Box>  {/**letrehozas */}
            <Flex alignItems="center" style={{ marginBottom: 24 }}>
              <Formik
                  initialValues={{ code: '', password: '' }}
                  onSubmit={async (values, actions) => {
                    socket.emit('join', { code:values.code }, (error, code) => {
                      if (error) {
                        sessionStorage.removeItem('code')
                        toast({
                          position: 'top',
                          title: 'Hiba',
                          status: 'error',
                          duration: 1000,
                          isClosable: true,
                        })
                      }
                      else {
                        sessionStorage.setItem('code', code)
                        navigate('/newroom')
                        toast({
                          position: 'top',
                          title: 'Sikeres létrehozás',
                          status: 'success',
                          duration: 1000,
                          isClosable: true,
                        })
                      }
                    })
                    actions.setSubmitting(false)
                }}
              >
                {(props) => (
                  <Form>
                    <Button 
                      mt={4}
                      colorScheme="teal"
                      isLoading={props.isSubmitting}
                      type="submit"
                    >
                      Szoba létrehozása
                    </Button>                    
                  </Form>
                )}
              </Formik>
            </Flex>
          </Box>
          <Box>  {/**kod */}
            <Flex alignItems="center" style={{ marginBottom: 24 }}>
              <Formik
                  initialValues={{ code: '' }}
                  onSubmit={async (values, actions) => {
                  
                    socket.emit('join', { code:values.code }, (error) => {
                      sessionStorage.removeItem('code')
                      if (error) {
                        toast({
                          position: 'top',
                          title: 'Hibás kód',
                          status: 'error',
                          duration: 1000,
                          isClosable: true,
                        })
                      }
                      else if(values.code === "") {
                        toast({
                          position: 'top',
                          title: 'Nincs kód megadva',
                          status: 'error',
                          duration: 1000,
                          isClosable: true,
                        })
                      }
                      else {
                        sessionStorage.setItem('code', values.code)
                        navigate(`/room/${values.code}`)
                        toast({
                          position: 'top',
                          title: 'Sikeres belépés',
                          status: 'success',
                          duration: 1000,
                          isClosable: true,
                        })
                      }
                    })
                    actions.setSubmitting(false)
                }}
              >
                {(props) => (
                  <Form>
                    <Button 
                      mt={4}
                      colorScheme="teal"
                      isLoading={props.isSubmitting}
                      type="submit"
                    >
                      Csatlakozás szobához
                    </Button>

                    <Field name="code">
                      {({ field, form }) => (
                        <FormControl
                          style={{ marginBottom: 12 }}
                          isInvalid={form.errors.code && form.touched.code}
                        >
                          <FormLabel htmlFor="code">Kód</FormLabel>
                          <Input {...field} id="code" type="code" />
                          <FormErrorMessage>{form.errors.code}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    
                  </Form>
                )}
              </Formik>
              
            </Flex>
          </Box>        
        </SimpleGrid>
      </Container>
    </Page>
  )
  }
  