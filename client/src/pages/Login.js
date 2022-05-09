import {
    Heading,
    Button,
    Flex,
    Container,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage, useToast,
} from '@chakra-ui/react'
import { Form, Formik, Field } from 'formik'
import { useNavigate } from 'react-router-dom'
import Page from '../components/Page'
import { useEffect } from 'react'

export default function Login({socket}) {
    const navigate = useNavigate()
    const toast = useToast()

    useEffect(() => {
        socket.off("afterLogin").on("afterLogin", (data) => {
            if (data.token === "Succes") {
                console.log(data)
                sessionStorage.setItem('token', data.token)
                sessionStorage.setItem('email', data.email)
                sessionStorage.setItem('userData', JSON.stringify(data.userData))
                window.location.reload()
                navigate('/')
                toast({
                    position: 'top',
                    title: 'Sikeres bejelentkezés',
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                })
                } else {
                toast({
                    position: 'top',
                    title: 'Hibás e-mail cím vagy jelszó',
                    status: 'error',
                    duration: 1000,
                    isClosable: true,
                })
                }
        })
    })

    if (sessionStorage.getItem('token')) {
        return (
        <Page>
            <Container>
            <Flex alignItems="center" style={{ marginBottom: 24 }}>
                <Heading>Kijelentkezés</Heading>
            </Flex>
            <Button
                mt={4}
                colorScheme="teal"
                onClick={() => {
                sessionStorage.removeItem('token')
                sessionStorage.removeItem('email')
                sessionStorage.removeItem('userData')
                window.location.reload()
                }}
            >
                Kijelentkezés
            </Button>
            </Container>
        </Page>
        )
    }
    return (
        <Page>
        <Container>
            <Flex alignItems="center" style={{ marginBottom: 24 }}>
            <Heading>Bejelentkezés</Heading>
            </Flex>
            <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={async (values, actions) => {
                socket.emit('loginDataFromForm', values)
                
                actions.setSubmitting(false)
            }}
            >
            {(props) => (
                <Form>
                <Field name="email">
                    {({ field, form }) => (
                    <FormControl
                        style={{ marginBottom: 12 }}
                        isInvalid={form.errors.email && form.touched.email}
                        isRequired
                    >
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input {...field} id="email" type="email" />
                        <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                    </FormControl>
                    )}
                </Field>
                <Field name="password">
                    {({ field, form }) => (
                    <FormControl
                        isInvalid={form.errors.password && form.touched.password}
                        isRequired
                    >
                        <FormLabel htmlFor="email">Jelszó</FormLabel>
                        <Input {...field} id="password" type="password" />
                        <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                    </FormControl>
                    )}
                </Field>
                <Button
                    mt={4}
                    colorScheme="teal"
                    isLoading={props.isSubmitting}
                    type="submit"
                >
                    Bejelentkezés
                </Button>
                </Form>
            )}
            </Formik>
        </Container>
        </Page>
    )
}
  
