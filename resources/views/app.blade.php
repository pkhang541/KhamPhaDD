<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'KhamPhaDD Journal') }}</title>

        <!-- Google Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&display=swap" rel="stylesheet">

        <!-- Leaflet CSS (bản đồ) -->
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
        <style>
            .leaflet-container { z-index: 1 !important; }
            .leaflet-pane { z-index: 2 !important; }
            .leaflet-control { z-index: 3 !important; }
            .leaflet-popup { z-index: 4 !important; }

            /* Label tên quán */
            .map-label {
                background: white !important;
                border: 1.5px solid #E5E1DA !important;
                border-radius: 8px !important;
                padding: 2px 8px !important;
                box-shadow: 0 2px 6px rgba(0,0,0,0.12) !important;
                font-family: 'Be Vietnam Pro', sans-serif !important;
                color: #1A1A1A !important;
            }
            .map-label::before { display: none !important; }
        </style>

        <!-- Scripts -->
        @routes(nonce: Vite::cspNonce())
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="bg-[#FBFBFB] text-[#1A1A1A] antialiased">
        @inertia
    </body>
</html>
