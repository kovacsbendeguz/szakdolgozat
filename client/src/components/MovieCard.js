import {
    SimpleGrid,
    Box,
    Image,
    Heading,
    Text,
    Grid,
    GridItem,
    Link,
  } from '@chakra-ui/react'

const MovieCard = (data) => {
    const {image_url, title, plot, release, rating, movie_length, trailer} = data
    
    return (
    <Box>
        <SimpleGrid columns={{sm: 2, md: 2}} spacing={30}>
            <Box>
            <Image maxW='100%' minH='md' src={image_url} />
            </Box>
            <Box>
                <Grid templateColumns='repeat(1, 6fr)' gap={6}>
                    <GridItem w='100%' h='10' bg='blue.500'>
                        <Heading size='md'>Title</Heading>
                        <Text>{title}</Text>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='blue.500'>
                        <Heading size='md'>Plot</Heading>
                        <Text>{sessionStorage.getItem('email') ? plot : 'Please register or log in for this'}</Text>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='blue.500'>
                        <Heading size='md'>Release</Heading>
                        <Text>{release}</Text>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='blue.500'>
                        <Heading size='md'>Rating</Heading>
                        <Text>{rating}</Text>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='blue.500'>
                        <Heading size='md'>Length</Heading>
                        <Text>{movie_length}</Text>
                    </GridItem>
                    <GridItem w='100%' h='10' bg='blue.500'>
                        <Heading size='md'>Trailer</Heading>
                        {sessionStorage.getItem('email') ? 
                            <Link href={trailer} isExternal={true}>{trailer}</Link>
                            : 
                            <Text>{sessionStorage.getItem('email') ? plot : 'Please register or log in for this'}</Text>
                    }
                    </GridItem>
                </Grid>
            </Box>
        </SimpleGrid>
    </Box>
    )
}
  
export default MovieCard
