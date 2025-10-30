import { Colors } from '../theme';
import { useColorScheme } from './useColorScheme';

export const useThemeColor = (
    props: { 
        light?: string; 
        dark?: string;
    },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) => {
    const theme = useColorScheme() ?? 'light';
    const colorFromProps = props[theme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[theme][colorName];
    }
};
