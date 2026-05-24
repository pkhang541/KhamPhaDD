<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Vite;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $nonce = Vite::useCspNonce();
        $response = $next($request);

        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Cross-Origin-Resource-Policy', 'same-origin');
        $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), payment=(), usb=(), geolocation=(self)');
        $response->headers->set('Content-Security-Policy', $this->contentSecurityPolicy($nonce));

        return $response;
    }

    private function contentSecurityPolicy(string $nonce): string
    {
        $directives = [
            "default-src 'self'",
            "base-uri 'self'",
            "object-src 'none'",
            "frame-ancestors 'self'",
            "form-action 'self'",
            "script-src 'self' 'nonce-{$nonce}'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com",
            "font-src 'self' data: https://fonts.gstatic.com",
            "img-src 'self' data: blob: https:",
            "connect-src 'self' https://nominatim.openstreetmap.org https://oauth2.googleapis.com",
            "frame-src 'self' https://www.openstreetmap.org",
            "manifest-src 'self'",
        ];

        if (app()->isLocal()) {
            $directives[5] .= " 'unsafe-eval' http://localhost:* http://127.0.0.1:*";
            $directives[6] .= ' http://localhost:* http://127.0.0.1:*';
            $directives[9] .= ' http://localhost:* http://127.0.0.1:* ws: wss:';
        } else {
            $directives[] = 'upgrade-insecure-requests';
        }

        return implode('; ', $directives) . ';';
    }
}
