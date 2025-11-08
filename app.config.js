export default {
    "expo": {
        "name": "zero",
        "slug": "zero",
        "version": "1.0.0",
        "orientation": "portrait",
        "icon": "./assets/images/icon.png",
        "scheme": "zero",
        "userInterfaceStyle": "automatic",
        "newArchEnabled": true,
        "ios": {
            "supportsTablet": true
        },
        "android": {
            "adaptiveIcon": {
                "backgroundColor": "#E6F4FE",
                "foregroundImage": "./assets/images/android-icon-foreground.png",
                "backgroundImage": "./assets/images/android-icon-background.png",
                "monochromeImage": "./assets/images/android-icon-monochrome.png"
            },
            "edgeToEdgeEnabled": true,
            "predictiveBackGestureEnabled": false,
            "package": "com.anonymous.app.zero",
            "permissions": [
                "android.permission.RECORD_AUDIO"
            ]
        },
        "web": {
            "output": "static",
            "favicon": "./assets/images/favicon.png"
        },
        "plugins": [
            "expo-router",
            "expo-secure-store",
            "expo-web-browser",
            [
                "expo-splash-screen",
                {
                    "image": "./assets/images/splash-icon.png",
                    "imageWidth": 200,
                    "resizeMode": "contain",
                    "backgroundColor": "#111111",
                    "dark": {
                        "backgroundColor": "#111111"
                    }
                }
            ],
            [
                "expo-font",
                {
                    "fonts": [
                        "./assets/fonts/FiraCode/ttf/FiraCode-Bold.ttf",
                        "./assets/fonts/FiraCode/ttf/FiraCode-Light.ttf",
                        "./assets/fonts/FiraCode/ttf/FiraCode-Medium.ttf",
                        "./assets/fonts/FiraCode/ttf/FiraCode-Regular.ttf",
                        "./assets/fonts/FiraCode/ttf/FiraCode-Retina.ttf",
                        "./assets/fonts/FiraCode/ttf/FiraCode-Semibold.ttf"
                    ],
                    "android": {
                        "fonts": [
                            {
                                "fontFamily": "FiraCode",
                                "fontDefinitions": [
                                    {
                                        "path": "./assets/fonts/FiraCode/ttf/FiraCode-Bold.ttf",
                                        "weight": 700
                                    },
                                    {
                                        "path": "./assets/fonts/FiraCode/ttf/FiraCode-SemiBold.ttf",
                                        "weight": 600
                                    },
                                    {
                                        "path": "./assets/fonts/FiraCode/ttf/FiraCode-Medium.ttf",
                                        "weight": 500
                                    },
                                    {
                                        "path": "./assets/fonts/FiraCode/ttf/FiraCode-Regular.ttf",
                                        "weight": 400
                                    },
                                    {
                                        "path": "./assets/fonts/FiraCode/ttf/FiraCode-Light.ttf",
                                        "weight": 300
                                    }
                                ]
                            }
                        ]
                    },
                    "ios": {
                        "fonts": [
                            "./assets/fonts/FiraCode/ttf/FiraCode-Retina.ttf"
                        ]
                    }
                }
            ],
            [
                "expo-image-picker",
                {
                    "photosPermission": "The app accesses your photos so you can upload a custom avatar for your profile."
                }
            ]
        ],
        "experiments": {
            "typedRoutes": true,
            "reactCompiler": true
        },
        "extra": {
            "EXPO_PUBLIC_API_BASE_URL": process.env.EXPO_PUBLIC_API_BASE_URL,
            "EXPO_PUBLIC_API_TOKEN_STORAGE_KEY": process.env.EXPO_PUBLIC_API_TOKEN_STORAGE_KEY,
            "router": {},
            "eas": {
                "projectId": "1b973f34-5ff8-4805-a73d-f5f89b1cfb66"
            }
        }
    }
}
