import {
    Button,
    Container,
    Flex,
    FormControl,
    FormLabel,
    NumberInput,
    NumberInputStepper,
    NumberInputField,
    NumberIncrementStepper,
    NumberDecrementStepper,
    RadioGroup,
    Stack,
    Heading,
    Radio,
    FormErrorMessage,
    Select
  } from '@chakra-ui/react'
import { useState } from 'react'
import { Form, Formik, Field } from 'formik'
import { useNavigate } from 'react-router-dom'
import selectTheme from '../themes/select'
import Page from '../components/Page'

export default function NewRoom({socket}) {
    const navigate = useNavigate()

    const genres = [ "SKIP", "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", 
        "Drama", "Family", "Fantasy", "History", "Horror", "Musical", "Music", "Mystery", 
        "Romance", "Sport", "Thriller", "War", "Western" ]

    const [button, setButton] = useState()

    const code = sessionStorage.getItem('code')
    
    return(
    <Page>
      <Container 
        borderRadius={'30px'}
        padding={'1em'}
        backgroundColor={'rgb(233, 48, 56, 0.01)'}
        shadow= '0px 0px 60px 1px #e93038'
        color= 'white'
        >
      <Flex alignItems="center" style={{ marginBottom: 24 }}>
        <Heading>Szoba létrehozás</Heading>
      </Flex>
      <Formik
        initialValues={{
            genre: "SKIP",
            rating: 0,
            length: 600,
            matchMaking: "half"
        }}
        onSubmit={async (values, actions) => {
          actions.setSubmitting(true)

          if(button === "continue") {
            socket.emit('preferenciesContinue', values)
            navigate(`/room/${code}`)

          }
          else if(button === "newSearch"){
            socket.emit('preferenciesNew', values)
            navigate(`/room/${code}`)

          }
        }}
      >
        {(props) => (
          <Form>
            <Field name="genre">
                {({ field, form }) => (
                <FormControl
                    style={{ marginBottom: 12 }}
                    isInvalid={form.errors.number && form.touched.number}
                >
                    <FormLabel htmlFor="genre">Genre</FormLabel>
                    <Select textColor={'white'}
                        focusBorderColor='#e93038'
                        onChange={(v) => {
                        form.setFieldValue('genre', v.target.value)
                      }}
                    >
                      {genres.map((genre) => {
                        return (<option style={{ color: 'white', background:"#2e3136" }} key={genre}>{genre}</option>)
                      })}
                    </Select>
                    <FormErrorMessage>{form.errors.number}</FormErrorMessage>
                </FormControl>
                )}
            </Field>
            <Field name="rating">
                {({ field, form }) => (
                <FormControl
                    style={{ marginBottom: 12 }}
                    isInvalid={form.errors.number && form.touched.number}
                >
                    <FormLabel htmlFor="rating">Minimum rating</FormLabel>
                    <NumberInput
                        focusBorderColor='#e93038'
                        id="rating" 
                        type="rating"
                        max={7}
                        min={0}
                        keepWithinRange={true}
                        clampValueOnBlur={false}
                        allowMouseWheel
                        onChange={(v) => {
                            form.setFieldValue('rating', v)}
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
            <Field name="length">
                {({ field, form }) => (
                <FormControl
                    style={{ marginBottom: 12 }}
                    isInvalid={form.errors.number && form.touched.number}
                >
                    <FormLabel htmlFor="length">Maximum length (min)</FormLabel>
                    <NumberInput
                        id="length" 
                        type="length"
                        step={10}
                        max={600}
                        min={150}
                        keepWithinRange={true}
                        clampValueOnBlur={false}
                        allowMouseWheel
                        onChange={(v) => {
                            form.setFieldValue('length', v)}
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
            <Field name="matchMaking">
                {({ field, form }) => (
                <FormControl
                    style={{ marginBottom: 12 }}
                    isInvalid={form.errors.number && form.touched.number}
                >
                    <FormLabel htmlFor="matchMaking">How many people required for match</FormLabel>
                    <RadioGroup
                          id="publishType"
                          value={field.value}
                          onChange={(val) => form.setFieldValue('matchMaking', val)}
                        >
                          <Stack direction="row" marginBottom={3}>
                            <Radio colorScheme='red' value="two">At least 2</Radio>
                            <Radio colorScheme='red' value="half" defaultChecked >At least 50%</Radio>
                            <Radio colorScheme='red' value="all">All</Radio>
                          </Stack>
                        </RadioGroup>
                    <FormErrorMessage>{form.errors.number}</FormErrorMessage>
                </FormControl>
                )}
            </Field>
            <Button
                name={"continue"}
                mt={4}
                backgroundColor="#2e3136"
                border={'1px'}
                borderColor={'#e93038'}
                _hover={JSON.parse(sessionStorage.getItem('started')) ? {
                  bg: 'rgb(233, 48, 56, 0.8)',
                  color: 'white',
                  shadow: '0px 0px 60px 1px #e93038',
                } : "none"}
                isLoading={props.isSubmitting}
                type="submit"
                disabled={!JSON.parse(sessionStorage.getItem('started'))}
                onClick={(e) => {
                  setButton(e.target.name)
                }}
            >
                Régi keresés folytatása
            </Button>
            <Button
                name={"newSearch"}
                marginLeft='1em'
                marginRight='1em'
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
                onClick={(e) => {
                  setButton(e.target.name)
                }}
            >
                Új keresés
            </Button>
            <Button
                mt={4}
                backgroundColor="#2e3136"
                border={'1px'}
                borderColor={'#e93038'}
                _hover={JSON.parse(sessionStorage.getItem('started')) ? {
                  bg: 'rgb(233, 48, 56, 0.8)',
                  color: 'white',
                  shadow: '0px 0px 60px 1px #e93038',
                } : "none"}
                isLoading={props.isSubmitting}
                disabled={!JSON.parse(sessionStorage.getItem('started'))}
                onClick={() => {
                  navigate(`/room/${code}`)
                }}
            >
                Vissza
            </Button>
          </Form>
        )}
      </Formik>
      </Container>
    
    </Page>
      )
}

/*<RadioGroup
                          id="publishType"
                          value={field.value}
                          onChange={(val: 'draft' | 'now' | 'later') => form.setFieldValue('publishType', val)}
                        >
                          <Stack direction="row" marginBottom={3}>
                            <Radio value="draft">Piszkozat</Radio>
                            <Radio value="now">Azonnali közzététel</Radio>
                            <Radio value="later">Időzítés</Radio>
                          </Stack>
                        </RadioGroup> */

/*
            <Flex flex={1} gap={6}>
                <Box
                  w="30%"
                  borderRadius="lg"
                  borderWidth="1px"
                  p={4}
                  boxShadow="sm"
                >
                  <FormControl isRequired>
                    <FormLabel htmlFor="publishType">Publikálás</FormLabel>
                    <Field name="publishType">
                      {({ field, form }) => (
                        <RadioGroup
                          id="publishType"
                          value={field.value}
                          onChange={(val) => form.setFieldValue('publishType', val)}
                        >
                          <Stack direction="row" marginBottom={3}>
                            <Radio value="draft">Piszkozat</Radio>
                            <Radio value="now">Azonnali közzététel</Radio>
                            <Radio value="later">Időzítés</Radio>
                          </Stack>
                        </RadioGroup>
                      )}
                    </Field>
                  </FormControl>
                  <FormControl mt={5}>
                    <FormLabel htmlFor="genres">Kapcsolódó esemény</FormLabel>
                    <Field name="genres">
                      {({ field, form }) => (
                        <Select
                          value={field.value.map((c) => ({ label: c.title, value: c.id }))}
                          onChange={(cats) => form.setFieldValue('genres', cats.map((c) => ({ id: c.value, title: c.label })))}
                          placeholder="Esemény választása..."
                          closeMenuOnSelect={false}
                          isMulti
                          options={genres.map((event) => ({
                            label: event,
                            value: event,
                          }))}
                        />
                      )}
                    </Field>
                  </FormControl>
                </Box>
              </Flex>*/


/*


<Box
                w="70%"
                borderRadius="lg"
                borderWidth="1px"
                p={4}
                boxShadow="sm"
            >
                <FormControl mt={5}>
                    <FormLabel htmlFor="events">Kapcsolódó esemény</FormLabel>
                    <Field name="events">
                      {({ field, form }) => (
                        <Select
                          value={field.value.map((c) => ({ label: c, value: c }))}
                          onChange={(cats) => form.setFieldValue('events', cats.map((c) => ({ id: c.value, title: c.label })))}
                          placeholder="Esemény választása..."
                          closeMenuOnSelect={false}
                          isMulti
                          options={genres.map((event) => ({
                            label: event,
                            value: event,
                          }))}
                        />
                      )}
                    </Field>
                  </FormControl>
            </Box>
 */
/*
const genres = [ "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", 
        "Drama", "Family", "Fantasy", "History", "Horror", "Musical", "Music", "Mystery", 
        "Romance", "Sport", "Thriller", "War", "Western", "SKIP" ]

    return (
        <Page>
        <SimpleGrid columns={4} spacing={50}>
                {genres.map((genre) => (
                <Button colorScheme='teal' size='lg' onClick={() => {
                    socket.emit('genre', genre)
                    navigate(`/room/${code}`)
                }}>
                    {genre}
                </Button>
            ))}
            </SimpleGrid>
        </Page>
    )
 */
