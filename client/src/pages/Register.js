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
    NumberDecrementStepper,
    InputRightElement,
    InputGroup
} from '@chakra-ui/react'
import { Form, Formik, Field } from 'formik'
import { useNavigate } from 'react-router-dom'
import Page from '../components/Page'
import { useEffect, useState } from 'react'

export default function Registration({socket}) {
    const navigate = useNavigate()
    const toast = useToast()
	const [show, setShow] = useState(false)

    useEffect(() => {
        socket.off("afterRegister").on("afterRegister", (data) => {
            if (data.token === "Succes") {
                sessionStorage.setItem('token', data.token)
                sessionStorage.setItem('email', data.email)
                sessionStorage.setItem('userData', JSON.stringify(data.userData))
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
        <Container
            borderRadius={'30px'}
            padding={'1em'}
            backgroundColor={'rgb(233, 48, 56, 0.01)'}
            shadow= '0px 0px 60px 1px #e93038'
            color= 'white'>
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
                        <Input focusBorderColor='#e93038'
                            colorScheme='red'{...field} id="name" type="name" />
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
                        <Input focusBorderColor='#e93038'
                            colorScheme='red'{...field} id="email" type="email" />
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
                            focusBorderColor='#e93038'
                            colorScheme='red'
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
                        <InputGroup size='md'>
                            <Input 
                                focusBorderColor='#e93038'
                                colorScheme='red'
                                {...field}
                                id="password" 
                                type={show ? 'text' : 'password'}
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' backgroundColor="#2e3136"
                                    border={'1px'} borderColor={'#e93038'}
                                    _hover={{
                                        bg: 'rgb(233, 48, 56, 0.8)',
                                        color: 'white',
                                        shadow: '0px 0px 60px 1px #e93038',
                                      }}
                                    onClick={() => {
                                    setShow(!show)
                                }}>
                                {show ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
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
                        <InputGroup size='md'>
                            <Input 
                                focusBorderColor='#e93038'
                                colorScheme='red' 
                                {...field} 
                                id="passwordAgain" 
                                type={show ? 'text' : 'password'}
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' backgroundColor="#2e3136"
                                    border={'1px'} borderColor={'#e93038'}
                                    _hover={{
                                        bg: 'rgb(233, 48, 56, 0.8)',
                                        color: 'white',
                                        shadow: '0px 0px 60px 1px #e93038',
                                      }}
                                    onClick={() => {
                                    setShow(!show)
                                }}>
                                {show ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>{form.errors.passwordAgain}</FormErrorMessage>
                    </FormControl>
                    )}
                </Field>
                <Button
                    mt={4}
                    backgroundColor="#2e3136"
                    border={'1px'}
                    borderColor={'#e93038'}
                    _hover={{
                        bg: 'rgb(233, 48, 56, 0.8)',
                        color: 'white',
                        shadow: '0px 0px 60px 1px #e93038',
                      }}
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
  
