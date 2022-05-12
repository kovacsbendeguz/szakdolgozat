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
    const movie_length_withhours = Math.floor(movie_length/60) + 'h ' + (movie_length%60) + 'm'
    
    return (
    <Box>
        <SimpleGrid columns={{sm: 1, md: 2}} spacing={30}>
            <Box>
            <Image maxW='100%' minH='sm' src={image_url} />
            </Box>
            <Box overflow-wrap= 'anywhere'>
                <Grid templateColumns='repeat(1, 6fr)' gap={6}>
                    <GridItem wordBreak={'break-word'} borderBottomWidth={'1px'}>
                        <Heading size='md'>Title</Heading>
                        <Text>{title}</Text>
                    </GridItem>
                    <GridItem wordBreak={'break-word'} borderBottomWidth={'1px'}>
                        <Heading size='md'>Plot</Heading>
                        <Text color={sessionStorage.getItem('email') ? 'white' : 'red'}>{sessionStorage.getItem('email') ? plot : 'Please register or log in for this'}</Text>
                    </GridItem>
                    <GridItem wordBreak={'break-word'} borderBottomWidth={'1px'}>
                        <Heading  size='md'>Release</Heading>
                        <Text>{release}</Text>
                    </GridItem>
                    <GridItem wordBreak={'break-word'} borderBottomWidth={'1px'}>
                        <Heading  size='md'>Rating (IMDB)</Heading>
                        <Text>{rating}</Text>
                    </GridItem>
                    <GridItem wordBreak={'break-word'} borderBottomWidth={'1px'}>
                        <Heading  size='md'>Length</Heading>
                        <Text>{movie_length_withhours}</Text>
                    </GridItem>
                    <GridItem wordBreak={'break-word'} borderBottomWidth={'1px'}>
                        <Heading  size='md'>Trailer</Heading>
                        {sessionStorage.getItem('email') ? 
                            <Link href={trailer} isExternal={true}>{trailer}</Link>
                            : 
                            <Text color={'red'} >Please register or log in for this</Text>
                    }
                    </GridItem>
                </Grid>
            </Box>
        </SimpleGrid>
    </Box>
    )
}
  
export default MovieCard
