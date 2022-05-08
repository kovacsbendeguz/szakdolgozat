import {
    Heading,
    Button,
    Flex,
    Container,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage, useToast,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper
} from '@chakra-ui/react'
import { Form, Formik, Field } from 'formik'
import { useNavigate } from 'react-router-dom'
import Page from '../components/Page'
import { useEffect } from 'react'

export default function Registration({socket}) {
    const navigate = useNavigate()
    const toast = useToast()

    useEffect(() => {
        socket.off("afterRegister").on("afterRegister", (data) => {
            if (data.token === "Succes") {
                localStorage.setItem('token', data.token)
                localStorage.setItem('email', data.email)
                localStorage.setItem('userData', JSON.stringify(data.userData))
                navigate('/')
                toast({
                    position: 'top',
                    title: 'Sikeres regisztráió',
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                })
                } else {
                toast({
                    position: 'top',
                    title: data.token,
                    status: 'error',
                    duration: 1000,
                    isClosable: true,
                })
                }
        })
    })

    return (
        <Page>
        <Container>
            <Flex alignItems="center" style={{ marginBottom: 24 }}>
            <Heading>Regisztráció</Heading>
            </Flex>
            <Formik
            initialValues={{ name: '', email: '', age:18, password: '', passwordAgain: '' }}
            onSubmit={async (values, actions) => {
                socket.emit('registerDataFromForm', values)
                
                actions.setSubmitting(false)
            }}
            >
            {(props) => (
                <Form>
                <Field name="name">
                    {({ field, form }) => (
                    <FormControl
                        style={{ marginBottom: 12 }}
                        isInvalid={form.errors.name && form.touched.name}
                        isRequired
                    >
                        <FormLabel htmlFor="name">Név</FormLabel>
                        <Input {...field} id="name" type="name" />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                    )}
                </Field>
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
                <Field name="age">
                    {({ field, form }) => (
                    <FormControl
                        style={{ marginBottom: 12 }}
                        isInvalid={form.errors.number && form.touched.number}
                        isRequired
                    >
                        <FormLabel htmlFor="age">Életkor</FormLabel>
                        <NumberInput
                            id="age" 
                            type="age"
                            defaultValue={18}
                            max={200}
                            min={0}
                            keepWithinRange={true}
                            clampValueOnBlur={false}
                            allowMouseWheel
                            onChange={(v) => {
                                form.setFieldValue('age', v)}
                            }
                            >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <FormErrorMessage>{form.errors.number}</FormErrorMessage>
                    </FormControl>
                    )}
                </Field>
                <Field name="password">
                    {({ field, form }) => (
                    <FormControl
                        isInvalid={form.errors.password && form.touched.password}
                        isRequired
                    >
                        <FormLabel htmlFor="password">Jelszó</FormLabel>
                        <Input {...field} id="password" type="password" />
                        <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                    </FormControl>
                    )}
                </Field>
                <Field name="passwordAgain">
                    {({ field, form }) => (
                    <FormControl
                        isInvalid={form.errors.passwordAgain && form.touched.passwordAgain}
                        isRequired
                    >
                        <FormLabel htmlFor="passwordAgain">Jelszó újra</FormLabel>
                        <Input {...field} id="passwordAgain" type="password" />
                        <FormErrorMessage>{form.errors.passwordAgain}</FormErrorMessage>
                    </FormControl>
                    )}
                </Field>
                <Button
                    mt={4}
                    colorScheme="teal"
                    isLoading={props.isSubmitting}
                    type="submit"
                >
                    Regisztráció
                </Button>
                </Form>
            )}
            </Formik>
        </Container>
        </Page>
    )
}
  