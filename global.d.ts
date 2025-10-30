/**
 * Tell typescript how to deal with images
 * 
 * Strongly typed to be used in the expo application
 */

declare module "*.png" {
    import { ImageSourcePropType } from "react-native";
    const value: ImageSourcePropType;
    export default value;
}

declare module "*.jpg" {
    import { ImageSourcePropType } from "react-native";
    const value: ImageSourcePropType;
    export default value;
}

declare module "*.gif" {
    import { ImageSourcePropType } from "react-native";
    const value: ImageSourcePropType;
    export default value;
}

declare module "*.svg" {
    import { ImageSourcePropType } from "react-native";
    const value: ImageSourcePropType;
    export default value;
}

declare module "*.webm" {
    import { ImageSourcePropType } from "react-native";
    const value: ImageSourcePropType;
    export default value;
}