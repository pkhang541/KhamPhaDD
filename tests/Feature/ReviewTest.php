<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Place;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        
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
        ]);
    }

    public function test_user_can_store_review(): void
    {
        $response = $this->actingAs($this->user)
            ->post("/places/{$this->place->slug}/reviews", [
                'rating' => 5,
                'comment' => 'Great place!',
            ]);

        $response->assertStatus(302); // Redirect back
        $this->assertDatabaseHas('reviews', [
            'user_id' => $this->user->id,
            'place_id' => $this->place->id,
            'rating' => 5,
            'comment' => 'Great place!',
        ]);
    }

    public function test_user_cannot_review_twice(): void
    {
        // First review
        $this->actingAs($this->user)
            ->post("/places/{$this->place->slug}/reviews", [
                'rating' => 5,
                'comment' => 'First review',
            ]);

        // Second review
        $response = $this->actingAs($this->user)
            ->post("/places/{$this->place->slug}/reviews", [
                'rating' => 4,
                'comment' => 'Second review',
            ]);

        $response->assertSessionHasErrors(['review']);
        $this->assertDatabaseCount('reviews', 1);
    }
}
