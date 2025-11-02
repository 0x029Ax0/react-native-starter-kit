import { useThemeColor } from '@/lib/theme';
import { Control, Controller, FieldError, FieldPath, FieldValues, PathValue, RegisterOptions } from 'react-hook-form';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

/**
 * Absolute-minimum TextField for React Native + React Hook Form.
 * - Label
 * - Error message from RHF
 * - Strong TS types
 */

type FormTextFieldProps<TFieldValues extends FieldValues> = {
    name: FieldPath<TFieldValues>;
    control: Control<TFieldValues>;
    rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>;
    label?: string;
    error?: FieldError;
    defaultValue?: string;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'>;

export function FormTextField<TFieldValues extends FieldValues = FieldValues>({
    name,
    control,
    rules,
    label,
    error,
    defaultValue = '',
    ...inputProps
}: FormTextFieldProps<TFieldValues>) {
    const textColor = useThemeColor({ light: "#000", dark: "#fff" }, 'text');
    const textColorPlaceholder = useThemeColor({ light: "#333", dark: "#ccc" }, 'text');
    
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            defaultValue={defaultValue as PathValue<TFieldValues, FieldPath<TFieldValues>>}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View style={styles.root}>
                    {label ? (
                        <Text style={[styles.label, { color: textColor }, error && styles.labelError]}>{label}</Text>
                    ) : null}

                    <TextInput
                        style={[styles.input, error && styles.inputError]}
                        value={String(value ?? '')}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        selectionColor="#fff"
                        placeholderTextColor={textColorPlaceholder}
                        autoCapitalize={inputProps.autoCapitalize ?? 'none'}
                        {...inputProps}
                    />

                    {error?.message ? (
                        <Text style={styles.error}>{error.message}</Text>
                    ) : null}
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    root: { 
        width: '100%', 
        marginBottom: 10
    },
    label: { 
        fontSize: 14, 
        marginBottom: 6, 
        fontWeight: '600', 
        color: '#111827'
    },
    labelError: { color: '#d93025' },
    input: {
        borderWidth: 1,
        // borderColor: '#d1d5db',
        borderColor: '#aaa',
        borderRadius: 3,
        backgroundColor: "#000",
        color: "#fff",
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        outlineWidth: 0,
    },
    inputError: { borderColor: '#d93025' },
    error: { marginTop: 6, fontSize: 12, color: '#d93025' },
});

/**
 * Usage
 *
 * import { useForm } from 'react-hook-form';
 *
 * type FormData = { email: string };
 *
 * const { control, handleSubmit } = useForm<FormData>({
 *   defaultValues: { email: '' },
 * });
 *
 * <FormTextField
 *   control={control}
 *   name="email"
 *   label="Email"
 *   placeholder="you@example.com"
 *   rules={{ required: 'Email is required' }}
 * />
 */
