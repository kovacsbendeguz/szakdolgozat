import { extendTheme, Heading } from "@chakra-ui/react";

const selectTheme = extendTheme({
  components: {
    Button: {
        color: "green"
    },
    Select: {
      parts: ["field", "icon"],
      baseStyle: {
        field: {
          color: "pink",
          height: "200px"
        },
        icon: {
          width: "2rem",
          fontSize: "3rem"
        }
      }
    }
  }
});

export default selectTheme;