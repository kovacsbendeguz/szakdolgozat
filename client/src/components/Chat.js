import {
    Box,
    Heading,
    Text,
  } from '@chakra-ui/react'

const Chat = (data) => {
    const {text, from, time} = data
    
    return (
    <Box background={"blue"}>
        <Heading size={'sm'}>{from}</Heading>
        <Text>{text}</Text>
        <Text size={'sm'}>{time}</Text>
    </Box>
    )
}
  
export default Chat