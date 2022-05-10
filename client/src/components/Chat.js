import {
    Box,
    Heading,
    Text,
  } from '@chakra-ui/react'

const Chat = (data) => {
    const {text, from, time} = data
    
    if(from === 'Me'){
        return (
            <Box
                left={'1px'} 
                width={'20%'}
                background={"rgb(233, 48, 56, 0.8)"}
            >
                <Heading size={'sm'}>{from}</Heading>
                <Text>{text}</Text>
                <Text size={'sm'}>{time}</Text>
            </Box>
        )
    }

    return (
    <Box 
        width={'80%'}
        float='right'
        background={"blue"}
    >
        <Heading 
            marginRight={'1px'}
            size={'sm'}>{from}</Heading>
        <Text>{text}</Text>
        <Text size={'sm'}>{time}</Text>
    </Box>
    )
}
  
export default Chat
