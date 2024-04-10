import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";
import { forwardRef } from "react";

type ButtonProps = {
  text: string;
  textColor: string;
  backgroundColor: string;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const Button = forwardRef<View | null, ButtonProps>(
  ({ text, textColor, backgroundColor, ...pressableProps }, ref) => {
    const styles = StyleSheet.create({
      container: {
        padding: 20,
        width: 330,
        alignItems: "center",
        borderRadius: 20,
        marginVertical: 5,
        backgroundColor: backgroundColor
      },
      text: {
        fontSize: 30,
        fontWeight: "100",
        fontFamily: "OpenSans",
        color: textColor,
      },
    });

    return (
      <Pressable ref={ref} {...pressableProps} style={styles.container}>
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    );
  }
);

export default Button;
