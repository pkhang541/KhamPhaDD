<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Place;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlaceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->category = Category::create([
            'name' => 'Học bài',
            'slug' => 'hoc-bai',
        ]);

        $this->place = Place::create([
            'name' => 'The Coffee House',
            'slug' => 'the-coffee-house',
            'category_id' => $this->category->id,
            'address' => '123 Test St',
            'description' => 'Test description',
            'avg_rating' => 4.5,
        ]);
    }

    public function test_can_view_home_page(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertSee('The Coffee House');
    }

    public function test_home_page_sends_security_headers(): void
    {
        $response = $this->get('/');

        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('X-Frame-Options', 'SAMEORIGIN');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->assertHeader('Cross-Origin-Resource-Policy', 'same-origin');
        $response->assertHeader('Cross-Origin-Opener-Policy', 'same-origin');
        $response->assertHeader('Permissions-Policy', 'camera=(), microphone=(), payment=(), usb=(), geolocation=(self)');

        $csp = $response->headers->get('Content-Security-Policy');

        $this->assertStringContainsString("default-src 'self'", $csp);
        $this->assertStringContainsString("object-src 'none'", $csp);
        $this->assertStringContainsString("frame-ancestors 'self'", $csp);
        $this->assertStringContainsString("frame-src 'self' https://www.openstreetmap.org", $csp);
    }

    public function test_can_view_place_detail(): void
    {
        $response = $this->get('/places/the-coffee-house');

        $response->assertStatus(200);
        $response->assertSee('The Coffee House');
        $response->assertSee('123 Test St');
    }

    public function test_can_search_places(): void
    {
        $response = $this->get('/search?q=Coffee');

        $response->assertStatus(200);
        $response->assertSee('The Coffee House');
    }

    public function test_can_view_category_places(): void
    {
        $response = $this->get('/categories/hoc-bai');

        $response->assertStatus(200);
        $response->assertSee('The Coffee House');
    }
}
