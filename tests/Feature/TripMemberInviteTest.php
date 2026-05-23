<?php

namespace Tests\Feature;

use App\Models\Trip;
use App\Models\Category;
use App\Models\Place;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TripMemberInviteTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_find_registered_user_by_email_for_trip_invite(): void
    {
        $owner = User::factory()->create();
        $member = User::factory()->create([
            'uid' => '1234567890',
            'name' => 'Invite Member',
            'email' => 'member@example.com',
        ]);

        $response = $this->actingAs($owner)->getJson('/users/by-email?email=member@example.com');

        $response->assertOk()
            ->assertJson([
                'id' => $member->id,
                'uid' => '1234567890',
                'name' => 'Invite Member',
                'email' => 'member@example.com',
            ]);
    }

    public function test_can_find_registered_user_by_uid_for_trip_invite(): void
    {
        $owner = User::factory()->create();
        $member = User::factory()->create([
            'uid' => '2345678901',
            'name' => 'Uid Member',
            'email' => 'uid-member@example.com',
        ]);

        $response = $this->actingAs($owner)->getJson('/users/by-email?identifier=2345678901');

        $response->assertOk()
            ->assertJson([
                'id' => $member->id,
                'uid' => '2345678901',
                'name' => 'Uid Member',
                'email' => 'uid-member@example.com',
            ]);
    }

    public function test_new_users_get_numeric_uid(): void
    {
        $user = User::factory()->create();

        $this->assertMatchesRegularExpression('/^[0-9]{10}$/', $user->uid);
    }

    public function test_cannot_invite_email_without_an_account(): void
    {
        $owner = User::factory()->create();

        $response = $this->actingAs($owner)->getJson('/users/by-email?email=missing@example.com');

        $response->assertNotFound()
            ->assertJson([
                'message' => 'Email hoặc UID này chưa có tài khoản. Người được mời cần đăng ký trước.',
            ]);
    }

    public function test_trip_store_requires_invited_emails_to_belong_to_existing_users(): void
    {
        $owner = User::factory()->create();

        $response = $this->actingAs($owner)->from('/trips')->post('/trips', [
            'title' => 'Trip with missing member',
            'invited_emails' => ['missing@example.com'],
        ]);

        $response->assertRedirect('/trips');
        $response->assertSessionHasErrors('invited_emails.0');
        $this->assertDatabaseMissing('trips', [
            'title' => 'Trip with missing member',
        ]);
    }

    public function test_trip_store_requires_at_least_one_place(): void
    {
        $owner = User::factory()->create();

        $response = $this->actingAs($owner)->from('/trips')->post('/trips', [
            'title' => 'Trip without places',
        ]);

        $response->assertRedirect('/trips');
        $response->assertSessionHasErrors('place_ids');
        $this->assertDatabaseMissing('trips', [
            'title' => 'Trip without places',
        ]);
    }

    public function test_trip_store_accepts_registered_invited_members(): void
    {
        $owner = User::factory()->create();
        $member = User::factory()->create([
            'email' => 'member@example.com',
        ]);
        Category::create(['name' => 'Cafe', 'slug' => 'cafe']);
        $place = Place::factory()->create();

        $this->actingAs($owner)->post('/trips', [
            'title' => 'Trip with member',
            'invited_emails' => [$member->email],
            'place_ids' => [$place->id],
        ])->assertRedirect();

        $this->assertDatabaseHas('trips', [
            'title' => 'Trip with member',
            'user_id' => $owner->id,
            'members' => 2,
        ]);
        $this->assertSame(1, Trip::count());
    }
}
